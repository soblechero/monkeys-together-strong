/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string,
    readonly VITE_USE_MOCKS: boolean,
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
