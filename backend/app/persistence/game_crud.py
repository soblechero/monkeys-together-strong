from sqlmodel import Session, select
from app.models.game import Game, GameBase
from app.models.user import User

"""
This module implements CRUD operations for the Game model.

"""


def create_game(*, session: Session, game_data: GameBase) -> Game:
    game = Game.model_validate(game_data)  # game = Game(**game_data.dict())
    session.add(game)
    session.commit()
    session.refresh(game)
    return game


def add_favorite_game(*, session: Session, user: User, game_data: GameBase) -> Game:
    statement = select(Game).where(Game.name == game_data.name)
    game = session.exec(statement).first()
    if not game:
        game = create_game(session=session, game_data=game_data)
    if game not in user.favorite_games:
        user.favorite_games.append(game)
        session.commit()
        session.refresh(user)
    return game


def remove_favorite_game(*, session: Session, user: User, game_data: GameBase) -> None:
    statement = select(Game).where(Game.name == game_data.name)
    game = session.exec(statement).first()
    if game and game in user.favorite_games:
        user.favorite_games.remove(game)
        session.commit()
        session.refresh(user)


def update_favorite_games(*, session: Session, user: User, games_data: list[GameBase]) -> None:
    user.favorite_games.clear()
    for game_data in games_data:
        add_favorite_game(session=session, user=user, game_data=game_data)
    session.commit()
    session.refresh(user)


def is_favorite_game(*, session: Session, user: User, game_data: GameBase) -> bool:
    statement = select(Game).where(Game.name == game_data.name)
    game = session.exec(statement).first()
    return game in user.favorite_games if game else False


def get_favorite_games(*, user: User) -> list[GameBase]:
    return [GameBase.model_validate(game) for game in user.favorite_games]


def get_game_by_name(*, session: Session, game_name: str) -> Game | None:
    statement = select(Game).where(Game.name == game_name)
    game = session.exec(statement).first()
    return game
