import { AxiosError } from 'axios';

const handleApiError = (error: unknown, contextMessage: string): Error => {
    let message = `${contextMessage} An error occurred. Please try again.`;

    if (isAxiosError(error)) {
        if (error.response) {
            const data = error.response.data as { message?: string };
            message = `${contextMessage} ${data.message || 'An error occurred. Please try again.'}`;
        } else if (error.request) {
            message = `${contextMessage} No response from server. Please try again later.`;
        }
    }

    console.error('API Error:', message);
    return new Error(message);
};

const isAxiosError = (error: any): error is AxiosError => {
    return error.isAxiosError === true;
};

export default handleApiError;
