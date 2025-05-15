import React from "react";
import { Link } from "react-router-dom";
import { Flex, Select, Button } from "@radix-ui/themes";
import { WebcamScanFeed } from "./WebcamScanFeed";
import { QrScanFeed } from "./QrScanFeed";

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

const NoStudentDetectedBanner = () => {
  return (
    <Flex className="h-full" direction="column">
      <h1 className="text-2xl font-bold">STUDENT DATA</h1>
      <Flex justify="center" align="center" className="h-full">
        <p>No data available</p>
      </Flex>
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

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleFeedChange = (value: string) => {
    setSelectedFeed(value);
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
            <QrScanFeed isEnabled={isWebcamEnabled} />
          )}
        </div>
        <div className="w-full border-l border-gray-300 pl-10">
          <NoStudentDetectedBanner />
        </div>
      </Flex>
    </div>
  );
};
