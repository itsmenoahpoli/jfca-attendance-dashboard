import React from "react";
import { ASSETS } from "@/constants";
import { AttendanceCounterModule } from "@/components";

export const AttendanceModulePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col pt-5">
      <img
        src={ASSETS.BRAND}
        alt="JCFA Logo"
        className="w-[150px] mx-auto mb-4"
      />
      <h1 className="text-2xl text-center text-black font-bold">
        JFCA Attendance Monitoring System
      </h1>
      <p className="text-lg text-center text-gray-900 font-medium my-6">
        Attandance Counter Module
      </p>

      <div className="flex-1 h-full bg-slate-100">
        <AttendanceCounterModule />
      </div>
    </div>
  );
};
