from sqlmodel import SQLModel, Field, Relationship

from app.models import User, Game, Genre

"""
Se ha separado la lógica de las relaciones en un módulo aparte, para evitar problemas de importación circular. 
Ya que para poder crear las tablas de base de datos con SQLModel es necesario que las tablas estén creadas 
antes que las relaciones.

"""


class UserGenreLink(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    genre_id: int | None = Field(default=None, foreign_key="genre.id", primary_key=True)


class UserGameLink(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    game_id: int | None = Field(default=None, foreign_key="game.id", primary_key=True)


# Se llama en app/models/__init__.py, para que se ejecute al importar el módulo
def setup_relationships():
    User.update_forward_refs()
    Game.update_forward_refs()
    Genre.update_forward_refs()
    User.favorite_games = Relationship(back_populates="fans", link_model=UserGameLink)
    Game.fans = Relationship(back_populates="favorite_games", link_model=UserGameLink)
    User.favorite_genres = Relationship(back_populates="fans", link_model=UserGenreLink)
    Genre.fans = Relationship(back_populates="favorite_genres", link_model=UserGenreLink)
