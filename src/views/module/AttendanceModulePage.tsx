import React, { useState, useEffect } from "react";
import { ASSETS } from "@/constants";
import { AttendanceCounterModule } from "@/components";
import { Switch } from "@radix-ui/themes";

export const AttendanceModulePage: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentDateTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen w-full flex flex-col pt-5">
      <div className="relative">
        <img
          src={ASSETS.BRAND}
          alt="JCFA Logo"
          className="w-[150px] mx-auto mb-4"
        />
        <div className="absolute top-0 right-4 text-xl font-medium text-red-500">
          {formattedDateTime}
        </div>
      </div>
      <h1 className="text-2xl text-center text-black font-bold">
        JFCA Attendance Monitoring System
      </h1>
      <p className="text-lg text-center text-gray-900 font-medium my-6">
        Attandance Counter Module
      </p>

      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-sm font-medium">Webcam Feed</span>
        <Switch
          checked={isWebcamEnabled}
          onCheckedChange={setIsWebcamEnabled}
        />
      </div>

      <div className="flex-1 h-full bg-slate-100">
        <AttendanceCounterModule isWebcamEnabled={isWebcamEnabled} />
      </div>
    </div>
  );
};
