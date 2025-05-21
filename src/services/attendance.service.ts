import { useApi } from "@/hooks/use-api.hook";

export interface AttendanceLog {
  id: string;
  type: "time-in" | "time-out";
  timeIn: Date | null;
  timeOut: Date | null;
  studentName: string;
  studentClass: string;
  status: "Recorded";
  recordedAt: Date;
  in_status: boolean;
  out_status: boolean;
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
    const response = await $baseApi.get("/attendance/logs");
    return response.data;
  };

  return {
    timeInOut,
    getAttendanceLogs,
  };
};
