import React from "react";
import { Flex, Select } from "@radix-ui/themes";
import { WebcamScanFeed } from "./WebcamScanFeed";
import { QrScanFeed } from "./QrScanFeed";

const feedOptions = [
  {
    label: "Webcam Feed",
    value: "webcam-feed",
  },
  {
    label: "QR Code Scan Feed",
    value: "qr-scan-feed",
  },
];

export const AttendanceCounterModule: React.FC = () => {
  const [selectedFeed, setSelectedFeed] = React.useState<string>("webcam-feed");

  const handleFeedChange = (value: string) => {
    setSelectedFeed(value);
  };

  return (
    <div className="w-full h-full p-10">
      <Flex>
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
                  <Select.Item value={option.value}>{option.label}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>

          {selectedFeed === "webcam-feed" ? <WebcamScanFeed /> : <QrScanFeed />}
        </div>
        <div className="w-full border-l border-gray-300 pl-10">
          <h1 className="text-2xl font-bold">STUDENT DATA</h1>
          <Flex justify="center" align="center" className="h-full">
            <p>No data available</p>
          </Flex>
        </div>
      </Flex>
    </div>
  );
};
