import { useAtom } from "jotai";
import { authStoreAtom } from "@/stores";

export const useAuth = () => {
  const [authData] = useAtom(authStoreAtom);

  return {
    authToken: authData.token,
    sessionId: authData.session,
    userInfo: authData.user,
    userName: authData.user?.name,
  };
};
