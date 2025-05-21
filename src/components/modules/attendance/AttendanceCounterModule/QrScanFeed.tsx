import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useStudentsService, type Student } from "@/services/students.service";
import { useAttendanceService } from "@/services/attendance.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@radix-ui/themes";

interface QrScanFeedProps {
  isEnabled: boolean;
  onStudentScanned: (
    student: Student | null,
    status?: { in_status: boolean; out_status: boolean }
  ) => void;
}

interface IDetectedBarcode {
  rawValue: string;
}

export const QrScanFeed: React.FC<QrScanFeedProps> = ({
  isEnabled,
  onStudentScanned,
}) => {
  const [scannedValue, setScannedValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const { getStudent } = useStudentsService();
  const { timeInOut } = useAttendanceService();

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (!isEnabled) return;

    if (detectedCodes.length > 0) {
      const studentId = detectedCodes[0].rawValue;

      if (studentId === scannedValue) return;

      setScannedValue(studentId);
      setErrorMessage("");

      try {
        setIsLoading(true);
        const studentData = await getStudent(studentId);
        const attendanceResponse = await timeInOut(studentId);
        console.log("Attendance API response:", attendanceResponse);
        onStudentScanned(studentData, {
          in_status: attendanceResponse.in_status,
          out_status: attendanceResponse.out_status,
        });

        setTimeout(() => {
          setScannedValue("");
          setScannerKey((prev) => prev + 1);
        }, 3000);
      } catch (error: any) {
        console.error("Error processing student data:", error);
        onStudentScanned(null);

        if (error.response?.status === 400) {
          setErrorMessage(error.response.data.detail || "Invalid request");
          setShowErrorModal(true);
        } else {
          setErrorMessage("Failed to process student data");
        }

        setTimeout(() => {
          setScannedValue("");
          setErrorMessage("");
          setScannerKey((prev) => prev + 1);
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setScannedValue("");
    setErrorMessage("");
    setShowErrorModal(false);
    setScannerKey((prev) => prev + 1);
  };

  const handleModalClose = () => {
    setShowErrorModal(false);
    setScannedValue("");
    onStudentScanned(null);
    setErrorMessage("");
    setScannerKey((prev) => prev + 1);
  };

  return (
    <div className="w-full h-full p-10">
      <div className="w-3/4 h-[520px] my-3 mx-auto">
        {isEnabled ? (
          <Scanner
            key={scannerKey}
            onScan={handleScan}
            constraints={{
              facingMode: "environment",
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">QR Scanner is disabled</p>
          </div>
        )}
      </div>
      {isLoading && (
        <div className="text-center mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg font-medium">Loading student data...</p>
        </div>
      )}
      {!isLoading && scannedValue && (
        <div className="text-center mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg font-medium">Scanned Value:</p>
          <p className="text-gray-700">{scannedValue}</p>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <Button
            variant="soft"
            color="gray"
            className="mt-4"
            onClick={handleReset}
          >
            <RotateCcw size={16} className="mr-2" />
            Scan Again
          </Button>
        </div>
      )}

      <Dialog open={showErrorModal} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              Attendance Already Recorded
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              <p className="text-gray-600">
                This student has already completed their time-in and time-out
                for today.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please try again tomorrow.
              </p>
            </DialogDescription>
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleModalClose}
                className="!text-sm !text-red-600 !font-medium"
              >
                Close
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
