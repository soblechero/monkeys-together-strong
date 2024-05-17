const config = {
    backendUrl: import.meta.env.VITE_API_BASE_URL,
    isDevelopment: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    useMocks: import.meta.env.VITE_USE_MOCKS,
};

export default config;