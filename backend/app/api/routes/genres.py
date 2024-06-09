from fastapi import APIRouter, HTTPException, status

from app.api.deps import SessionDep, CurrentUser
from app.models.genre import GenresApi, GenresPublic, GenrePublic
from app.models.message import Message
from app.persistence import genre_crud
from app.services.external.igdb_client import igdb_client

"""
This file contains the routes for genres. It includes the following routes:

1. Get all genres
2. Update user's favorite genres
3. Add a genre to user's favorite genres
4. Delete a genre from user's favorite genres
5. Get user's favorite genres

Each route is responsible for handling the request and response. 
It uses the genre_crud service to interact with the database.
The routes are protected by the dependency injection of the current user and the session.

"""

router = APIRouter()


@router.get("/genres", response_model=list[str])
def read_genres(current_user: CurrentUser, offset: int = 0, limit: int = 25) -> list[str]:
    genres_igdb = igdb_client.fetch_genres(offset=offset, limit=limit)
    genres_api = GenresApi.model_validate(genres_igdb)
    genre_names = GenresPublic.parse_genres_api(genres_api).genres
    return genre_names


@router.put("/user/genres", response_model=GenresPublic)
def update_user_genres(
        session: SessionDep, current_user: CurrentUser, genres_in: GenresPublic
) -> GenresPublic:
    genre_crud.update_favorite_genres(session=session, user=current_user, genre_names=genres_in.genres)
    genre_names = genre_crud.get_favorite_genre_names(user=current_user)
    return GenresPublic.model_validate({"genres": genre_names})


@router.post("/user/genres", response_model=GenrePublic)
def add_user_genre(session: SessionDep, current_user: CurrentUser, genre_in: GenrePublic) -> GenrePublic:
    if genre_crud.is_favorite_genre(session=session, user=current_user, genre_name=genre_in.name):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"{genre_in.genre} already exists in user's favorite genres")

    genre = genre_crud.add_favorite_genre(session=session, user=current_user, genre_name=genre_in.name)
    return GenrePublic.model_validate(genre)


@router.delete("/user/genres/{genre_name}", response_model=Message)
def delete_user_genre(session: SessionDep, current_user: CurrentUser, genre_name: str) -> Message:
    if not genre_crud.is_favorite_genre(session=session, user=current_user, genre_name=genre_name):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"{genre_name} not found in user's favorite genres")

    genre_crud.remove_favorite_genre(session=session, user=current_user, genre_name=genre_name)
    return Message(message=f"{genre_name} deleted successfully")


@router.get("/user/genres", response_model=list[str])
def read_user_genres(current_user: CurrentUser) -> list[str]:
    genre_names = genre_crud.get_favorite_genre_names(user=current_user)
    return genre_names
