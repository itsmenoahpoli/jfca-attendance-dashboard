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
    section: {
      name: string;
      grade_level: string | null;
    };
  };
}

export const useAttendanceService = () => {
  const { $baseApi } = useApi();

  const timeInOut = async (studentId: string): Promise<AttendanceLog> => {
    const response = await $baseApi.post("/attendance/time-in-out", {
      student_id: studentId,
    });
    return response.data;
  };

  const getAttendanceLogs = async (): Promise<AttendanceLog[]> => {
    const response = await $baseApi.get("/attendance");
    return response.data;
  };

  return {
    timeInOut,
    getAttendanceLogs,
  };
};
