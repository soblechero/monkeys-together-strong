import {AxiosError} from 'axios';

const handleApiError = (error: unknown, contextMessage: string): Error => {
    let message = `${contextMessage} An error occurred. Please try again.`;

    if (error instanceof AxiosError) {
        if (error.response) {
            message = `${contextMessage} ${error.response.data?.message || 'An error occurred. Please try again.'}`;
        } else if (error.request) {
            message = `${contextMessage} No response from server. Please try again later.`;
        }
    }

    console.error('API Error:', message);
    return new Error(message);
};

export default handleApiError;
