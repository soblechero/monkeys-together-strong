import {Preferences} from '@capacitor/preferences';

const FAVORITE_GAMES_KEY = 'favoriteGames';

const addGameToPreferences = async (gameName: string): Promise<void> => {
    const games = await getPreferenceGames();
    if (!await isGameInPreferences(gameName)) {
        games.push(gameName);
        await setPreferenceGames(games);
    }
};

const removeGameFromPreferences = async (gameName: string): Promise<void> => {
    let games = await getPreferenceGames();
    games = games.filter(name => name !== gameName);
    await setPreferenceGames(games);
};

const isGameInPreferences = async (name: string): Promise<boolean> => {
    const favoriteGames = await getPreferenceGames();
    return favoriteGames.includes(name);
};

const getPreferenceGames = async (): Promise<string[]> => {
    const {value} = await Preferences.get({key: FAVORITE_GAMES_KEY});
    return value ? JSON.parse(value) : [];
};

const setPreferenceGames = async (gameNames: string[]): Promise<void> => {
    await Preferences.set({key: FAVORITE_GAMES_KEY, value: JSON.stringify(gameNames)});
};


export {addGameToPreferences, removeGameFromPreferences, isGameInPreferences, getPreferenceGames, setPreferenceGames};
