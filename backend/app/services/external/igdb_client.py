import time

import requests
from google.protobuf.json_format import MessageToDict
from igdb.igdbapi_pb2 import GameResult, GenreResult  # type: ignore
from igdb.wrapper import IGDBWrapper

from app.core.config import settings
from app.models.game import GameSearchCriteria
from app.utils.date import year_to_timestamp

"""


"""

class IGDBClient:
    def __init__(self, client_id: str, client_secret: str, access_token: str | None = None) -> None:
        self.client_id: str = client_id
        self.client_secret: str = client_secret
        self.access_token: str | None = access_token
        self.token_expiry: float = 0
        self.wrapper: IGDBWrapper | None = None
        self._initialize_wrapper()

    def _initialize_wrapper(self) -> None:
        """Initialize the IGDB wrapper with a valid access token."""
        self.get_access_token()
        self.wrapper = IGDBWrapper(self.client_id, self.access_token)

    def get_access_token(self) -> str:
        """Get the Twitch access token, refresh if expired."""
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
        """Ensure the IGDB wrapper is initialized with a valid token."""
        if self.wrapper is None or time.time() > self.token_expiry:
            self._initialize_wrapper()

    def fetch_genres(self, offset=0, limit=25) -> dict:
        """Fetch game genres using the IGDB API."""
        self.ensure_valid_wrapper()

        query = f'fields name; offset {offset}; limit {limit}; sort name asc;'
        byte_array = self.wrapper.api_request('genres.pb', query)
        genres_result = GenreResult()
        genres_result.ParseFromString(byte_array)
        return MessageToDict(genres_result)

    def _build_game_query(self, criteria: GameSearchCriteria) -> str:
        fields = "fields name, genres.name, cover.url, total_rating, first_release_date, summary, platforms.name;"

        conditions = []

        if criteria.names:
            game_names = ' | '.join([f'name ~ *"{name}"*' for name in criteria.names])
            conditions.append(f"({game_names})")

        if criteria.genres:
            # genre_names = ','.join([f'"{name}"' for name in criteria.genres])
            # conditions.append(f"genres.name = ({genre_names})")
            genre_names = ' | '.join([f'genres.name ~ *"{name}"*' for name in criteria.genres])
            conditions.append(f"({genre_names})")

        if criteria.platforms:
            platform_names = ','.join([f'"{name}"' for name in criteria.platforms])
            conditions.append(f"platforms.name = ({platform_names})")

        if criteria.release_years:
            year_filters = []
            for year in criteria.release_years:
                start_ts, end_ts = year_to_timestamp(year)
                year_filters.append(f"first_release_date >= {start_ts} & first_release_date <= {end_ts}")
            conditions.append(f"({' | '.join(year_filters)})")

        conditions.append("total_rating_count > 20")
        conditions.append("category = 0")  # main games
        conditions.append("(status = 0 | status = null)")  # released games
        conditions.append("version_parent = null;")

        where_clause = "where " + (" & ".join(conditions) if conditions else "")
        sort_clause = "sort total_rating desc;"
        pagination_clause = f"limit {criteria.limit}; offset {criteria.offset};"

        query = f"{fields} {where_clause} {sort_clause} {pagination_clause}"
        return query

    def fetch_games(self, criteria: GameSearchCriteria) -> dict:
        self.ensure_valid_wrapper()
        query = self._build_game_query(criteria)

        byte_array = self.wrapper.api_request('games.pb', query)
        games_result = GameResult()
        games_result.ParseFromString(byte_array)
        return MessageToDict(games_result)


# Instancia global de IGDBClient, nivel de módulo, se creará una instancia una vez,
# cuando se importe el módulo por primera vez, y se reutilizará durante el ciclo de vida de la aplicación.
# TODO: guardar y recuperar el token de acceso en la base de datos
igdb_client = IGDBClient(settings.IGDB_CLIENT_ID, settings.IGDB_CLIENT_SECRET, settings.IGDB_ACCESS_TOKEN)

# if __name__ == "__main__":
#     # print(igdb_client.access_token)
#     criteria = GameSearchCriteria(
#         # genres=["Shooter"],
#         names=["Grand Theft", "Cyberpunk 2077"],
#         # platforms=["PlayStation 4", "Xbox One"],
#         # release_years=[2024],
#         limit=10,
#         offset=0
#     )
#     game_query = igdb_client.build_game_query(criteria)
#     print(game_query)
#     games = igdb_client.fetch_games(criteria)
#     print(len(games['games']))
#     print(GamesDetails.parse_igdb_games_data(games))
