from .user import User
from .game import Game
from .genre import Genre
from .links import UserGameLink, UserGenreLink, setup_relationships

"""
Nos aseguramos de que los modelos estén importados antes de establecer las relaciones, 
para poder crear las tablas de base de datos con SQLModel.

"""

setup_relationships()
