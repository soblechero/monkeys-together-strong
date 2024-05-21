import { describe, it, expect } from 'vitest';
import { isValidEmail } from '@/utils';

describe('Validator Util', () => {
    it('should validate a correct email address', () => {
        const email = 'test@example.com';
        const result = isValidEmail(email);
        expect(result).toBe(true);
    });

    it('should invalidate an incorrect email address', () => {
        const email = 'test@example';
        const result = isValidEmail(email);
        expect(result).toBe(false);
    });
});
