from sqlmodel import Session, select
from app.models.genre import Genre
from app.models.user import User

"""
Este módulo implementa operaciones CRUD para el modelo Genre.

"""


def create_genre(*, session: Session, genre_name: str) -> Genre:
    genre = Genre.model_validate({"name": genre_name})
    session.add(genre)
    session.commit()
    session.refresh(genre)
    return genre


def get_genre_by_name(*, session: Session, genre_name: str) -> Genre | None:
    return session.exec(select(Genre).where(Genre.name == genre_name)).first()


def is_favorite_genre(*, session: Session, user: User, genre_name: str) -> bool:
    genre = session.exec(select(Genre).where(Genre.name == genre_name)).first()
    return genre in user.favorite_genres if genre else False


def add_favorite_genre(*, session: Session, user: User, genre_name: str) -> Genre:
    statement = select(Genre).where(Genre.name == genre_name)
    genre = session.exec(statement).first()
    if not genre:
        genre = create_genre(session=session, genre_name=genre_name)
    if genre not in user.favorite_genres:
        user.favorite_genres.append(genre)
        session.commit()
        session.refresh(user)
    return genre


def remove_favorite_genre(*, session: Session, user: User, genre_name: str) -> None:
    genre = session.exec(select(Genre).where(Genre.name == genre_name)).first()
    if genre and genre in user.favorite_genres:
        user.favorite_genres.remove(genre)
        session.commit()
        session.refresh(user)


def update_favorite_genres(*, session: Session, user: User, genre_names: list[str]) -> None:
    user.favorite_genres.clear()
    for genre_name in genre_names:
        add_favorite_genre(session=session, user=user, genre_name=genre_name)
    session.commit()
    session.refresh(user)


def get_favorite_genre_names(*, user: User) -> list[str]:
    return [genre.name for genre in user.favorite_genres]
