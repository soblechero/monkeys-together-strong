import logging
import time
from enum import Enum

import requests
from google.protobuf.json_format import MessageToDict
from igdb.igdbapi_pb2 import GameResult, GenreResult  # type: ignore
from igdb.wrapper import IGDBWrapper

from app.core.config import settings
from app.models.game import GameSearchCriteria, GamesDetails
from app.utils.date import year_to_timestamp

"""
Este módulo contiene la implementación de un cliente para la API IGDB (Internet Game Database).

"""

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class QueryBuilder:
    class SearchType(Enum):
        EXACT = 'exact'
        APPROXIMATE = 'approximate'

    @staticmethod
    def build_game_query(criteria: GameSearchCriteria, search_type: 'QueryBuilder.SearchType') -> str:
        """Construir una consulta de búsqueda de juegos utilizando los criterios de búsqueda proporcionados."""
        fields = "fields name, genres.name, cover.url, total_rating, first_release_date, summary, platforms.name;"
        conditions = QueryBuilder._build_conditions(criteria, search_type)

        where_clause = "where " + (" & ".join(conditions) if conditions else "")
        sort_clause = "sort total_rating desc;"
        pagination_clause = f"limit {criteria.limit}; offset {criteria.offset};"

        return f"{fields} {where_clause} {sort_clause} {pagination_clause}"

    @staticmethod
    def _build_conditions(criteria: GameSearchCriteria, search_type: 'QueryBuilder.SearchType') -> list:
        conditions = []
        match_modifier = QueryBuilder._match_modifier(search_type)

        if criteria.names:
            game_names = ' | '.join([match_modifier("name", name) for name in criteria.names])
            conditions.append(f"({game_names})")

        if criteria.genres:
            genre_names = ' | '.join([match_modifier("genres.name", name) for name in criteria.genres])
            conditions.append(f"({genre_names})")

        if criteria.platforms:
            platform_names = ','.join([f'platforms.name "{name}"' for name in criteria.platforms])
            conditions.append(f"platforms.name = ({platform_names})")

        if criteria.release_years:
            year_filters = [f"first_release_date >= {start} & first_release_date <= {end}"
                            for start, end in (year_to_timestamp(year) for year in criteria.release_years)]
            conditions.append(f"({' | '.join(year_filters)})")

        conditions.append("total_rating_count > 20")
        conditions.append("category = 0")  # main games
        conditions.append("(status = 0 | status = null)")  # released games
        conditions.append("version_parent = null;")  # exclude versions (editions)
        return conditions

    @staticmethod
    def _match_modifier(search_type: 'QueryBuilder.SearchType'):
        if search_type == QueryBuilder.SearchType.EXACT:
            return lambda field, value: f'{field} = "{value}"'
        return lambda field, value: f'{field} ~ *"{value}"*'


class IGDBClient:
    def __init__(self, client_id: str, client_secret: str, access_token: str | None = None) -> None:
        self.client_id: str = client_id
        self.client_secret: str = client_secret
        self.access_token: str | None = access_token
        self.token_expiry: float = 0
        self.wrapper: IGDBWrapper | None = None
        self._initialize_wrapper()

    def _initialize_wrapper(self) -> None:
        """Inicializar el wrapper de IGDB con un token de acceso válido"""
        self.get_access_token()
        self.wrapper = IGDBWrapper(self.client_id, self.access_token)

    def get_access_token(self) -> str:
        """Obtener el token de acceso de Twitch, actualízalo si está vencido."""
        if self.access_token is None or time.time() > self.token_expiry:
            url = settings.IGDB_ACCESS_TOKEN_URL
            params = {
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "grant_type": "client_credentials"
            }
            response = requests.post(url, params=params)
            response.raise_for_status()
            data = response.json()
            self.access_token = data['access_token']
            self.token_expiry = time.time() + data['expires_in']
        return self.access_token

    def ensure_valid_wrapper(self) -> None:
        """Asegurarse que el wrapper de IGDB se inicialice con un token válido."""
        if self.wrapper is None or time.time() > self.token_expiry:
            self._initialize_wrapper()

    def fetch_genres(self, offset=0, limit=25) -> dict:
        """Obtener géneros de juegos utilizando la API IGDB."""
        self.ensure_valid_wrapper()

        query = f'fields name; offset {offset}; limit {limit}; sort name asc;'
        return self._api_request('genres.pb', query, GenreResult)

    def fetch_games(self, criteria: GameSearchCriteria) -> dict:
        """Buscar juegos que coincidan con los criterios de búsqueda utilizando la API IGDB. Usa búsqueda exacta."""
        self.ensure_valid_wrapper()
        query = QueryBuilder.build_game_query(criteria, QueryBuilder.SearchType.EXACT)
        return self._api_request('games.pb', query, GameResult)

    def search_games(self, criteria: GameSearchCriteria) -> dict:
        """Buscar juegos que coincidan con los criterios de búsqueda utilizando la API IGDB. Usa búsqueda aproximada."""
        self.ensure_valid_wrapper()
        query = QueryBuilder.build_game_query(criteria, QueryBuilder.SearchType.APPROXIMATE)
        return self._api_request('games.pb', query, GameResult)

    def _api_request(self, endpoint: str, query: str, result_type):
        """Realizar una solicitud a la API IGDB y devolver los datos en formato de diccionario."""
        self.ensure_valid_wrapper()
        logger.info(f"IGDB Query: {query}")
        byte_array = self.wrapper.api_request(endpoint, query)
        result_instance = result_type()
        result_instance.ParseFromString(byte_array)
        return MessageToDict(result_instance)


# Instancia global de IGDBClient, nivel de módulo, se creará una instancia una vez,
# cuando se importe el módulo por primera vez, y se reutilizará durante el ciclo de vida de la aplicación.
# TODO: guardar y recuperar el token de acceso en la base de datos, en lugar de en memoria.
igdb_client = IGDBClient(settings.IGDB_CLIENT_ID, settings.IGDB_CLIENT_SECRET, settings.IGDB_ACCESS_TOKEN)

# if __name__ == "__main__":
#     # print(igdb_client.access_token)
#     criteria = GameSearchCriteria(
#         # genres=["Shooter"],
#         names=["hell"],  # , "Cyberpunk 2077"],
#         # platforms=["PlayStation 4", "Xbox One"],
#         # release_years=[2024],
#         limit=10,
#         offset=0
#     )
#     games = igdb_client.fetch_games(criteria)
#     print(len(games['games']))
#     print(GamesDetails.parse_igdb_games_data(games))
