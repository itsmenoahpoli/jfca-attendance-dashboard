import { useAuthStore } from "@/stores/auth.store";

export const useAuth = () => {
  const authData = useAuthStore();

  return {
    authToken: authData.token,
    sessionId: authData.session,
    userInfo: authData.user,
    userName: authData.user?.name,
  };
};
