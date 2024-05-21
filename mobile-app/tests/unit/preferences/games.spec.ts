import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Preferences } from '@capacitor/preferences';
import { addGameToPreferences, removeGameFromPreferences, isGameInPreferences, getPreferenceGames, setPreferenceGames } from '@/services/preferences';

const FAVORITE_GAMES_KEY = 'favoriteGames';

// Mock de Preferences
vi.mock('@capacitor/preferences', () => ({
    Preferences: {
        get: vi.fn(),
        set: vi.fn(),
    },
}));

describe('Preferences Games', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should add a game to preferences', async () => {
        (Preferences.get as any).mockResolvedValue({ value: '["Game1"]' });
        (Preferences.set as any).mockResolvedValue();

        await addGameToPreferences('Game2');

        expect(Preferences.set).toHaveBeenCalledWith({ key: FAVORITE_GAMES_KEY, value: JSON.stringify(['Game1', 'Game2']) });
    });

    it('should not add a game if it is already in preferences', async () => {
        (Preferences.get as any).mockResolvedValue({ value: '["Game1", "Game2"]' });

        await addGameToPreferences('Game2');

        expect(Preferences.set).not.toHaveBeenCalled();
    });

    it('should remove a game from preferences', async () => {
        (Preferences.get as any).mockResolvedValue({ value: '["Game1", "Game2"]' });
        (Preferences.set as any).mockResolvedValue();

        await removeGameFromPreferences('Game1');

        expect(Preferences.set).toHaveBeenCalledWith({ key: FAVORITE_GAMES_KEY, value: JSON.stringify(['Game2']) });
    });

    it('should check if a game is in preferences', async () => {
        (Preferences.get as any).mockResolvedValue({ value: '["Game1", "Game2"]' });

        const result = await isGameInPreferences('Game1');

        expect(result).toBe(true);
    });

    it('should get all games from preferences', async () => {
        (Preferences.get as any).mockResolvedValue({ value: '["Game1", "Game2"]' });

        const games = await getPreferenceGames();

        expect(games).toEqual(['Game1', 'Game2']);
    });

    it('should set games to preferences', async () => {
        (Preferences.set as any).mockResolvedValue();

        await setPreferenceGames(['Game1', 'Game2']);

        expect(Preferences.set).toHaveBeenCalledWith({ key: FAVORITE_GAMES_KEY, value: JSON.stringify(['Game1', 'Game2']) });
    });
});
