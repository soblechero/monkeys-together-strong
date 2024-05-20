import {Preferences} from '@capacitor/preferences';

const FAVORITE_GENRES_KEY = 'favoriteGenres';

const getPreferenceGenres = async (): Promise<string[]> => {
    const {value} = await Preferences.get({key: FAVORITE_GENRES_KEY});
    return value ? JSON.parse(value) : [];
};

const setPreferenceGenres = async (genres: string[]): Promise<void> => {
    await Preferences.set({key: FAVORITE_GENRES_KEY, value: JSON.stringify(genres)});
};

const clearPreferenceGenres = async (): Promise<void> => {
    await Preferences.remove({key: FAVORITE_GENRES_KEY});
};

const addGenreToPreferences = async (genre: string): Promise<void> => {
    const genres = await getPreferenceGenres();
    if (!await isGenreInPreferences(genre)) {
        genres.push(genre);
        await setPreferenceGenres(genres);
    }
};

const removeGenreFromPreferences = async (genre: string): Promise<void> => {
    const genres = await getPreferenceGenres();
    if (genres) {
        const updatedGenres = genres.filter(g => g !== genre);
        await setPreferenceGenres(updatedGenres);
    }
};

const isGenreInPreferences = async (genre: string): Promise<boolean> => {
    const favoriteGenres = await getPreferenceGenres();
    return favoriteGenres.includes(genre);
};


export {
    getPreferenceGenres,
    setPreferenceGenres,
    clearPreferenceGenres,
    addGenreToPreferences,
    removeGenreFromPreferences,
    isGenreInPreferences
};
