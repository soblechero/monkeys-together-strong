from typing import TYPE_CHECKING

from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from app.models.game import Game
    from app.models.genre import Genre


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: str | None = None


class UserCreate(UserBase):
    password: str


class UserPublic(UserBase):
    id: int


class UserGameLink(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    game_id: int | None = Field(default=None, foreign_key="game.id", primary_key=True)


class UserGenreLink(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    genre_id: int | None = Field(default=None, foreign_key="genre.id", primary_key=True)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    favorite_games: list["Game"] | None = Relationship(back_populates="fans", link_model=UserGameLink)
    favorite_genres: list["Genre"] | None = Relationship(back_populates="fans", link_model=UserGenreLink)
