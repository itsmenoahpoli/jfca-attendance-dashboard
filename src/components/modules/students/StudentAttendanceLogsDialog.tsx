import React from "react";
import { Dialog, Flex, Select, TextField } from "@radix-ui/themes";
import { Calendar } from "lucide-react";
import { type Student } from "@/services/students.service";
import { useSectionsService } from "@/services/sections.service";
import { useQuery } from "@tanstack/react-query";
import {
  useAttendanceService,
  type AttendanceLog,
} from "@/services/attendance.service";
import { format, isValid } from "date-fns";

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return isValid(date) ? format(date, "MMM d, yyyy h:mm a") : "-";
};

interface StudentAttendanceLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | undefined;
}

export const StudentAttendanceLogsDialog: React.FC<
  StudentAttendanceLogsDialogProps
> = ({ open, onOpenChange, student }) => {
  const [filters, setFilters] = React.useState({
    startDate: "",
    endDate: "",
    type: "all",
    section: "all",
  });

  const sectionsService = useSectionsService();
  const attendanceService = useAttendanceService();

  const { data: sections = [] } = useQuery({
    queryKey: ["sections"],
    queryFn: sectionsService.getSections,
  });

  const { data: attendanceLogs = [] } = useQuery({
    queryKey: ["attendance-logs", student?.id],
    queryFn: () => attendanceService.getAttendanceLogs(),
    enabled: !!student,
  });

  const filteredLogs = React.useMemo(() => {
    return attendanceLogs.filter((log) => {
      if (filters.type !== "all" && !log.time_in && filters.type === "time-in")
        return false;
      if (
        filters.type !== "all" &&
        !log.time_out &&
        filters.type === "time-out"
      )
        return false;
      if (
        filters.section !== "all" &&
        log.student.section.name !== filters.section
      )
        return false;
      if (
        filters.startDate &&
        new Date(log.date_recorded) < new Date(filters.startDate)
      )
        return false;
      if (
        filters.endDate &&
        new Date(log.date_recorded) > new Date(filters.endDate)
      )
        return false;
      return true;
    });
  }, [attendanceLogs, filters]);

  const groupedLogs = React.useMemo(() => {
    const groups: Record<string, AttendanceLog[]> = {};
    filteredLogs.forEach((log) => {
      const sectionName = log.student.section.name;
      if (!groups[sectionName]) {
        groups[sectionName] = [];
      }
      groups[sectionName].push(log);
    });
    return groups;
  }, [filteredLogs]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="!w-[90vw] !max-w-[90vw]">
        <Dialog.Title>
          Attendance Logs -{" "}
          {student ? `${student.first_name} ${student.last_name}` : ""}
        </Dialog.Title>
        <Dialog.Description className="text-gray-500 mb-4">
          View attendance logs for this student.
        </Dialog.Description>

        <div className="mt-4">
          <Flex gap="3" mb="4">
            <TextField.Root
              type="date"
              value={filters.startDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              size="2"
            >
              <TextField.Slot>
                <Calendar size={16} />
              </TextField.Slot>
            </TextField.Root>
            <TextField.Root
              type="date"
              value={filters.endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              size="2"
            >
              <TextField.Slot>
                <Calendar size={16} />
              </TextField.Slot>
            </TextField.Root>
            <Select.Root
              value={filters.type}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value }))
              }
              size="2"
            >
              <Select.Trigger placeholder="Type" />
              <Select.Content>
                <Select.Item value="all">All Types</Select.Item>
                <Select.Item value="time-in">Time In</Select.Item>
                <Select.Item value="time-out">Time Out</Select.Item>
              </Select.Content>
            </Select.Root>
            {!student && (
              <Select.Root
                value={filters.section}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, section: value }))
                }
                size="2"
              >
                <Select.Trigger placeholder="Section" />
                <Select.Content>
                  <Select.Item value="all">All Sections</Select.Item>
                  {sections.map((section) => (
                    <Select.Item key={section.id} value={section.name}>
                      {section.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            )}
          </Flex>

          <div className="space-y-6">
            {Object.entries(groupedLogs).map(([section, logs]) => (
              <div
                key={section}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {section}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time In
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time Out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Recorded At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log) => (
                        <tr
                          key={log.date_recorded}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                log.time_in
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {log.time_in ? "IN" : "OUT"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(log.time_in)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(log.time_out)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {log.in_status ? "Present" : "Absent"}
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
              </div>
            ))}

            {Object.keys(groupedLogs).length === 0 && (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="p-4 bg-gray-50 rounded-lg inline-block">
                    <p className="text-gray-500">No attendance logs found</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
