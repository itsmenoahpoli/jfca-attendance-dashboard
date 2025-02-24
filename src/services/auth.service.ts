import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useApi } from "@/hooks";
import { authStoreAtom } from "@/stores";
import { API_ROUTES, WEB_ROUTES } from "@/constants";
import { HttpStatusCode } from "@@types/http.d";
import { type SigninCredentials } from "@@types/auth.d";
import { type SigninApiResponse } from "@@types/response.d";

export const useAuthService = () => {
  const navigate = useNavigate();
  const { $baseApi } = useApi();
  const [, setAuthData] = useAtom(authStoreAtom);
  const resetAuthStore = useResetAtom(authStoreAtom);

  const signinCredentials = async (
    credentials: SigninCredentials,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return navigate(WEB_ROUTES.DASHBOARD_OVERVIEW);
    return await $baseApi
      .post<SigninApiResponse>(API_ROUTES.AUTH.SIGN_IN, credentials)
      .then((response) => {
        const { account_enabled, session, token, user } = response.data;

        if (!account_enabled) {
          return toast.error("Unable to sign-in, account is disabled");
        }

        setAuthData({
          session,
          token,
          user,
        });

        setTimeout(() => {
          setLoading(false);

          navigate(WEB_ROUTES.DASHBOARD_OVERVIEW);
        }, 1500);
      })
      .catch((error) => {
        setLoading(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === HttpStatusCode.UNAUTHORIZED) {
            return toast.error("Invalid sign-in credentials");
          }
        }
      });
  };

  const signoutUser = () => {
    resetAuthStore();
  };

  return {
    signinCredentials,
    signoutUser,
  };
};
