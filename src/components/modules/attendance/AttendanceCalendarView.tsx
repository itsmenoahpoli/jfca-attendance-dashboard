import React from "react";
import { format } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, Flex, Select } from "@radix-ui/themes";
import { type AttendanceLog } from "@/services/attendance.service";
import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import brandLogo from "@/assets/images/brand-logo.png";

interface AttendanceCalendarViewProps {
  data: AttendanceLog[];
}

interface DayDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  logs: AttendanceLog[];
}

const getStatus = (log: AttendanceLog) => {
  if (log.in_status && log.out_status) {
    return "OUT";
  }
  return "PENDING/INCOMPLETE";
};

const getStatusBadgeColor = (log: AttendanceLog) => {
  if (log.in_status && log.out_status) {
    return "bg-green-100 text-green-800";
  }
  return "bg-orange-100 text-orange-800";
};

const DayDetailsDialog: React.FC<DayDetailsDialogProps> = ({
  open,
  onOpenChange,
  date,
  logs,
}) => {
  const [selectedSection, setSelectedSection] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  const groupedLogs = React.useMemo(() => {
    if (!date) return {};
    const filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.date_recorded);
      return (
        logDate.getFullYear() === date.getFullYear() &&
        logDate.getMonth() === date.getMonth() &&
        logDate.getDate() === date.getDate()
      );
    });

    return filteredLogs.reduce((acc, log) => {
      const sectionName = log.student.section.name;
      if (!acc[sectionName]) {
        acc[sectionName] = [];
      }
      acc[sectionName].push(log);
      return acc;
    }, {} as Record<string, AttendanceLog[]>);
  }, [logs, date]);

  const sections = React.useMemo(() => {
    return ["all", ...Object.keys(groupedLogs)];
  }, [groupedLogs]);

  const filteredGroupedLogs = React.useMemo(() => {
    if (selectedSection === "all" && selectedStatus === "all") {
      return groupedLogs;
    }

    const filtered: Record<string, AttendanceLog[]> = {};
    Object.entries(groupedLogs).forEach(([section, logs]) => {
      if (selectedSection !== "all" && section !== selectedSection) {
        return;
      }

      const filteredLogs = logs.filter((log) => {
        if (selectedStatus === "all") return true;
        const status =
          log.in_status && !log.out_status
            ? "in"
            : log.in_status && log.out_status
            ? "out"
            : "pending";
        return status === selectedStatus;
      });

      if (filteredLogs.length > 0) {
        filtered[section] = filteredLogs;
      }
    });

    return filtered;
  }, [groupedLogs, selectedSection, selectedStatus]);

  const handleExport = async () => {
    if (!date || Object.keys(filteredGroupedLogs).length === 0) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

    const logoBase64 = await getLogoBase64(brandLogo);
    addHeader(doc, logoBase64, pageWidth);

    let yPosition = 40;

    doc.setFontSize(16);
    doc.text("Attendance Report", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(format(date, "MMMM d, yyyy"), pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 15;

    Object.entries(filteredGroupedLogs).forEach(([section, sectionLogs]) => {
      if (yPosition > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        addHeader(doc, logoBase64, pageWidth);
        yPosition = 40;
      }

      doc.setFontSize(14);
      doc.text(section, margin, yPosition);
      yPosition += 10;

      const tableData = sectionLogs.map((log) => [
        log.student.name,
        log.time_in ? format(new Date(log.time_in), "h:mm a") : "-",
        log.time_out ? format(new Date(log.time_out), "h:mm a") : "-",
        getStatus(log),
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [["Student Name", "Time In", "Time Out", "Status"]],
        body: tableData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    });

    doc.save(`attendance_report_${format(date, "yyyy-MM-dd")}.pdf`);
  };

  const totalLogs = Object.values(filteredGroupedLogs).reduce(
    (sum, logs) => sum + logs.length,
    0
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="!w-[90vw] !max-w-[90vw]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Dialog.Title>
              Attendance Logs - {date ? format(date, "MMMM d, yyyy") : ""}
            </Dialog.Title>
            <Dialog.Description className="text-gray-500">
              View attendance logs for this day.
            </Dialog.Description>
          </div>
          <div className="flex gap-4">
            <Select.Root
              value={selectedSection}
              onValueChange={setSelectedSection}
            >
              <Select.Trigger placeholder="Select Section" />
              <Select.Content>
                {sections.map((section) => (
                  <Select.Item key={section} value={section}>
                    {section === "all" ? "All Sections" : section}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <Select.Root
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <Select.Trigger placeholder="Select Status" />
              <Select.Content>
                <Select.Item value="all">All Status</Select.Item>
                <Select.Item value="in">In</Select.Item>
                <Select.Item value="out">Out</Select.Item>
                <Select.Item value="pending">Pending/Incomplete</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        <div className="mt-4">
          {totalLogs === 0 ? (
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
            <div className="space-y-6">
              {Object.entries(filteredGroupedLogs).map(
                ([section, sectionLogs]) => (
                  <div key={section} className="bg-white rounded-lg shadow">
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        {section}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
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
                          {sectionLogs.map((log) => (
                            <tr
                              key={`${log.student_id}-${log.date_recorded}`}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    {log.student.profile_photo ? (
                                      <img
                                        src={log.student.profile_photo}
                                        alt={log.student.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-sm font-medium text-blue-600">
                                          {log.student.name
                                            .charAt(0)
                                            .toUpperCase()}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {log.student.name}
                                    </div>
                                  </div>
                                </div>
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
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                    log
                                  )}`}
                                >
                                  {getStatus(log)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <Flex gap="3" mt="4" justify="end">
          {totalLogs > 0 && (
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 flex items-center gap-2"
            >
              <FileText size={16} />
              Export Daily Report (PDF)
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

const getLogoBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject();
      }
    };
    img.onerror = reject;
    img.src = url;
  });
};

const addHeader = (doc: jsPDF, logoBase64: string, pageWidth: number) => {
  const logoSize = 16;
  const margin = 10;
  doc.addImage(logoBase64, "PNG", margin, 8, logoSize, logoSize);
  doc.setFontSize(14);
  doc.text("JUBILEE CHRISTIAN FAITH ACADEMY", margin + logoSize + 6, 16);
  doc.setFontSize(10);
  doc.text("Imus, Cavite", margin + logoSize + 6, 22);
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, 26, pageWidth - margin, 26);
  doc.setDrawColor(0, 0, 0);
};

export const AttendanceCalendarView: React.FC<AttendanceCalendarViewProps> = ({
  data,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [isDayDetailsOpen, setIsDayDetailsOpen] = React.useState(false);

  const events = React.useMemo(() => {
    const uniqueDates = new Set(
      data.map((log) => {
        const date = new Date(log.date_recorded);
        return date.toISOString().split("T")[0];
      })
    );

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const allDates = [];
    for (
      let d = new Date(startOfMonth);
      d <= endOfMonth;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      allDates.push({
        start: dateStr,
        display: "background",
        backgroundColor: uniqueDates.has(dateStr) ? "#22c55e" : "#fef3c7",
        allDay: true,
      });
    }

    return allDates;
  }, [data]);

  const handleEventClick = (info: any) => {
    const event = info.event;
    const props = event.extendedProps;

    console.log(props);
  };

  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setIsDayDetailsOpen(true);
  };

  return (
    <div className="h-[700px] w-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-gray-700">Legends:</span>
        <div className="w-4 h-4 rounded bg-[#22c55e]"></div>
        <span className="text-sm text-gray-600">
          Days with attendance records
        </span>
        <div className="w-4 h-4 rounded bg-[#fef3c7] ml-4"></div>
        <span className="text-sm text-gray-600">
          Days without attendance records
        </span>
      </div>

      <div className="w-full h-full">
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
          eventDisplay="background"
          contentHeight="100%"
          aspectRatio={1.35}
        />
      </div>

      <DayDetailsDialog
        open={isDayDetailsOpen}
        onOpenChange={setIsDayDetailsOpen}
        date={selectedDate}
        logs={data}
      />
    </div>
  );
};
