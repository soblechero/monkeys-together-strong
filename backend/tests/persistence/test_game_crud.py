import pytest
from sqlmodel import Session

from app.models.game import Game, GameBase
from app.models.user import User, UserCreate
from app.persistence.game_crud import (
    create_game, add_favorite_game, remove_favorite_game,
    update_favorite_games, is_favorite_game, get_game_by_name
)


@pytest.fixture(scope="function")
def test_user(session: Session):
    user_data = UserCreate(email="test@example.com", password="securepassword")
    user = User.model_validate(user_data, update={"hashed_password": "fakehashedpassword"})
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def test_create_game(session: Session):
    game_data = GameBase(name="Zelda")
    game = create_game(session=session, game_data=game_data)
    assert game.id is not None
    assert game.name == "Zelda"
    # Verify the game is actually in the database
    db_game = session.get(Game, game.id)
    assert db_game is not None
    assert db_game.name == game.name


def test_add_favorite_game(session: Session, test_user):
    game_data = GameBase(name="Mario")
    game = add_favorite_game(session=session, user=test_user, game_data=game_data)
    assert game in test_user.favorite_games
    assert session.get(Game, game.id) in test_user.favorite_games


def test_remove_favorite_game(session: Session, test_user):
    game_data = GameBase(name="Mario")
    game = add_favorite_game(session=session, user=test_user, game_data=game_data)
    remove_favorite_game(session=session, user=test_user, game_data=game_data)
    assert game not in test_user.favorite_games


def test_update_favorite_games(session: Session, test_user):
    game_data1 = GameBase(name="Mario")
    game_data2 = GameBase(name="Pac-Man")
    games_data = [game_data1, game_data2]

    update_favorite_games(session=session, user=test_user, games_data=games_data)
    assert len(test_user.favorite_games) == 2
    assert any(game.name == "Mario" for game in test_user.favorite_games)
    assert any(game.name == "Pac-Man" for game in test_user.favorite_games)


def test_is_favorite_game(session: Session, test_user):
    game_data = GameBase(name="Mario")
    add_favorite_game(session=session, user=test_user, game_data=game_data)
    assert is_favorite_game(session=session, user=test_user, game_data=game_data)


def test_get_game_by_name(session: Session):
    game_data = GameBase(name="Zelda")
    create_game(session=session, game_data=game_data)
    game = get_game_by_name(session=session, game_name="Zelda")
    assert game is not None
    assert game.name == "Zelda"
