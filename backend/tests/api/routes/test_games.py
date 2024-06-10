# from fastapi.testclient import TestClient
# from sqlalchemy.orm import Session
# import pytest
# from sqlmodel import select
#
# from app.models.game import Game, GameBase, GamePublic
# from app.models.user import User
#
#
# def test_read_games(client: TestClient, user_token_headers):
#     response = client.get("/games", headers=user_token_headers)
#     assert response.status_code == 200
#     assert isinstance(response.json(), list)
#
#
# def test_add_user_game(client: TestClient, user_token_headers, session: Session):
#     game_data = {"name": "New Game"}
#     response = client.post("/user/games", json=game_data, headers=user_token_headers)
#     assert response.status_code == 200
#     response_data = response.json()
#     assert 'name' in response_data
#     game_name = response_data['name']
#     game = session.execute(select(Game).where(Game.name == game_name)).first()
#     assert game is not None
#     assert game.name == "New Game"
#
#
# def test_delete_user_game(client: TestClient, user_token_headers, session: Session):
#     game = Game(name="Game to Delete")
#     session.add(game)
#     session.commit()
#
#     user = session.execute(select(User).where(User.email == "userpytest@userpytest.py")).first()
#     user.favorite_games.append(game)
#     session.commit()
#
#     response = client.delete(f"/user/games/{game.name}", headers=user_token_headers)
#     assert response.status_code == 200
#     response_message = response.json()
#     assert response_message['message'] == f"{game.name} removed from user's favorite games"
#
#     user = session.execute(select(User).where(User.email == "userpytest@userpytest.py")).first()
#     assert game not in user.favorite_games
#
#
# def test_read_user_games(client: TestClient, user_token_headers, session: Session):
#     game_data = Game(name="Test Game")
#     session.add(game_data)
#     session.commit()
#
#     user = session.execute(select(User).where(User.email == "userpytest@userpytest.py")).first()
#     user.favorite_games.append(game_data)
#     session.commit()
#
#     response = client.get("/user/games", headers=user_token_headers)
#     assert response.status_code == 200
#     user_games = response.json()
#     assert len(user_games) == 1
#     assert user_games[0]["name"] == game_data.name
