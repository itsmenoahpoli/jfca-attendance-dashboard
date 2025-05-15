import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useStudentsService, type Student } from "@/services/students.service";

interface QrScanFeedProps {
  isEnabled: boolean;
}

interface IDetectedBarcode {
  rawValue: string;
}

export const QrScanFeed: React.FC<QrScanFeedProps> = ({ isEnabled }) => {
  const [scannedValue, setScannedValue] = useState<string>("");
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getStudent } = useStudentsService();

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (!isEnabled) return;

    if (detectedCodes.length > 0) {
      const studentId = detectedCodes[0].rawValue;
      setScannedValue(studentId);

      try {
        setIsLoading(true);
        const studentData = await getStudent(studentId);
        setStudent(studentData);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setStudent(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full h-full p-10">
      <div className="w-3/4 h-[520px] my-3 mx-auto">
        {isEnabled ? (
          <Scanner
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
      {!isLoading && student && (
        <div className="text-center mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg font-medium">Student Information:</p>
          <p className="text-gray-700">Name: {student.name}</p>
          <p className="text-gray-700">ID: {student.id}</p>
          <p className="text-gray-700">Email: {student.email}</p>
        </div>
      )}
      {!isLoading && scannedValue && !student && (
        <div className="text-center mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg font-medium">Scanned Value:</p>
          <p className="text-gray-700">{scannedValue}</p>
          <p className="text-red-500">Student not found</p>
        </div>
      )}
    </div>
  );
};
