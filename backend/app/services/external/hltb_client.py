import asyncio
import logging

from howlongtobeatpy import HowLongToBeat
from howlongtobeatpy.HTMLRequests import SearchModifiers

"""
HowLongToBeat es un servicio que permite a los usuarios buscar la duración media de un juego.
Proporciona tres métricas principales: historia principal, historia principal + extras y completista.

"""
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class HLTBClient:
    def __init__(self, timeout: float = 3) -> None:
        self.timeout = timeout

    async def fetch_hltb(self, game_name: str) -> float | None:
        """
        Obtiene la duración de la historia principal de un juego determinado de HowLongToBeat.
        """
        try:
            results_list = await asyncio.wait_for(
                HowLongToBeat().async_search(game_name=game_name, search_modifiers=SearchModifiers.HIDE_DLC),
                timeout=self.timeout
            )
            if results_list is not None and len(results_list) > 0:
                best_element = max(results_list, key=lambda element: element.similarity)
                # logger.info(f"HLTB data fetched for game: {game_name}, time: {best_element.main_story}")
                return best_element.main_story
        except asyncio.TimeoutError:
            logger.warning(f"Timeout error fetching HLTB data for game: {game_name}")
        return None


hltb_client = HLTBClient()

# if __name__ == '__main__':
#     # game_name = 'The Legend of Zelda: Breath of the Wild'
#     game_name = 'Metroid Prime'
#     info = asyncio.run(hltb_client.fetch_hltb(game_name))
#     print(info)
