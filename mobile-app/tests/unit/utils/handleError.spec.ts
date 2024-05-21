import { describe, it, expect } from 'vitest';
import { handleError } from '@/utils';

describe('Handle Error Util', () => {
    it('should return the error message if error is an instance of Error', () => {
        const error = new Error('Test error');
        const result = handleError(error, 'Context message');
        expect(result).toBe('Test error');
    });

    it('should return a default error message if error is not an instance of Error', () => {
        const error = 'Some error';
        const result = handleError(error, 'Context message');
        expect(result).toBe('Context message An error occurred. Please try again.');
    });
});
