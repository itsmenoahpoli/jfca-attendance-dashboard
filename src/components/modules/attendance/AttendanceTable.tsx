import React from "react";
import { format } from "date-fns";
import { type AttendanceLog } from "@/services/attendance.service";

export const AttendanceTable: React.FC<{ logs: AttendanceLog[] }> = ({
  logs,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return format(date, "MMM d, yyyy h:mm a");
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "-";
    }
  };

  return (
    <div className="overflow-hidden">
      <table className="min-w-full bg-white rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Status
            </th>
            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Time-in
            </th>
            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Time-out
            </th>
            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Student Name
            </th>
            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Guardian Name
            </th>
            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Class
            </th>
            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              SMS Status
            </th>
            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Recorded At
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 overflow-y-auto">
          {logs.map((log) => (
            <tr key={log.student_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.in_status && !log.out_status
                      ? "bg-green-100 text-green-800"
                      : log.in_status && log.out_status
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {log.in_status && !log.out_status
                    ? "IN"
                    : log.in_status && log.out_status
                    ? "OUT"
                    : "PENDING"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(log.time_in)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(log.time_out)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.student?.name || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {log.student?.guardian_name || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.student?.section?.name || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.sms_notif_status === "sent"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {log.sms_notif_status?.toUpperCase() || "PENDING"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(log.date_recorded)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
