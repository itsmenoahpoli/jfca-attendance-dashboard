import React from "react";
import { Flex } from "@radix-ui/themes";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  UserCog,
  Webcam,
  MessageSquare,
  Database,
} from "lucide-react";
import { format } from "date-fns";

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
};

type AttendanceLog = {
  id: string;
  type: "time-in" | "time-out";
  timeIn: Date | null;
  timeOut: Date | null;
  studentName: string;
  studentClass: string;
  status: "Recorded";
  recordedAt: Date;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
    <Flex justify="between" align="center">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    </Flex>
  </div>
);

const AttendanceTable: React.FC<{ logs: AttendanceLog[] }> = ({ logs }) => (
  <div className="overflow-hidden">
    <table className="min-w-full bg-white rounded-lg">
      <thead className="bg-gray-50">
        <tr>
          <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Type
          </th>
          <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Time-in at
          </th>
          <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Time-out at
          </th>
          <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Student Name
          </th>
          <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Student Class
          </th>
          <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Status
          </th>
          <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Recorded at
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 overflow-y-auto">
        {logs.map((log) => (
          <tr key={log.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {log.type === "time-in" ? "Time-in" : "Time-out"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {log.timeIn ? format(log.timeIn, "MMM d, yyyy h:mm a") : "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {log.timeOut ? format(log.timeOut, "MMM d, yyyy h:mm a") : "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {log.studentName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {log.studentClass}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {log.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {format(log.recordedAt, "MMM d, yyyy h:mm a")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const OverviewPage: React.FC = () => {
  const stats = [
    {
      title: "Total Students",
      value: 250,
      icon: <Users size={24} className="text-blue-600" />,
      color: "border-blue-600",
    },
    {
      title: "Total Classes",
      value: 12,
      icon: <BookOpen size={24} className="text-green-600" />,
      color: "border-green-600",
    },
    {
      title: "Attendance Entries",
      value: 1250,
      icon: <ClipboardCheck size={24} className="text-purple-600" />,
      color: "border-purple-600",
    },
    {
      title: "Admin Accounts",
      value: 5,
      icon: <UserCog size={24} className="text-orange-600" />,
      color: "border-orange-600",
    },
  ];

  const attendanceLogs: AttendanceLog[] = [
    {
      id: "1",
      type: "time-in",
      timeIn: new Date(),
      timeOut: null,
      studentName: "John Doe",
      studentClass: "Grade 10-A",
      status: "Recorded",
      recordedAt: new Date(),
    },
    {
      id: "2",
      type: "time-out",
      timeIn: new Date(Date.now() - 8 * 60 * 60 * 1000),
      timeOut: new Date(),
      studentName: "Jane Smith",
      studentClass: "Grade 11-B",
      status: "Recorded",
      recordedAt: new Date(),
    },
    {
      id: "3",
      type: "time-in",
      timeIn: new Date(Date.now() - 2 * 60 * 60 * 1000),
      timeOut: null,
      studentName: "Michael Johnson",
      studentClass: "Grade 12-A",
      status: "Recorded",
      recordedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "4",
      type: "time-out",
      timeIn: new Date(Date.now() - 7 * 60 * 60 * 1000),
      timeOut: new Date(),
      studentName: "Emily Brown",
      studentClass: "Grade 10-C",
      status: "Recorded",
      recordedAt: new Date(),
    },
    {
      id: "5",
      type: "time-in",
      timeIn: new Date(Date.now() - 1 * 60 * 60 * 1000),
      timeOut: null,
      studentName: "William Davis",
      studentClass: "Grade 11-A",
      status: "Recorded",
      recordedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: "6",
      type: "time-in",
      timeIn: new Date(Date.now() - 3 * 60 * 60 * 1000),
      timeOut: null,
      studentName: "Sophia Wilson",
      studentClass: "Grade 12-B",
      status: "Recorded",
      recordedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: "7",
      type: "time-out",
      timeIn: new Date(Date.now() - 6 * 60 * 60 * 1000),
      timeOut: new Date(),
      studentName: "Oliver Taylor",
      studentClass: "Grade 10-B",
      status: "Recorded",
      recordedAt: new Date(),
    },
    {
      id: "8",
      type: "time-in",
      timeIn: new Date(Date.now() - 4 * 60 * 60 * 1000),
      timeOut: null,
      studentName: "Emma Anderson",
      studentClass: "Grade 11-C",
      status: "Recorded",
      recordedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: "9",
      type: "time-out",
      timeIn: new Date(Date.now() - 5 * 60 * 60 * 1000),
      timeOut: new Date(),
      studentName: "Lucas Martinez",
      studentClass: "Grade 12-C",
      status: "Recorded",
      recordedAt: new Date(),
    },
    {
      id: "10",
      type: "time-in",
      timeIn: new Date(Date.now() - 2 * 60 * 60 * 1000),
      timeOut: null,
      studentName: "Ava Thompson",
      studentClass: "Grade 10-A",
      status: "Recorded",
      recordedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "11",
      type: "time-out",
      timeIn: new Date(Date.now() - 7 * 60 * 60 * 1000),
      timeOut: new Date(),
      studentName: "Ethan White",
      studentClass: "Grade 11-B",
      status: "Recorded",
      recordedAt: new Date(),
    },
    {
      id: "12",
      type: "time-in",
      timeIn: new Date(Date.now() - 3 * 60 * 60 * 1000),
      timeOut: null,
      studentName: "Isabella Clark",
      studentClass: "Grade 12-A",
      status: "Recorded",
      recordedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: "13",
      type: "time-out",
      timeIn: new Date(Date.now() - 6 * 60 * 60 * 1000),
      timeOut: new Date(),
      studentName: "Mason Lee",
      studentClass: "Grade 10-C",
      status: "Recorded",
      recordedAt: new Date(),
    },
    {
      id: "14",
      type: "time-in",
      timeIn: new Date(Date.now() - 1 * 60 * 60 * 1000),
      timeOut: null,
      studentName: "Sophie Turner",
      studentClass: "Grade 11-A",
      status: "Recorded",
      recordedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: "15",
      type: "time-out",
      timeIn: new Date(Date.now() - 8 * 60 * 60 * 1000),
      timeOut: new Date(),
      studentName: "Alexander Scott",
      studentClass: "Grade 12-B",
      status: "Recorded",
      recordedAt: new Date(),
    },
    {
      id: "16",
      type: "time-in",
      timeIn: new Date(Date.now() - 2 * 60 * 60 * 1000),
      timeOut: null,
      studentName: "Mia Rodriguez",
      studentClass: "Grade 10-B",
      status: "Recorded",
      recordedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "17",
      type: "time-out",
      timeIn: new Date(Date.now() - 7 * 60 * 60 * 1000),
      timeOut: new Date(),
      studentName: "Daniel Kim",
      studentClass: "Grade 11-C",
      status: "Recorded",
      recordedAt: new Date(),
    },
    {
      id: "18",
      type: "time-in",
      timeIn: new Date(Date.now() - 3 * 60 * 60 * 1000),
      timeOut: null,
      studentName: "Charlotte Adams",
      studentClass: "Grade 12-C",
      status: "Recorded",
      recordedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: "19",
      type: "time-out",
      timeIn: new Date(Date.now() - 6 * 60 * 60 * 1000),
      timeOut: new Date(),
      studentName: "Henry Garcia",
      studentClass: "Grade 10-A",
      status: "Recorded",
      recordedAt: new Date(),
    },
    {
      id: "20",
      type: "time-in",
      timeIn: new Date(Date.now() - 1 * 60 * 60 * 1000),
      timeOut: null,
      studentName: "Victoria Wright",
      studentClass: "Grade 11-B",
      status: "Recorded",
      recordedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ];

  return (
    <div className="h-full w-full p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Status Indicators */}
      <div className="flex items-center gap-6 mb-4">
        {/* Webcam Status */}
        <div className="flex items-center gap-2">
          <Webcam size={16} className="text-green-500" />
          <span className="text-sm font-medium">
            Webcam Feed: <span className="text-green-500">Online</span>
          </span>
        </div>

        {/* SMS Server Status */}
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-green-500" />
          <span className="text-sm font-medium">
            SMS Server: <span className="text-green-500">Online</span>
          </span>
        </div>

        {/* Database Server Status */}
        <div className="flex items-center gap-2">
          <Database size={16} className="text-green-500" />
          <span className="text-sm font-medium">
            Database: <span className="text-green-500">Online</span>
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Attendance Logs Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Attendance Logs</h2>
        <div className="max-h-[500px] overflow-auto rounded-lg border border-gray-200">
          <AttendanceTable logs={attendanceLogs} />
        </div>
      </div>
    </div>
  );
};
