import {Preferences} from '@capacitor/preferences';

const SELECTED_GAMES_KEY = 'selectedGames';

const addGame = async (gameName: string): Promise<void> => {
    const games = await getSelectedGames();
    games.push(gameName);
    await Preferences.set({key: SELECTED_GAMES_KEY, value: JSON.stringify(games)});
};

const removeGame = async (gameName: string): Promise<void> => {
    let games = await getSelectedGames();
    games = games.filter(name => name !== gameName); // Filtra el nombre del juego que quieres eliminar
    await Preferences.set({key: SELECTED_GAMES_KEY, value: JSON.stringify(games)});
};

const getSelectedGames = async (): Promise<string[]> => {
    const {value} = await Preferences.get({key: SELECTED_GAMES_KEY});
    return value ? JSON.parse(value) : [];
};

const setSelectedGames = async (gameNames: string[]): Promise<void> => {
    await Preferences.set({key: SELECTED_GAMES_KEY, value: JSON.stringify(gameNames)});
};

export {addGame, removeGame, getSelectedGames, setSelectedGames};
