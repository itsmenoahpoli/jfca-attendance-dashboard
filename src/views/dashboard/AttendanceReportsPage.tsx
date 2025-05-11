import React from "react";
import { Tabs, Flex, TextField, Select, Button } from "@radix-ui/themes";
import { format } from "date-fns";
import { Download } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type AttendanceRecord = {
  id: string;
  studentName: string;
  yearLevel: string;
  className: string;
  date: Date;
  timeIn: Date | null;
  timeOut: Date | null;
  status: "Present" | "Late" | "Absent";
};

const DUMMY_DATA: AttendanceRecord[] = Array.from({ length: 10 }, (_, i) => ({
  id: `record-${i + 1}`,
  studentName: [
    "John Smith",
    "Maria Garcia",
    "James Johnson",
    "Patricia Lee",
    "Robert Wilson",
    "Linda Anderson",
    "Michael Brown",
    "Elizabeth Taylor",
    "William Davis",
    "Jennifer Martinez",
  ][i],
  yearLevel: `Grade ${Math.floor(Math.random() * 3) + 10}`,
  className: `Grade ${Math.floor(Math.random() * 3) + 10}-${String.fromCharCode(
    65 + (i % 3)
  )}`,
  date: new Date(),
  timeIn: i % 3 === 0 ? null : new Date(Date.now() - Math.random() * 3600000),
  timeOut: i % 3 === 0 ? null : new Date(Date.now() - Math.random() * 1800000),
  status: ["Present", "Late", "Absent"][Math.floor(Math.random() * 3)] as
    | "Present"
    | "Late"
    | "Absent",
}));

const Filters: React.FC = () => (
  <Flex gap="3">
    <TextField.Root size="2" placeholder="Search student name..." />
    <Select.Root defaultValue="all" size="2">
      <Select.Trigger placeholder="Year Level" />
      <Select.Content>
        <Select.Item value="all">All Year Levels</Select.Item>
        <Select.Item value="10">Grade 10</Select.Item>
        <Select.Item value="11">Grade 11</Select.Item>
        <Select.Item value="12">Grade 12</Select.Item>
      </Select.Content>
    </Select.Root>
    <Select.Root defaultValue="all" size="2">
      <Select.Trigger placeholder="Class/Section" />
      <Select.Content>
        <Select.Item value="all">All Classes</Select.Item>
        <Select.Item value="10a">Grade 10-A</Select.Item>
        <Select.Item value="10b">Grade 10-B</Select.Item>
        <Select.Item value="11a">Grade 11-A</Select.Item>
        <Select.Item value="11b">Grade 11-B</Select.Item>
        <Select.Item value="12a">Grade 12-A</Select.Item>
        <Select.Item value="12b">Grade 12-B</Select.Item>
      </Select.Content>
    </Select.Root>
    <Select.Root defaultValue="all" size="2">
      <Select.Trigger placeholder="Status" />
      <Select.Content>
        <Select.Item value="all">All Status</Select.Item>
        <Select.Item value="present">Present</Select.Item>
        <Select.Item value="late">Late</Select.Item>
        <Select.Item value="absent">Absent</Select.Item>
      </Select.Content>
    </Select.Root>
  </Flex>
);

const AttendanceTable: React.FC<{ data: AttendanceRecord[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg">
      <thead className="bg-gray-50">
        <tr>
          {[
            "Student Name",
            "Year Level",
            "Class/Section",
            "Date",
            "Time In",
            "Time Out",
            "Status",
          ].map((header) => (
            <th
              key={header}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((record) => (
          <tr key={record.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {record.studentName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {record.yearLevel}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {record.className}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {format(record.date, "MMM d, yyyy")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {record.timeIn ? format(record.timeIn, "h:mm a") : "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {record.timeOut ? format(record.timeOut, "h:mm a") : "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  record.status === "Present"
                    ? "bg-green-100 text-green-800"
                    : record.status === "Late"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {record.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CalendarView: React.FC<{ data: AttendanceRecord[] }> = ({ data }) => {
  const events = data.map((record) => ({
    id: record.id,
    title: `${record.studentName} - ${record.status}`,
    date: record.date,
    backgroundColor:
      record.status === "Present"
        ? "#22c55e"
        : record.status === "Late"
        ? "#eab308"
        : "#ef4444",
    borderColor:
      record.status === "Present"
        ? "#16a34a"
        : record.status === "Late"
        ? "#ca8a04"
        : "#dc2626",
    extendedProps: {
      studentName: record.studentName,
      yearLevel: record.yearLevel,
      className: record.className,
      timeIn: record.timeIn,
      timeOut: record.timeOut,
      status: record.status,
    },
  }));

  const handleEventClick = (info: any) => {
    const event = info.event;
    const props = event.extendedProps;

    // You can implement a modal or tooltip here to show detailed information
    console.log("Event clicked:", {
      studentName: props.studentName,
      yearLevel: props.yearLevel,
      className: props.className,
      timeIn: props.timeIn ? format(new Date(props.timeIn), "h:mm a") : "-",
      timeOut: props.timeOut ? format(new Date(props.timeOut), "h:mm a") : "-",
      status: props.status,
    });
  };

  return (
    <div className="h-[700px]">
      {" "}
      {/* Adjust height as needed */}
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
    </div>
  );
};

export const AttendanceReportsPage: React.FC = () => {
  return (
    <div className="h-full w-full p-4">
      <h1 className="text-2xl font-bold mb-6">Attendance Reports</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Flex justify="between" align="center" mb="4">
          <Filters />
          <Button color="green">
            <Download size={16} /> Export Report
          </Button>
        </Flex>

        <Tabs.Root defaultValue="list">
          <Tabs.List>
            <Tabs.Trigger value="list">List View</Tabs.Trigger>
            <Tabs.Trigger value="calendar">Calendar View</Tabs.Trigger>
          </Tabs.List>

          <div className="mt-4">
            <Tabs.Content value="list">
              <AttendanceTable data={DUMMY_DATA} />
              <Flex justify="between" align="center" mt="4">
                <div className="text-sm text-gray-500">
                  Showing 1 to 10 of 20 entries
                </div>
                <Flex gap="2">
                  <Button variant="soft" color="gray" disabled>
                    Previous
                  </Button>
                  <Button variant="soft" color="gray">
                    1
                  </Button>
                  <Button variant="soft" color="gray">
                    2
                  </Button>
                  <Button variant="soft" color="gray">
                    Next
                  </Button>
                </Flex>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="calendar">
              <CalendarView data={DUMMY_DATA} />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};
