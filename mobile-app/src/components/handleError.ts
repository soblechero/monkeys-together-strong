const handleError = (error: unknown, contextMessage: string): string => {
    if (error instanceof Error) {
        return error.message;
    }
    return `${contextMessage} Please try again.`;
};

export default handleError;
