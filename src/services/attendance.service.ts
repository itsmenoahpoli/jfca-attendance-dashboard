import { useApi } from "@/hooks/use-api.hook";

export interface AttendanceLog {
  student_id: string;
  date_recorded: string;
  time_in: string | null;
  time_out: string | null;
  in_status: boolean;
  out_status: boolean;
  sms_notif_status: string;
  created_at: string;
  updated_at: string;
  student: {
    name: string;
    guardian_name: string;
    guardian_mobile: string | null;
    section_id: string;
    profile_photo: string | null;
    section: {
      name: string;
      grade_level: string | null;
    };
  };
}

interface DateRangeParams {
  start_date?: string;
  end_date?: string;
}

export const useAttendanceService = () => {
  const { $baseApi } = useApi();

  const timeInOut = async (studentId: string): Promise<AttendanceLog> => {
    const response = await $baseApi.post("/attendance/time-in-out", {
      student_id: studentId,
    });
    return response.data;
  };

  const getAttendanceLogs = async (
    params?: DateRangeParams
  ): Promise<AttendanceLog[]> => {
    const response = await $baseApi.get("/attendance", { params });
    return response.data;
  };

  const recognizeFace = async (base64Image: string): Promise<any> => {
    const base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("file", blob, "captured-image.jpeg");

    const response = await $baseApi.post(
      "/face-recognition/recognize",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };

  return {
    timeInOut,
    getAttendanceLogs,
    recognizeFace,
  };
};
