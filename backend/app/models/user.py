from typing import TYPE_CHECKING

from sqlmodel import Field, SQLModel, Relationship

from app.models.links import UserGameLink, UserGenreLink

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


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    favorite_games: list["Game"] | None = Relationship(back_populates="fans", link_model=UserGameLink)
    favorite_genres: list["Genre"] | None = Relationship(back_populates="fans", link_model=UserGenreLink)
