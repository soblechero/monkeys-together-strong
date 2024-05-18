import { Preferences } from '@capacitor/preferences';

const AUTH_TOKEN_KEY = 'authToken';

const getAuthToken = async (): Promise<string | null> => {
    const { value } = await Preferences.get({ key: AUTH_TOKEN_KEY });
    return value;
};

const setAuthToken = async (token: string): Promise<void> => {
    await Preferences.set({ key: AUTH_TOKEN_KEY, value: token });
};

const removeAuthToken = async (): Promise<void> => {
    await Preferences.remove({ key: AUTH_TOKEN_KEY });
};

export { getAuthToken, setAuthToken, removeAuthToken };
