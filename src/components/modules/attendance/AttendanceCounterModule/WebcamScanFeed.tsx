import React from "react";
import Webcam from "react-webcam";
import { Button } from "@radix-ui/themes";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export const WebcamScanFeed: React.FC = () => {
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    // @ts-ignore
    const imageSrc = webcamRef.current.getScreenshot();

    // base64 captured image value
    console.log(imageSrc);
  }, [webcamRef]);

  return (
    <div className="w-full h-full p-10">
      <div className="my-3">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        />
      </div>
      <Button className="!w-full mt-2" onClick={capture}>
        Trigger Capture
      </Button>
    </div>
  );
};
