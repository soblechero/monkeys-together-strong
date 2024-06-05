from datetime import datetime
from typing import Annotated, Self

from fastapi import Query
from pydantic import HttpUrl, ConfigDict
from sqlmodel import SQLModel, Field


class GameBase(SQLModel):
    name: str = Field(unique=True, index=True)


class Game(GameBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    # fans: list["User"] | None = Relationship(back_populates="favorite_games", link_model=UserGameLink)


class GameSearchCriteria(SQLModel):
    genres: Annotated[list[str], Query(alias="genres")]
    names: Annotated[list[str], Query(alias="names")]
    platforms: Annotated[list[str], Query(alias="platforms")]
    release_years: Annotated[list[int], Query(alias="releaseYears")]
    limit: Annotated[int, Query(alias="limit")] = 50
    offset: Annotated[int, Query(alias="offset")] = 0

    model_config = ConfigDict(
        # populate_by_name=True,
    )


# class GameSearchCriteria2(SQLModel):
#     genres: Annotated[list[str] | None, Field(query_alias="genres")] = None
#     names: Annotated[list[str] | None, Field(query_alias="names")] = None
#     platforms: Annotated[list[str] | None, Field(query_alias="platforms")] = None
#     release_years: Annotated[list[int] | None, Field(query_alias="releaseYears")] = None
#     limit: Annotated[int, Field(query_alias="limit")] = 50
#     offset: Annotated[int, Field(query_alias="offset")] = 0


# Properties to receive and return via API
class GameDetails(GameBase):
    name: str = Field(alias="name")
    genres: list[str] = Field(alias="genres")
    thumb: HttpUrl = Field(alias="thumb")
    artwork: HttpUrl = Field(alias="artwork")
    how_long_to_beat: float = Field(default=0, alias="howLongToBeat")
    rating: float = Field(alias="rating")
    release_date: datetime = Field(alias="releaseDate")
    summary: str = Field(alias="summary")
    platforms: list[str] = Field(alias="platforms")

    model_config = ConfigDict(
        populate_by_name=True,
    )

    @classmethod
    def parse_igdb_game_data(cls, raw_data: dict) -> Self:
        data = {
            "name": raw_data["name"],
            "genres": [genre["name"] for genre in raw_data.get("genres", [])],
            "thumb": f"https:{raw_data['cover']['url'].replace('.jpg', '.png')}",
            "artwork": f"https:{raw_data['cover']['url'].replace('t_thumb', 't_screenshot_med').replace('.jpg', '.png')}",
            "rating": round(raw_data.get("totalRating", 0), 2),
            "release_date": datetime.fromisoformat(raw_data["firstReleaseDate"].replace("Z", "+00:00")),
            "summary": raw_data["summary"],
            "platforms": [platform["name"] for platform in raw_data.get("platforms", [])]
        }
        return cls.model_validate(data)


class GamesDetails(SQLModel):
    games: list[GameDetails]

    @classmethod
    def parse_igdb_games_data(cls, games_data: dict) -> Self:
        games = games_data.get('games', [])
        return cls.model_validate({"games": [GameDetails.parse_igdb_game_data(game) for game in games]})


# Properties to receive and return via API
class GamePublic(GameBase):
    pass


class GamesPublic(SQLModel):
    games: list[GamePublic]
