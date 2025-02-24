import { type AuthStoreData } from "./auth";

export type SigninApiResponse = { account_enabled: boolean } & AuthStoreData;
