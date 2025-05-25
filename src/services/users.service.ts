import { useApi } from "@/hooks";
import { API_ROUTES } from "@/constants";

export type User = {
  id: string;
  name: string;
  email: string;
  user_type: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export const useUsersService = () => {
  const { $baseApi } = useApi();

  const getUsers = async () => {
    const response = await $baseApi.get<User[]>(API_ROUTES.USERS.LIST);
    return response.data;
  };

  const getUser = async (id: string) => {
    const response = await $baseApi.get<User>(`${API_ROUTES.USERS.LIST}/${id}`);
    return response.data;
  };

  const createUser = async (
    data: Omit<User, "id" | "created_at" | "updated_at">
  ) => {
    const response = await $baseApi.post<User>(API_ROUTES.USERS.LIST, data);
    return response.data;
  };

  const updateUser = async (
    id: string,
    data: Partial<Omit<User, "id" | "created_at" | "updated_at">>
  ) => {
    const response = await $baseApi.patch<User>(
      `${API_ROUTES.USERS.LIST}/${id}`,
      data
    );
    return response.data;
  };

  const deleteUser = async (id: string) => {
    const response = await $baseApi.delete(`${API_ROUTES.USERS.LIST}/${id}`);
    return response.data;
  };

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  };
};
