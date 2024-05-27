import axios from 'axios';

const handleApiError = (error: unknown, contextMessage: string): Error => {
    let message = `${contextMessage} An error occurred. Please try again.`;

    if (axios.isAxiosError(error)) {
        if (error.response) {
            const data = error.response?.data as { message?: string };
            message = `${contextMessage} ${data?.message || 'An error occurred. Please try again.'}`;
            //const data = error.response?.data as { message?: string } | undefined;
            //const errorMessage = data?.message || error.message || 'An error occurred. Please try again.';
            //message = `${contextMessage} ${errorMessage}`;
        } else if (error.request) {
            message = `${contextMessage} No response from server. Please try again later.`;
        }
    }

    console.error('API Error:', message);
    return new Error(message);
};

// const isAxiosError = (error: unknown): error is AxiosError => {
//     return (error as AxiosError)?.isAxiosError === true;
// };

export {handleApiError};
