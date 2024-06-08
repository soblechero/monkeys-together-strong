from sqlmodel import SQLModel, Field

"""
Se ha separado la lógica de las relaciones en un módulo aparte, para evitar problemas de importación circular.
Ya que para poder crear las tablas de base de datos con SQLModel es necesario que las tablas estén creadas
antes que las relaciones. (ver app/models/__init__.py)

"""


class UserGenreLink(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    genre_id: int | None = Field(default=None, foreign_key="genre.id", primary_key=True)


class UserGameLink(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    game_id: int | None = Field(default=None, foreign_key="game.id", primary_key=True)
