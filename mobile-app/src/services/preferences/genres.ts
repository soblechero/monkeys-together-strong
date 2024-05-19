import {Preferences} from '@capacitor/preferences';

const SELECTED_GENRES_KEY = 'selectedGenres';

const getSelectedGenres = async (): Promise<string[]> => {
    const {value} = await Preferences.get({key: SELECTED_GENRES_KEY});
    return value ? JSON.parse(value) : [];
};

const setSelectedGenres = async (genres: string[]): Promise<void> => {
    await Preferences.set({key: SELECTED_GENRES_KEY, value: JSON.stringify(genres)});
};

const clearSelectedGenres = async (): Promise<void> => {
    await Preferences.remove({key: SELECTED_GENRES_KEY});
};

const addGenre = async (genre: string): Promise<void> => {
    const genres = await getSelectedGenres();
    if (genres && !genres.includes(genre)) {
        genres.push(genre);
        await setSelectedGenres(genres);
    }
};

const removeGenre = async (genre: string): Promise<void> => {
    const genres = await getSelectedGenres();
    if (genres) {
        const updatedGenres = genres.filter(g => g !== genre);
        await setSelectedGenres(updatedGenres);
    }
};

export {getSelectedGenres, setSelectedGenres, clearSelectedGenres, addGenre, removeGenre};
