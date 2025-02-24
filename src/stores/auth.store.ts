import { atomWithStorage } from "jotai/utils";
import { storeStorage } from "./util";
import { type AuthStoreData } from "@@types/auth";

export const authStoreAtom = atomWithStorage<AuthStoreData>(
  "authData",
  {
    session: "",
    token: "",
    user: undefined,
  },
  storeStorage<AuthStoreData>()
);
