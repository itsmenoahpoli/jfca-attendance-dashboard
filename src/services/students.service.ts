import { useApi } from "@/hooks/use-api.hook";

export interface Student {
  id: string;
  name: string;
  email: string;
  gender: string;
  contact: string;
  guardian_name: string;
  guardian_contact: string;
  section_id: string;
  leftSideImage?: string;
  frontSideImage?: string;
  rightSideImage?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStudentData {
  name: string;
  email: string;
  gender: string;
  contact: string;
  guardian_name: string;
  guardian_mobile_number: string;
  section_id: string;
  leftSideImage?: string;
  frontSideImage?: string;
  rightSideImage?: string;
}

export interface UpdateStudentData extends Partial<CreateStudentData> {}

export const useStudentsService = () => {
  const { $baseApi } = useApi();

  const getStudents = async (sectionId: string): Promise<Student[]> => {
    const response = await $baseApi.get(`/students?section_id=${sectionId}`);
    return response.data;
  };

  const getStudent = async (id: string): Promise<Student> => {
    const response = await $baseApi.get(`/students/${id}`);
    return response.data;
  };

  const createStudent = async (data: CreateStudentData): Promise<Student> => {
    const response = await $baseApi.post("/students", data);
    return response.data;
  };

  const updateStudent = async (
    id: string,
    data: UpdateStudentData
  ): Promise<Student> => {
    const response = await $baseApi.put(`/students/${id}`, data);
    return response.data;
  };

  const deleteStudent = async (id: string): Promise<void> => {
    await $baseApi.delete(`/students/${id}`);
  };

  return {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};
