const handleError = (error: unknown, contextMessage: string): string => {
    console.error('Error:', error);
    if (error instanceof Error) {
        return error.message;
    }
    return `${contextMessage} An error occurred. Please try again.`;
};

export {handleError};

