import { type AuthStoreData } from "./auth";

export type SigninApiResponse = { is_enabled: boolean } & AuthStoreData;
