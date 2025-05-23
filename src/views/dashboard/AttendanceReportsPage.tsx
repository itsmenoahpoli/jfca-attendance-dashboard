import React from "react";
import { Tabs, Flex, Button } from "@radix-ui/themes";
import { Download, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useAttendanceService } from "@/services/attendance.service";
import { AttendanceTable } from "@/components/modules/attendance/AttendanceTable";
import { AttendanceCalendarView } from "@/components/modules/attendance/AttendanceCalendarView";
import { AttendanceLogFilters } from "@/components/modules/attendance/AttendanceLogFilters";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import brandLogo from "@/assets/images/brand-logo.png";

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

  const handleExportDaily = async () => {
    if (filteredLogs.length === 0) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

    const logoBase64 = await getLogoBase64(brandLogo);
    addHeader(doc, logoBase64, pageWidth);

    let yPosition = 40;

    doc.setFontSize(16);
    doc.text("Daily Attendance Report", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(format(new Date(), "MMMM d, yyyy"), pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 15;

    const groupedLogs = filteredLogs.reduce((acc, log) => {
      const section = log.student.section.name;
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(log);
      return acc;
    }, {} as Record<string, typeof filteredLogs>);

    Object.entries(groupedLogs).forEach(([section, sectionLogs], index) => {
      if (yPosition > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        addHeader(doc, logoBase64, pageWidth);
        yPosition = 40;
      }

      if (index > 0) {
        yPosition += 35;
      }
      doc.setFontSize(14);
      doc.text(section, margin, yPosition);
      yPosition += 15;

      const tableData = sectionLogs.map((log) => [
        log.student.name,
        log.time_in ? format(new Date(log.time_in), "h:mm a") : "-",
        log.time_out ? format(new Date(log.time_out), "h:mm a") : "-",
        log.in_status && !log.out_status
          ? "Pending/Incomplete"
          : log.in_status && log.out_status
          ? "Present"
          : "Absent",
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [["Student Name", "Time In", "Time Out", "Status"]],
        body: tableData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      yPosition = (doc as any).lastAutoTable.finalY;

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition + 5, pageWidth - margin, yPosition + 5);
      doc.setDrawColor(0, 0, 0);
    });

    doc.save(`daily_attendance_report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  const handleExportReport = async () => {
    if (filteredLogs.length === 0) return;

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
    doc.text(format(new Date(), "MMMM d, yyyy"), pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 15;

    const tableData = filteredLogs.map((log) => [
      log.student.name,
      log.student.section.name,
      log.time_in ? format(new Date(log.time_in), "h:mm a") : "-",
      log.time_out ? format(new Date(log.time_out), "h:mm a") : "-",
      log.in_status && !log.out_status
        ? "Pending/Incomplete"
        : log.in_status && log.out_status
        ? "Present"
        : "Absent",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Student Name", "Section", "Time In", "Time Out", "Status"]],
      body: tableData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`attendance_report_${format(new Date(), "yyyy-MM-dd")}.pdf`);
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
        <Flex justify="between" align="center" mb="6">
          <AttendanceLogFilters onFilterChange={handleFilterChange} />
          <Flex gap="3">
            <Button color="blue" onClick={handleExportDaily}>
              <FileText size={16} className="mr-2" /> Daily PDF
            </Button>
            <Button color="green" onClick={handleExportReport}>
              <Download size={16} className="mr-2" /> Export Report
            </Button>
          </Flex>
        </Flex>

        <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
          <Tabs.List>
            <Tabs.Trigger value="list">List View</Tabs.Trigger>
            <Tabs.Trigger value="calendar">Calendar View</Tabs.Trigger>
          </Tabs.List>

          <div className="mt-6">
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
                <div className="mb-6">
                  <AttendanceTable logs={filteredLogs} />
                </div>
              )}
              <Flex justify="between" align="center" mt="6">
                <div className="text-sm text-gray-500">
                  Showing {filteredLogs.length} entries
                </div>
              </Flex>
            </Tabs.Content>

            <Tabs.Content
              value="calendar"
              className="pb-5 flex justify-center items-center mt-6"
            >
              <AttendanceCalendarView data={filteredLogs} />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};
