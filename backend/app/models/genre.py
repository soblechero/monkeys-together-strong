from typing import Self

from sqlmodel import SQLModel, Field


class GenreBase(SQLModel):
    name: str = Field(unique=True, index=True)


class Genre(GenreBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    # fans: list["User"] | None = Relationship(back_populates="favorite_genres", link_model=UserGenreLink)


# Properties to receive and return via API
class GenresApi(SQLModel):
    genres: list[GenreBase]

    @classmethod
    def parse_genre_names(cls, genre_names: "GenresPublic") -> Self:
        genres = [GenreBase.model_validate({"name": name}) for name in genre_names.genres]
        return cls.model_validate({"genres": genres})


# Properties to receive and return via API
class GenrePublic(GenreBase):
    pass


class GenresPublic(SQLModel):
    genres: list[str]

    @classmethod
    def parse_genres_api(cls, genres_api: "GenresApi") -> Self:
        return cls.model_validate({"genres": [genre.name for genre in genres_api.genres]})
