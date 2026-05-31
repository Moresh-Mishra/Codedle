import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import auth, game, health

app = FastAPI(title="Codedle API", version="0.1.0")

default_cors_origins = [
	"http://localhost:5173",
	"http://127.0.0.1:5173",
]

cors_origins = [
	origin.strip()
	for origin in os.getenv("CORS_ORIGINS", ",".join(default_cors_origins)).split(",")
	if origin.strip()
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=cors_origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(game.router, prefix="/api")
