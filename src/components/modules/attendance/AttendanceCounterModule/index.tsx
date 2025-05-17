import React from "react";
import { Link } from "react-router-dom";
import { Flex, Select, Button } from "@radix-ui/themes";
import { WebcamScanFeed } from "./WebcamScanFeed";
import { QrScanFeed } from "./QrScanFeed";
import { type Student } from "@/services/students.service";

interface AttendanceCounterModuleProps {
  isWebcamEnabled: boolean;
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

const StudentDataBanner: React.FC<{ student: Student | null }> = ({
  student,
}) => {
  return (
    <Flex className="h-full" direction="column">
      <h1 className="text-2xl font-bold">STUDENT DATA</h1>
      {student ? (
        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Flex direction="column" gap="6">
            <Flex justify="center">
              {student.images?.facefront ? (
                <img
                  src={student.images.facefront}
                  alt={student.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl text-gray-500">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </Flex>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-lg">{student.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium">{student.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{student.contact || "-"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Section</p>
                <p className="font-medium">{student.section?.name || "-"}</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Guardian Information
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">
                      {student.guardian_name || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">
                      {student.guardian_mobile_number || "-"}
                    </p>
                  </div>
                </div>
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

export const AttendanceCounterModule: React.FC<
  AttendanceCounterModuleProps
> = ({ isWebcamEnabled }) => {
  const [selectedFeed, setSelectedFeed] = React.useState<string>("webcam-feed");
  const [isLoading, setIsLoading] = React.useState(true);
  const [scannedStudent, setScannedStudent] = React.useState<Student | null>(
    null
  );

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleFeedChange = (value: string) => {
    setSelectedFeed(value);
  };

  const handleStudentScanned = (student: Student | null) => {
    setScannedStudent(student);
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
            <WebcamScanFeed isEnabled={isWebcamEnabled} />
          ) : (
            <QrScanFeed
              isEnabled={isWebcamEnabled}
              onStudentScanned={handleStudentScanned}
            />
          )}
        </div>
        <div className="w-full border-l border-gray-300 pl-10">
          <StudentDataBanner student={scannedStudent} />
        </div>
      </Flex>
    </div>
  );
};
