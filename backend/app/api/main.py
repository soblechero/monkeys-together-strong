from fastapi import APIRouter

from app.api.routes import auth, games, genres

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(genres.router, tags=["genres"])
api_router.include_router(games.router, tags=["games"])
