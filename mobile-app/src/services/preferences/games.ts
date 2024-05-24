import {Preferences} from '@capacitor/preferences';

const FAVORITE_GAMES_KEY = 'favoriteGames';

const getPreferenceGames = async (): Promise<string[]> => {
    const {value} = await Preferences.get({key: FAVORITE_GAMES_KEY});
    return value ? JSON.parse(value) : [];
};

const setPreferenceGames = async (gameNames: string[]): Promise<void> => {
    await Preferences.set({key: FAVORITE_GAMES_KEY, value: JSON.stringify(gameNames)});
};

const isGameInPreferences = async (gameName: string): Promise<boolean> => {
    const games = await getPreferenceGames();
    return games.includes(gameName);
};

const addGameToPreferences = async (gameName: string): Promise<void> => {
    const games = await getPreferenceGames();
    if (!await isGameInPreferences(gameName)) {
        games.push(gameName);
        await setPreferenceGames(games);
    }
};

const addGamesToPreferences = async (gameNames: string[]): Promise<void> => {
    const currentGames = await getPreferenceGames();
    const newGames = gameNames.filter(gameName => !currentGames.includes(gameName));
    if (newGames.length > 0) {
        await setPreferenceGames([...currentGames, ...newGames]);
    }
};

const removeGameFromPreferences = async (gameName: string): Promise<void> => {
    let games = await getPreferenceGames();
    games = games.filter(name => name !== gameName);
    await setPreferenceGames(games);
};


export {
    getPreferenceGames,
    setPreferenceGames,
    isGameInPreferences,
    addGameToPreferences,
    addGamesToPreferences,
    removeGameFromPreferences
};
