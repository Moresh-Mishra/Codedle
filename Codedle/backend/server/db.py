from functools import lru_cache
import os

from pymongo import MongoClient


@lru_cache(maxsize=1)
def get_mongo_client() -> MongoClient:
	mongo_uri = os.getenv("MONGO_URI")
	if not mongo_uri:
		raise RuntimeError("MONGO_URI is required")

	return MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)


def get_database():
	database_name = os.getenv("MONGO_DB_NAME")
	client = get_mongo_client()

	if database_name:
		return client[database_name]

	try:
		return client.get_default_database()
	except Exception:
		return client["codedle"]


def get_users_collection():
	return get_database()["users"]


def ensure_user_indexes() -> None:
	users_collection = get_users_collection()
	users_collection.create_index("email", unique=True, name="idx_users_email")
	users_collection.create_index("username_lower", unique=True, name="idx_users_username_lower")