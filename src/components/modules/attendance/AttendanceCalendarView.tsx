import React from "react";
import { format } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, Flex } from "@radix-ui/themes";
import { type AttendanceLog } from "@/services/attendance.service";

interface AttendanceCalendarViewProps {
  data: AttendanceLog[];
}

interface DayDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  logs: AttendanceLog[];
}

const DayDetailsDialog: React.FC<DayDetailsDialogProps> = ({
  open,
  onOpenChange,
  date,
  logs,
}) => {
  const filteredLogs = React.useMemo(() => {
    if (!date) return [];
    return logs.filter((log) => {
      const logDate = new Date(log.date_recorded);
      return (
        logDate.getFullYear() === date.getFullYear() &&
        logDate.getMonth() === date.getMonth() &&
        logDate.getDate() === date.getDate()
      );
    });
  }, [logs, date]);

  const handleExport = () => {
    if (!date || filteredLogs.length === 0) return;

    const groupedLogs = filteredLogs.reduce((acc, log) => {
      const sectionName = log.student.section.name;
      if (!acc[sectionName]) {
        acc[sectionName] = [];
      }
      acc[sectionName].push(log);
      return acc;
    }, {} as Record<string, AttendanceLog[]>);

    const csvContent = Object.entries(groupedLogs)
      .map(([section, sectionLogs]) => {
        const sectionHeader = `\nSection: ${section}\n`;
        const headers = "Student Name,Class,Time In,Time Out,Status\n";
        const rows = sectionLogs
          .map((log) => {
            const timeIn = log.time_in
              ? format(new Date(log.time_in), "h:mm a")
              : "-";
            const timeOut = log.time_out
              ? format(new Date(log.time_out), "h:mm a")
              : "-";
            const status =
              log.in_status && !log.out_status
                ? "IN"
                : log.in_status && log.out_status
                ? "OUT"
                : "PENDING";
            return `"${log.student.name}","${log.student.section.name}","${timeIn}","${timeOut}","${status}"`;
          })
          .join("\n");
        return sectionHeader + headers + rows;
      })
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance_logs_${format(date, "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="!w-[90vw] !max-w-[90vw]">
        <Dialog.Title>
          Attendance Logs - {date ? format(date, "MMMM d, yyyy") : ""}
        </Dialog.Title>
        <Dialog.Description className="text-gray-500 mb-4">
          View attendance logs for this day.
        </Dialog.Description>

        <div className="mt-4">
          {filteredLogs.length === 0 ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <div className="p-4 bg-gray-50 rounded-lg inline-block">
                  <p className="text-gray-500">
                    No attendance logs found for this day
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr
                      key={`${log.student_id}-${log.date_recorded}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.student.section.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.time_in
                          ? format(new Date(log.time_in), "h:mm a")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.time_out
                          ? format(new Date(log.time_out), "h:mm a")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            log.in_status && !log.out_status
                              ? "bg-green-100 text-green-800"
                              : log.in_status && log.out_status
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {log.in_status && !log.out_status
                            ? "IN"
                            : log.in_status && log.out_status
                            ? "OUT"
                            : "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Flex gap="3" mt="4" justify="end">
          {filteredLogs.length > 0 && (
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Export CSV
            </button>
          )}
          <Dialog.Close>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Close
            </button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export const AttendanceCalendarView: React.FC<AttendanceCalendarViewProps> = ({
  data,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [isDayDetailsOpen, setIsDayDetailsOpen] = React.useState(false);

  const events = data.map((log) => ({
    id: log.student_id,
    title: `${log.student.name} - ${
      log.in_status && !log.out_status
        ? "IN"
        : log.in_status && log.out_status
        ? "OUT"
        : "PENDING"
    }`,
    date: new Date(log.date_recorded),
    backgroundColor:
      log.in_status && !log.out_status
        ? "#22c55e"
        : log.in_status && log.out_status
        ? "#eab308"
        : "#ef4444",
    borderColor:
      log.in_status && !log.out_status
        ? "#16a34a"
        : log.in_status && log.out_status
        ? "#ca8a04"
        : "#dc2626",
    extendedProps: {
      studentName: log.student.name,
      yearLevel: log.student.section.grade_level,
      className: log.student.section.name,
      timeIn: log.time_in,
      timeOut: log.time_out,
      status:
        log.in_status && !log.out_status
          ? "IN"
          : log.in_status && log.out_status
          ? "OUT"
          : "PENDING",
    },
  }));

  const handleEventClick = (info: any) => {
    const event = info.event;
    const props = event.extendedProps;

    console.log("Event clicked:", {
      studentName: props.studentName,
      yearLevel: props.yearLevel,
      className: props.className,
      timeIn: props.timeIn ? format(new Date(props.timeIn), "h:mm a") : "-",
      timeOut: props.timeOut ? format(new Date(props.timeOut), "h:mm a") : "-",
      status: props.status,
    });
  };

  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setIsDayDetailsOpen(true);
  };

  return (
    <div className="h-[700px]">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        height="100%"
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        dayMaxEvents={true}
        eventDisplay="block"
        eventContent={(eventInfo) => {
          return (
            <div className="fc-content p-1">
              <div className="text-xs font-semibold truncate">
                {eventInfo.event.extendedProps.studentName}
              </div>
              <div className="text-xs opacity-75">
                {eventInfo.event.extendedProps.status}
              </div>
            </div>
          );
        }}
      />

      <DayDetailsDialog
        open={isDayDetailsOpen}
        onOpenChange={setIsDayDetailsOpen}
        date={selectedDate}
        logs={data}
      />
    </div>
  );
};
