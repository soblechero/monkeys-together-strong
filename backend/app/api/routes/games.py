from typing import Annotated, Optional

from fastapi import HTTPException, Depends, APIRouter, status, Query

from app.api.deps import CurrentUser, SessionDep
from app.models.message import Message
from app.models.game import GameDetails, GameSearchCriteria, GamesDetails, GameBase, GamePublic
from app.persistence import game_crud
from app.services.external.hltb_client import hltb_client
from app.services.external.igdb_client import igdb_client

"""
Este módulo contiene las rutas de la API relacionadas con los juegos.

"""

router = APIRouter()


@router.get("/games", response_model=list[GameDetails], response_model_by_alias=True)
async def read_games(
        current_user: CurrentUser,
        genres: Annotated[list[str], Query(alias="genres[]")] = None,
        names: Annotated[list[str], Query(alias="names[]")] = None,
        platforms: Annotated[list[str], Query(alias="platforms[]")] = None,
        release_years: Annotated[list[int], Query(alias="releaseYears[]")] = None,
        limit: Annotated[int, Query(alias="limit")] = 25,
        offset: Annotated[int, Query(alias="offset")] = 0
) -> list[GameDetails]:
    print(names)
    criteria = GameSearchCriteria.model_validate(
        {
            "genres": genres,
            "names": names,
            "platforms": platforms,
            "release_years": release_years,
            "limit": limit,
            "offset": offset
        }
    )
    games_igdb = igdb_client.fetch_games(criteria)
    games_details = GamesDetails.parse_igdb_games_data(games_igdb)
    if len(games_details.games) == 1:
        # la petición a hltb tarda demasiado,
        # solo recuperaremos dicha información cuando se pidan los detalles de un juego
        await games_details.update_hltb(hltb_client.fetch_hltb)
    return games_details.games


@router.get("/games/search", response_model=list[GameDetails], response_model_by_alias=True)
async def search_games(
        current_user: CurrentUser,
        genres: Annotated[list[str], Query(alias="genres[]")] = None,
        names: Annotated[list[str], Query(alias="names[]")] = None,
        platforms: Annotated[list[str], Query(alias="platforms[]")] = None,
        release_years: Annotated[list[int], Query(alias="releaseYears[]")] = None,
        limit: Annotated[int, Query(alias="limit")] = 25,
        offset: Annotated[int, Query(alias="offset")] = 0
) -> list[GameDetails]:
    print(names)
    criteria = GameSearchCriteria.model_validate(
        {
            "genres": genres,
            "names": names,
            "platforms": platforms,
            "release_years": release_years,
            "limit": limit,
            "offset": offset
        }
    )
    games_igdb = igdb_client.search_games(criteria)
    games_details = GamesDetails.parse_igdb_games_data(games_igdb)
    if len(games_details.games) == 1:
        # la petición a hltb tarda demasiado,
        # solo recuperaremos dicha información cuando se pidan los detalles de un juego
        await games_details.update_hltb(hltb_client.fetch_hltb)
    return games_details.games


@router.post("/user/games", response_model=GamePublic)
def add_user_game(session: SessionDep, current_user: CurrentUser, game_in: GamePublic) -> GamePublic:
    if game_crud.is_favorite_game(session=session, user=current_user, game_data=game_in):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"{game_in.name} already exists in user's favorite games")
    game = game_crud.add_favorite_game(session=session, user=current_user, game_data=game_in)
    return GamePublic.model_validate(game)


@router.delete("/user/games/{game_name}", response_model=Message)
def delete_user_game(session: SessionDep, current_user: CurrentUser, game_name: str) -> Message:
    game_base = GameBase.model_validate({"name": game_name})
    if not game_crud.is_favorite_game(session=session, user=current_user, game_data=game_base):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"{game_name} not found in user's favorite games")
    game_crud.remove_favorite_game(session=session, user=current_user, game_data=game_base)
    return Message.model_validate({"message": f"{game_name} removed from user's favorite games"})


@router.get("/user/games", response_model=list[GamePublic])
def read_user_games(current_user: CurrentUser) -> list[GamePublic]:
    games = game_crud.get_favorite_games(user=current_user)
    return games
