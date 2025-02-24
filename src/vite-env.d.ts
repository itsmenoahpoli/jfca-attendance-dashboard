/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string;
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_SECRET_PASSKEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
