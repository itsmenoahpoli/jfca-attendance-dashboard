import React from "react";
import { Link } from "react-router-dom";
import { Flex, Select, Button } from "@radix-ui/themes";
import { WebcamScanFeed } from "./WebcamScanFeed";
import { QrScanFeed } from "./QrScanFeed";
import { type Student } from "@/services/students.service";
import { RotateCcw } from "lucide-react";

interface AttendanceCounterModuleProps {
  isWebcamEnabled: boolean;
}

interface AttendanceStatus {
  in_status: boolean;
  out_status: boolean;
}

const feedOptions = [
  {
    label: "Webcam Feed (Face Recognition)",
    value: "webcam-feed",
  },
  {
    label: "QR Code Scan Feed",
    value: "qr-scan-feed",
  },
];

const StatusBanner: React.FC<{ status: AttendanceStatus }> = ({ status }) => {
  const isTimeIn = status.in_status && !status.out_status;
  const isTimeOut = status.in_status && status.out_status;

  return (
    <div
      className={`w-full p-4 rounded-lg mb-4 ${
        isTimeIn
          ? "bg-green-50 border border-green-200"
          : "bg-blue-50 border border-blue-200"
      }`}
    >
      <p
        className={`text-center font-semibold ${
          isTimeIn ? "text-green-700" : "text-blue-700"
        }`}
      >
        {isTimeIn
          ? "TIME IN ATTENDANCE"
          : isTimeOut
          ? "TIME OUT ATTENDANCE"
          : "UNKNOWN STATUS"}
      </p>
    </div>
  );
};

const StudentDataBanner: React.FC<{
  student: Student | null;
  onReset: () => void;
  attendanceStatus?: AttendanceStatus;
}> = ({ student, onReset, attendanceStatus }) => {
  return (
    <Flex className="h-full" direction="column">
      <Flex justify="between" align="center">
        <h1 className="text-2xl font-bold">STUDENT DATA</h1>
        {student && (
          <Button
            variant="outline"
            color="red"
            onClick={onReset}
            className="!text-red-500 !bg-red-50 hover:!bg-red-100"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset and re-scan
          </Button>
        )}
      </Flex>
      {student ? (
        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {attendanceStatus && <StatusBanner status={attendanceStatus} />}
          <Flex direction="column" gap="6">
            <Flex justify="center">
              {student.images?.facefront ? (
                <img
                  src={student.images.facefront}
                  alt={student.first_name}
                  className="w-48 h-48 rounded-full object-cover"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl text-gray-500">
                    {student.first_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </Flex>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium">{student.student_key}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {student.first_name} {student.middle_name} {student.last_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Section</p>
                <p className="font-medium">{student.section?.name || "-"}</p>
              </div>
            </div>
          </Flex>
        </div>
      ) : (
        <Flex justify="center" align="center" className="h-full">
          <p>No data available</p>
        </Flex>
      )}
    </Flex>
  );
};

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      <h1 className="text-md mt-5">Initializing, please wait</h1>
    </div>
  );
};

const SectionLoader = () => {
  return (
    <div className="h-full w-full bg-white flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      <h1 className="text-md mt-5">
        Querying student information, please wait
      </h1>
    </div>
  );
};

export const AttendanceCounterModule: React.FC<
  AttendanceCounterModuleProps
> = ({ isWebcamEnabled }) => {
  const [selectedFeed, setSelectedFeed] = React.useState<string>("webcam-feed");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFetchingStudent, setIsFetchingStudent] = React.useState(false);
  const [scannedStudent, setScannedStudent] = React.useState<Student | null>(
    null
  );
  const [attendanceStatus, setAttendanceStatus] =
    React.useState<AttendanceStatus | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleFeedChange = (value: string) => {
    setSelectedFeed(value);
  };

  const handleStudentScanned = (
    student: Student | null,
    status?: AttendanceStatus
  ) => {
    console.log("Student scanned with status:", status);
    setScannedStudent(student);
    setAttendanceStatus(status || null);
    setIsFetchingStudent(false);
  };

  const handleResetScanned = () => {
    setScannedStudent(null);
    setAttendanceStatus(null);
  };

  const handleImageCapture = (image: string) => {
    console.log(image);
    setIsFetchingStudent(true);
    // TODO: Process the image and fetch student data
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="w-full h-full p-10">
      <Link to="/">
        <Button variant="soft" className="!font-bold">
          Back to Home
        </Button>
      </Link>

      <Flex className="mt-5">
        <div className="w-full pr-10">
          <Flex justify="between" align="center">
            <h1 className="text-2xl font-bold">WEBCAM FEED</h1>
            <Select.Root
              defaultValue="webcam-feed"
              onValueChange={handleFeedChange}
            >
              <Select.Trigger />
              <Select.Content>
                {feedOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>

          {selectedFeed === "webcam-feed" ? (
            <WebcamScanFeed
              isEnabled={isWebcamEnabled}
              onCapture={handleImageCapture}
            />
          ) : (
            <QrScanFeed
              isEnabled={isWebcamEnabled}
              onStudentScanned={handleStudentScanned}
            />
          )}
        </div>
        <div className="w-full border-l border-gray-300 pl-10">
          {isFetchingStudent ? (
            <SectionLoader />
          ) : (
            <StudentDataBanner
              student={scannedStudent}
              onReset={handleResetScanned}
              attendanceStatus={attendanceStatus || undefined}
            />
          )}
        </div>
      </Flex>
    </div>
  );
};
