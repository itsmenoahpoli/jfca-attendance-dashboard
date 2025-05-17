import React, { useState, useEffect, ChangeEvent } from "react";
import { ASSETS } from "@/constants";
import { AttendanceCounterModule } from "@/components";
import { Switch, Dialog, TextField, Button, Flex } from "@radix-ui/themes";
import { Lock } from "lucide-react";

export const AttendanceModulePage: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const CORRECT_PASSCODE = "jfca2025$$";

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

  const handlePasscodeSubmit = () => {
    if (passcode === CORRECT_PASSCODE) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

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
        JCFA Attendance Monitoring System
      </h1>
      <p className="text-lg text-center text-gray-900 font-medium my-6">
        Attendance Counter Module
      </p>

      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-sm font-medium">Webcam Feed</span>
        <Switch
          checked={isWebcamEnabled}
          onCheckedChange={setIsWebcamEnabled}
        />
      </div>

      <div className="flex-1 h-full bg-slate-100">
        {isAuthenticated ? (
          <AttendanceCounterModule isWebcamEnabled={isWebcamEnabled} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500 mt-5">
              Please enter passcode to access the module
            </p>
          </div>
        )}
      </div>

      <Dialog.Root open={!isAuthenticated}>
        <Dialog.Content className="max-w-md">
          <Flex direction="column" align="center" gap="3" className="py-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <Dialog.Title className="text-center">Module Access</Dialog.Title>
            <Dialog.Description className="text-center text-gray-600">
              Please enter the passcode to access the attendance counter module
            </Dialog.Description>
            <div className="w-full mt-4">
              <TextField.Root
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPasscode(e.target.value)
                }
                className="w-full px-3 py-2 outline-none"
              ></TextField.Root>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Button color="blue" onClick={handlePasscodeSubmit}>
              Submit
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};
