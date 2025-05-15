import { useApi } from "@/hooks";
import { API_ROUTES } from "@/constants";
import { type Student } from "./students.service";

export type Section = {
  id: string;
  name: string;
  level: string;
  school_year: string;
  is_enabled: boolean;
  students?: Student[];
};

export const useSectionsService = () => {
  const { $baseApi } = useApi();

  const getSections = async () => {
    const response = await $baseApi.get<Section[]>(API_ROUTES.SECTIONS.LIST);
    return response.data;
  };

  const getSection = async (id: string) => {
    const response = await $baseApi.get<Section>(
      `${API_ROUTES.SECTIONS.LIST}/${id}`
    );
    return response.data;
  };

  const createSection = async (data: Omit<Section, "id">) => {
    const response = await $baseApi.post<Section>(
      API_ROUTES.SECTIONS.LIST,
      data
    );
    return response.data;
  };

  const updateSection = async (
    id: string,
    data: Partial<Omit<Section, "id">>
  ) => {
    const response = await $baseApi.patch<Section>(
      `${API_ROUTES.SECTIONS.LIST}/${id}`,
      data
    );
    return response.data;
  };

  const deleteSection = async (id: string) => {
    const response = await $baseApi.delete(`${API_ROUTES.SECTIONS.LIST}/${id}`);
    return response.data;
  };

  return {
    getSections,
    getSection,
    createSection,
    updateSection,
    deleteSection,
  };
};
