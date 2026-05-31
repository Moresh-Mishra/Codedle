from __future__ import annotations

from datetime import datetime
from hashlib import sha256
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel, Field
from pymongo.errors import DuplicateKeyError

from ..db import ensure_user_indexes, get_users_collection

router = APIRouter(tags=["auth"])

_tokens: dict[str, str] = {}


class AuthPayload(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=6, max_length=255)


class RegisterPayload(AuthPayload):
    username: str = Field(min_length=3, max_length=50)


def _normalize_email(email: str) -> str:
    normalized = email.strip().lower()
    if "@" not in normalized:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid email format")
    return normalized


def _hash_password(password: str) -> str:
    return sha256(password.encode("utf-8")).hexdigest()


def _serialize_user(user: dict) -> dict:
    return {
        "id": user["_id"],
        "username": user["username"],
        "email": user["email"],
        "created_at": user["created_at"],
        "streak_current": user["streak_current"],
        "streak_best": user["streak_best"],
        "streak_freeze": user["streak_freeze"],
        "last_played_date": user["last_played_date"],
    }


def _issue_token(user_id: str) -> str:
    token = str(uuid4())
    _tokens[token] = user_id
    return token


def _get_user_from_token(authorization: Optional[str]) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    token = authorization.removeprefix("Bearer ").strip()
    user_id = _tokens.get(token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    users_collection = get_users_collection()
    user = users_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    return user


@router.post("/auth/register")
def register_user(payload: RegisterPayload):
    users_collection = get_users_collection()
    ensure_user_indexes()

    email_key = _normalize_email(payload.email)
    username_key = payload.username.strip().lower()

    if users_collection.find_one({"email": email_key}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")

    if users_collection.find_one({"username_lower": username_key}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already in use")

    user_id = str(uuid4())
    user = {
        "_id": user_id,
        "username": payload.username.strip(),
        "username_lower": username_key,
        "email": email_key,
        "password_hash": _hash_password(payload.password),
        "created_at": datetime.utcnow(),
        "streak_current": 0,
        "streak_best": 0,
        "streak_freeze": 0,
        "last_played_date": None,
    }

    try:
        users_collection.insert_one(user)
    except DuplicateKeyError as error:
        error_message = str(error)
        if "email" in error_message:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")
        if "username" in error_message:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already in use")
        raise

    token = _issue_token(user_id)
    return {"token": token, "user": _serialize_user(user)}


@router.post("/auth/login")
def login_user(payload: AuthPayload):
    users_collection = get_users_collection()
    email_key = _normalize_email(payload.email)

    user = users_collection.find_one({"email": email_key})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if user["password_hash"] != _hash_password(payload.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = _issue_token(user["_id"])
    return {"token": token, "user": _serialize_user(user)}


@router.get("/auth/me")
def get_current_user(authorization: Optional[str] = Header(default=None)):
    user = _get_user_from_token(authorization)
    return {"user": _serialize_user(user)}


@router.post("/auth/logout")
def logout_user(authorization: Optional[str] = Header(default=None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ").strip()
        _tokens.pop(token, None)

    return {"status": "ok"}