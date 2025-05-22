import React from "react";
import { Tabs, Flex, Button } from "@radix-ui/themes";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAttendanceService } from "@/services/attendance.service";
import { AttendanceTable } from "@/components/modules/attendance/AttendanceTable";
import { AttendanceCalendarView } from "@/components/modules/attendance/AttendanceCalendarView";
import { AttendanceLogFilters } from "@/components/modules/attendance/AttendanceLogFilters";

export const AttendanceReportsPage: React.FC = () => {
  const { getAttendanceLogs } = useAttendanceService();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab =
    searchParams.get("view") === "calendar" ? "calendar" : "list";

  const [filters, setFilters] = React.useState({
    search: "",
    yearLevel: "all",
    section: "all",
    status: "all",
  });

  const { data: attendanceLogs = [], isLoading } = useQuery({
    queryKey: ["attendance-logs"],
    queryFn: getAttendanceLogs,
  });

  const handleTabChange = (value: string) => {
    setSearchParams({ view: value });
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const filteredLogs = React.useMemo(() => {
    return attendanceLogs.filter((log) => {
      if (
        filters.search &&
        !log.student.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.yearLevel !== "all" &&
        log.student.section.grade_level !== filters.yearLevel
      ) {
        return false;
      }
      if (
        filters.section !== "all" &&
        log.student.section.name !== filters.section
      ) {
        return false;
      }
      if (filters.status !== "all") {
        const status =
          log.in_status && !log.out_status
            ? "present"
            : log.in_status && log.out_status
            ? "late"
            : "absent";
        if (status !== filters.status) {
          return false;
        }
      }
      return true;
    });
  }, [attendanceLogs, filters]);

  return (
    <div className="h-full w-full p-4">
      <h1 className="text-2xl font-bold mb-6">Attendance Reports</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Flex justify="between" align="center" mb="4">
          <AttendanceLogFilters onFilterChange={handleFilterChange} />
          <Button color="green">
            <Download size={16} /> Export Report
          </Button>
        </Flex>

        <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
          <Tabs.List>
            <Tabs.Trigger value="list">List View</Tabs.Trigger>
            <Tabs.Trigger value="calendar">Calendar View</Tabs.Trigger>
          </Tabs.List>

          <div className="mt-4">
            <Tabs.Content value="list">
              {isLoading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading attendance logs...</p>
                  </div>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="p-4 bg-gray-50 rounded-lg inline-block">
                      <p className="text-gray-500">No attendance logs found</p>
                    </div>
                  </div>
                </div>
              ) : (
                <AttendanceTable logs={filteredLogs} />
              )}
              <Flex justify="between" align="center" mt="4">
                <div className="text-sm text-gray-500">
                  Showing {filteredLogs.length} entries
                </div>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="calendar">
              <AttendanceCalendarView data={filteredLogs} />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};
