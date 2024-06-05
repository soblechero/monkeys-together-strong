from datetime import datetime
from typing import Annotated, Self, TYPE_CHECKING

from fastapi import Query
from pydantic import HttpUrl, ConfigDict, AliasGenerator
from pydantic.alias_generators import to_camel, to_snake
from sqlmodel import SQLModel, Field, Relationship

from app.models.links import UserGameLink

if TYPE_CHECKING:
    from app.models.user import User


class GameBase(SQLModel):
    name: str = Field(unique=True, index=True)


class Game(GameBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    fans: list["User"] | None = Relationship(back_populates="favorite_games", link_model=UserGameLink)


class GameSearchCriteria(SQLModel):
    genres: list[str] | None = None
    names: Annotated[list[str] | None, Query(alias="names")] = None
    platforms: Annotated[list[str] | None, Query(alias="platforms")] = None
    release_years: Annotated[list[int] | None, Query(alias="releaseYears")] = None
    limit: Annotated[int, Query(alias="limit")] = 50
    offset: Annotated[int, Query(alias="offset")] = 0

    model_config = ConfigDict(
        populate_by_name=True,
    )

    @classmethod
    def parse_query_data(cls, raw_data: dict) -> Self:
        def process_comma_separated_input(input_string):
            return [item.strip() for item in input_string.split(",")] if input_string and input_string.strip() else None

        def process_comma_separated_integers(input_string):
            return [int(item.strip()) for item in
                    input_string.split(",")] if input_string and input_string.strip() else None

        data = {
            "genres": process_comma_separated_input(raw_data.get("genres")),
            "names": process_comma_separated_input(raw_data.get("names")),
            "platforms": process_comma_separated_input(raw_data.get("platforms")),
            "release_years": process_comma_separated_integers(raw_data.get("releaseYears")),
            "limit": raw_data.get("limit", 50),
            "offset": raw_data.get("offset", 0)
        }
        return cls(**data)


# Properties to receive and return via API
class GameDetails(GameBase):
    name: str = Field(alias="name")
    genres: list[str] = Field(alias="genres")
    thumb: HttpUrl = Field(alias="thumb")
    artwork: HttpUrl = Field(alias="artwork")
    how_long_to_beat: Annotated[float, Field(default=0, alias="howLongToBeat")]
    rating: float = Field(alias="rating")
    release_date: datetime = Field(alias="releaseDate")
    summary: str = Field(alias="summary")
    platforms: list[str] = Field(alias="platforms")

    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=AliasGenerator(
            validation_alias=to_snake,
            serialization_alias=to_camel,
        )
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

    @classmethod
    def update_hltb(cls, games_data: dict) -> Self:
        games = games_data.get('games', [])
        return cls.model_validate({"games": [GameDetails.parse_igdb_game_data(game) for game in games]})



# Properties to receive and return via API
class GamePublic(GameBase):
    pass


class GamesPublic(SQLModel):
    games: list[GamePublic]
