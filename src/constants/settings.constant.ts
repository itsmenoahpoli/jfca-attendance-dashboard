const appEnv = import.meta.env.VITE_APP_ENV;

export const APP_API_URL = import.meta.env.VITE_APP_API_BASEURL;

export const APP_SECRET_PASSPHRASE = import.meta.env.VITE_APP_SECRET_PASSPHRASE;

export const APP_ENV = {
  IS_DEV: appEnv === "DEV",
  IS_STAGING: appEnv === "STAGING",
  IS_PROD: appEnv === "PROD",
};
