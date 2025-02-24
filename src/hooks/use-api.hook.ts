import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { useAuth } from "./use-auth.hook";
import { SETTINGS } from "@/constants";

export const useApi = () => {
  const { authToken } = useAuth();

  const getBearerTokenValue = () => {
    return `Bearer ${authToken}`;
  };

  const initializeBaseApi = () => {
    const baseApiInstance: AxiosInstance = axios.create({
      baseURL: SETTINGS.APP_API_URL,
    });

    baseApiInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        /**
         * Set Headers
         */
        config.headers["Accept"] = "application/json";
        config.headers["Content-Type"] = "application/json";

        if (authToken) {
          config.headers["Authorization"] = getBearerTokenValue();
        }

        return config;
      },
      (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
      }
    );

    baseApiInstance.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        return response;
      },
      (error: AxiosError): Promise<AxiosError> => {
        if (error.response) {
          const { status } = error.response;

          if (status === 500) {
            console.error({
              message: "Error",
              description: "Server error occured!",
            });
          }
        }

        return Promise.reject(error);
      }
    );

    return baseApiInstance;
  };

  return {
    $baseApi: initializeBaseApi(),
  };
};
