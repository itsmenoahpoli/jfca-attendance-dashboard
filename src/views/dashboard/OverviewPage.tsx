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
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useDashboardService } from "@/services/dashboard.service";
import { useAttendanceService } from "@/services/attendance.service";
import { WEB_ROUTES } from "@/constants";
import { AttendanceTable } from "@/components/modules/attendance/AttendanceTable";
import { type AttendanceLog } from "@/services/attendance.service";

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  link?: string;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  link,
}) => (
  <div
    className={`bg-white rounded-lg shadow-md p-6 pb-10 border-l-4 ${color} relative`}
  >
    <Flex justify="between" align="center">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    </Flex>
    {link && (
      <Link
        to={link}
        className="absolute bottom-2 right-3 text-sm text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1"
      >
        View Details <ArrowRight size={14} />
      </Link>
    )}
  </div>
);

export const OverviewPage: React.FC = () => {
  const { getDashboardStats } = useDashboardService();
  const { getAttendanceLogs } = useAttendanceService();

  const { data: dashboardStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  const { data: attendanceLogs = [], isLoading: isLogsLoading } = useQuery<
    AttendanceLog[]
  >({
    queryKey: ["attendance-logs"],
    queryFn: () => getAttendanceLogs(),
  });

  const stats = [
    {
      title: "Total Students",
      value: dashboardStats?.total_students ?? 0,
      icon: <Users size={24} className="text-blue-600" />,
      color: "border-blue-600",
      link: WEB_ROUTES.DASHBOARD_STUDENTS,
    },
    {
      title: "Total Classes",
      value: dashboardStats?.total_sections ?? 0,
      icon: <BookOpen size={24} className="text-green-600" />,
      color: "border-green-600",
      link: WEB_ROUTES.DASHBOARD_CLASSES,
    },
    {
      title: "Attendance Entries",
      value: dashboardStats?.total_user_roles ?? 0,
      icon: <ClipboardCheck size={24} className="text-purple-600" />,
      color: "border-purple-600",
      link: WEB_ROUTES.DASHBOARD_ATTENDANCE_REPORTS,
    },
    {
      title: "Admin Accounts",
      value: dashboardStats?.total_users ?? 0,
      icon: <UserCog size={24} className="text-orange-600" />,
      color: "border-orange-600",
    },
    {
      title: "Teacher Accounts",
      value: dashboardStats?.total_teachers ?? 0,
      icon: <Users size={24} className="text-indigo-600" />,
      color: "border-indigo-600",
      link: WEB_ROUTES.DASHBOARD_USERS,
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
        {isStatsLoading
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))
          : stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                link={stat.link}
              />
            ))}
      </div>

      {/* Attendance Logs Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Flex justify="between" align="center" mb="4">
          <h2 className="text-xl font-semibold">Recent Attendance Logs</h2>
          <Link
            to={WEB_ROUTES.DASHBOARD_ATTENDANCE_REPORTS}
            className="text-sm text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </Flex>
        <div className="max-h-[500px] overflow-auto rounded-lg border border-gray-200">
          {isLogsLoading ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading attendance logs...</p>
              </div>
            </div>
          ) : attendanceLogs.length === 0 ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <div className="p-4 bg-gray-50 rounded-lg inline-block">
                  <p className="text-gray-500">No attendance logs found</p>
                </div>
              </div>
            </div>
          ) : (
            <AttendanceTable logs={attendanceLogs} />
          )}
        </div>
      </div>
    </div>
  );
};
