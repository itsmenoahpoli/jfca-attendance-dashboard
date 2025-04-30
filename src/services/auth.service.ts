import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useApi } from "@/hooks";
import { useAuthStore } from "@/stores/auth.store";
import { API_ROUTES, WEB_ROUTES } from "@/constants";
import { HttpStatusCode } from "@@types/http.d";
import { type SigninCredentials } from "@@types/auth.d";
import { type SigninApiResponse } from "@@types/response.d";

export const useAuthService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { $baseApi } = useApi();
  const { setAuth, resetAuth } = useAuthStore();

  const signinCredentials = async (
    credentials: SigninCredentials,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    return await $baseApi
      .post<SigninApiResponse>(API_ROUTES.AUTH.SIGN_IN, credentials)
      .then((response) => {
        const { session, token, user } = response.data;

        setAuth({
          session,
          token,
          user,
        });

        setTimeout(() => {
          setLoading(false);
          const returnUrl =
            (location.state as any)?.from?.pathname ||
            WEB_ROUTES.DASHBOARD_OVERVIEW;
          navigate(returnUrl);
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
    resetAuth();
    navigate(WEB_ROUTES.SIGN_IN);
  };

  return {
    signinCredentials,
    signoutUser,
  };
};
