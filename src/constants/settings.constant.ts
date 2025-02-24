import { AppEnvironments, type AppEnvironment } from "@@types/settings.d";

const checkEnvironment = (env: AppEnvironment) => {
  return env === CURRENT_APP_ENV;
};

const CURRENT_APP_ENV: AppEnvironment = import.meta.env
  .VITE_APP_ENV as AppEnvironment;

const APP_API_URL: string = import.meta.env.VITE_APP_API_URL;

const IS_DEV: boolean = checkEnvironment(AppEnvironments.DEV);
const IS_QA: boolean = checkEnvironment(AppEnvironments.QA);
const IS_PROD: boolean = checkEnvironment(AppEnvironments.PROD);

const SECRET_PASSKEY: string = import.meta.env.VITE_APP_SECRET_PASSKEY;
const ENCRYPTION_CONFIG = { mode: "cbc", ks: 256 } as any;

const DEFAULT_SEO_META = {
  title: "Title | Home",
  description: "Description",
};

export const SETTINGS = {
  CURRENT_APP_ENV,
  APP_API_URL,
  IS_DEV,
  IS_QA,
  IS_PROD,
  SECRET_PASSKEY,
  ENCRYPTION_CONFIG,
  DEFAULT_SEO_META,
} as const;
