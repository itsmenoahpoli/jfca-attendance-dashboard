import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@radix-ui/themes";
import * as faceapi from "face-api.js";

interface WebcamScanFeedProps {
  isEnabled: boolean;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export const WebcamScanFeed: React.FC<WebcamScanFeedProps> = ({
  isEnabled,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isFaceDetected, setIsFaceDetected] = React.useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const hasStartedCountdown = useRef(false);
  const isDetecting = useRef(true);
  const detectionFrameId = useRef<number>();
  const isCapturing = useRef(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading face detection models:", error);
        setError(
          "Failed to load face detection models. Please check the console for details."
        );
      }
    };

    loadModels();
  }, []);

  const detectFaces = async () => {
    if (!isDetecting.current || isCapturing.current) return;

    try {
      if (!webcamRef.current || !canvasRef.current) {
        return;
      }

      const video = webcamRef.current.video;
      if (!video) {
        return;
      }

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        detectionFrameId.current = requestAnimationFrame(detectFaces);
        return;
      }

      const canvas = canvasRef.current;
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      canvas.width = displaySize.width;
      canvas.height = displaySize.height;

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const hasFace = detections.length > 0;
      setIsFaceDetected(hasFace);

      if (hasFace && countdown === null && !hasStartedCountdown.current) {
        hasStartedCountdown.current = true;
        setCountdown(5);
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (isDetecting.current && !isCapturing.current) {
        detectionFrameId.current = requestAnimationFrame(detectFaces);
      }
    } catch (error) {
      console.error("Error during face detection:", error);
      setError(
        "Error during face detection. Please check the console for details."
      );
    }
  };

  useEffect(() => {
    if (!isEnabled || !isModelLoaded || !isDetecting.current) return;

    detectFaces();

    return () => {
      if (detectionFrameId.current) {
        cancelAnimationFrame(detectionFrameId.current);
      }
    };
  }, [isEnabled, isModelLoaded, isDetecting.current]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      capture();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const capture = React.useCallback(() => {
    if (!webcamRef.current) return;

    isCapturing.current = true;
    if (detectionFrameId.current) {
      cancelAnimationFrame(detectionFrameId.current);
    }
    isDetecting.current = false;

    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setCountdown(null);
  }, []);

  const resetCapture = () => {
    setCapturedImage(null);
    setCountdown(null);
    hasStartedCountdown.current = false;
    setIsFaceDetected(false);
    isCapturing.current = false;
    isDetecting.current = true;
    detectFaces();
  };

  return (
    <div className="w-full h-full p-10">
      <div className="my-3 relative">
        {isEnabled ? (
          <>
            <div className="relative">
              <div className="absolute top-0 left-0 w-full p-2 z-10">
                <div
                  className={`text-center p-2 rounded-md ${
                    isFaceDetected
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {capturedImage
                    ? "Photo Captured"
                    : isFaceDetected
                    ? countdown !== null
                      ? `Capturing in ${countdown} seconds...`
                      : "Face Detected"
                    : "No Face Detected"}
                </div>
              </div>
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full"
                  style={{ maxHeight: "720px", objectFit: "contain" }}
                />
              ) : (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={1280}
                  videoConstraints={videoConstraints}
                  className="w-full"
                />
              )}
              {!capturedImage && (
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 1 }}
                />
              )}
            </div>
            {error && (
              <div className="absolute top-0 left-0 w-full p-2 bg-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}
            {!isModelLoaded && (
              <div className="absolute top-0 left-0 w-full p-2 bg-yellow-100 text-yellow-700 text-sm">
                Loading face detection models...
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-[720px] bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Webcam is disabled</p>
          </div>
        )}
      </div>
      <Button
        className="!w-full mt-2"
        onClick={capturedImage ? resetCapture : capture}
        disabled={!isEnabled || (capturedImage === null && !isFaceDetected)}
      >
        {capturedImage ? "Take Another Photo" : "Trigger Capture"}
      </Button>
    </div>
  );
};
