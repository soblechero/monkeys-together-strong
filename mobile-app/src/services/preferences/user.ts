import {Preferences} from '@capacitor/preferences';

const USER_EMAIL_TOKEN_KEY = 'emailToken';

const getUserEmailFromPreferences = async (): Promise<string | null> => {
    const {value} = await Preferences.get({key: USER_EMAIL_TOKEN_KEY});
    return value;
};

const setUserEmailToPreferences = async (token: string): Promise<void> => {
    await Preferences.set({key: USER_EMAIL_TOKEN_KEY, value: token});
};

export {getUserEmailFromPreferences, setUserEmailToPreferences};

