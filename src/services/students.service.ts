import { useApi } from "@/hooks/use-api.hook";

export interface Student {
  id: string;
  name: string;
  email: string;
  gender: string;
  contact: string;
  guardian_name: string;
  guardian_relation: string;
  guardian_mobile_number: string;
  section_id: string;
  student_key: string;
  is_enabled: boolean;
  section?: {
    id: string;
    name: string;
    level: string;
    school_year: string;
  };
  images?: {
    facefront: string;
    faceleft: string;
    faceright: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateStudentData {
  name: string;
  email: string;
  gender: string;
  contact: string;
  guardian_name: string;
  guardian_relation: string;
  guardian_mobile_number: string;
  section_id: string;
  leftSideImage?: string;
  frontSideImage?: string;
  rightSideImage?: string;
}

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
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("gender", data.gender);
    formData.append("contact", data.contact);
    formData.append("guardian_name", data.guardian_name);
    formData.append("guardian_relation", data.guardian_relation);
    formData.append("guardian_mobile_number", data.guardian_mobile_number);
    formData.append("section_id", data.section_id);
    formData.append("is_enabled", "true");

    const imagePromises = [];

    if (data.leftSideImage && data.leftSideImage.startsWith("data:")) {
      imagePromises.push(
        fetch(data.leftSideImage)
          .then((r) => r.blob())
          .then((blob) => {
            formData.append("photo1", blob, "photo1.jpg");
          })
      );
    }

    if (data.frontSideImage && data.frontSideImage.startsWith("data:")) {
      imagePromises.push(
        fetch(data.frontSideImage)
          .then((r) => r.blob())
          .then((blob) => {
            formData.append("photo2", blob, "photo2.jpg");
          })
      );
    }

    if (data.rightSideImage && data.rightSideImage.startsWith("data:")) {
      imagePromises.push(
        fetch(data.rightSideImage)
          .then((r) => r.blob())
          .then((blob) => {
            formData.append("photo3", blob, "photo3.jpg");
          })
      );
    }

    await Promise.all(imagePromises);

    const response = await $baseApi.post("/students", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    return response.data;
  };

  const updateStudent = async (
    id: string,
    data: Partial<CreateStudentData>
  ): Promise<Student> => {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.email) formData.append("email", data.email);
    if (data.gender) formData.append("gender", data.gender);
    if (data.contact) formData.append("contact", data.contact);
    if (data.guardian_name)
      formData.append("guardian_name", data.guardian_name);
    if (data.guardian_relation)
      formData.append("guardian_relation", data.guardian_relation);
    if (data.guardian_mobile_number)
      formData.append("guardian_mobile_number", data.guardian_mobile_number);
    if (data.section_id) formData.append("section_id", data.section_id);

    const imagePromises = [];

    if (data.leftSideImage && data.leftSideImage.startsWith("data:")) {
      imagePromises.push(
        fetch(data.leftSideImage)
          .then((r) => r.blob())
          .then((blob) => {
            formData.append("photo1", blob, "photo1.jpg");
          })
      );
    }

    if (data.frontSideImage && data.frontSideImage.startsWith("data:")) {
      imagePromises.push(
        fetch(data.frontSideImage)
          .then((r) => r.blob())
          .then((blob) => {
            formData.append("photo2", blob, "photo2.jpg");
          })
      );
    }

    if (data.rightSideImage && data.rightSideImage.startsWith("data:")) {
      imagePromises.push(
        fetch(data.rightSideImage)
          .then((r) => r.blob())
          .then((blob) => {
            formData.append("photo3", blob, "photo3.jpg");
          })
      );
    }

    await Promise.all(imagePromises);

    const response = await $baseApi.patch(`/students/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    return response.data;
  };

  const deleteStudent = async (id: string): Promise<void> => {
    await $baseApi.delete(`/students/${id}`);
  };

  const importStudents = async (formData: FormData): Promise<void> => {
    await $baseApi.post("/students/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
  };

  return {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    importStudents,
  };
};
