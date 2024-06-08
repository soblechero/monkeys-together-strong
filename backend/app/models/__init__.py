from .links import UserGameLink, UserGenreLink
from .user import User
from .game import Game
from .genre import Genre

"""
Nos aseguramos de que los modelos de las tablas estén importados antes de la inicialización de la BD,
para poder crear las tablas de la BD con SQLModel.

"""

# De momento no hace falta
# def setup_relationships():
#     User.update_forward_refs()
#     Game.update_forward_refs()
#     Genre.update_forward_refs()
#     User.favorite_games = Relationship(back_populates="fans", link_model=UserGameLink)
#     Game.fans = Relationship(back_populates="favorite_games", link_model=UserGameLink)
#     User.favorite_genres = Relationship(back_populates="fans", link_model=UserGenreLink)
#     Genre.fans = Relationship(back_populates="favorite_genres", link_model=UserGenreLink)
#
#
# setup_relationships()
