from howlongtobeatpy import HowLongToBeat
from howlongtobeatpy.HTMLRequests import SearchModifiers


async def fetch_hltb(game_name: str) -> float | None:
    """
    Fetches the main story length for a given game from HowLongToBeat.
    """
    results_list = await HowLongToBeat().async_search(game_name, search_modifiers=SearchModifiers.HIDE_DLC)
    if results_list is not None and len(results_list) > 0:
        best_element = max(results_list, key=lambda element: element.similarity)
        return best_element.main_story
    return None


# if __name__ == '__main__':
#     import asyncio
#
#     game_name = 'The Legend of Zelda: Breath of the Wild'
#     info = asyncio.run(fetch_hltb(game_name))
#     print(info)
