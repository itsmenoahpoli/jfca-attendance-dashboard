import { useApi } from "@/hooks/use-api.hook";

export interface DashboardStats {
  total_students: number;
  total_sections: number;
  total_user_roles: number;
  total_users: number;
}

export const useDashboardService = () => {
  const { $baseApi } = useApi();

  const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await $baseApi.get("/dashboard/counts");
    return response.data;
  };

  return {
    getDashboardStats,
  };
};
