import {Preferences} from '@capacitor/preferences';

const USER_EMAIL_KEY = 'userEmail';

const getUserEmailFromPreferences = async (): Promise<string | null> => {
    const {value} = await Preferences.get({key: USER_EMAIL_KEY});
    return value;
};

const setUserEmailToPreferences = async (token: string): Promise<void> => {
    await Preferences.set({key: USER_EMAIL_KEY, value: token});
};

export {getUserEmailFromPreferences, setUserEmailToPreferences};

