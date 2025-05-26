import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button, Switch } from "@radix-ui/themes";
import * as faceapi from "face-api.js";
import { useAttendanceService } from "@/services/attendance.service";
import { type Student, useStudentsService } from "@/services/students.service";

interface WebcamScanFeedProps {
  isEnabled: boolean;
  autoCapture?: boolean;
  onCapture?: (image: string) => void;
  onStudentScanned?: (
    student: Student | null,
    status?: { in_status: boolean; out_status: boolean }
  ) => void;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export const WebcamScanFeed: React.FC<WebcamScanFeedProps> = ({
  isEnabled,
  autoCapture: initialAutoCapture = false,
  onCapture,
  onStudentScanned,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isFaceDetected, setIsFaceDetected] = React.useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [autoCapture, setAutoCapture] = useState(initialAutoCapture);
  const [isFetchingStudent, setIsFetchingStudent] = useState(false);
  const hasStartedCountdown = useRef(false);
  const isDetecting = useRef(true);
  const detectionFrameId = useRef<number>();
  const isCapturing = useRef(false);
  const { recognizeFace, timeInOut } = useAttendanceService();
  const { getStudent } = useStudentsService();

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

      if (
        hasFace &&
        countdown === null &&
        !hasStartedCountdown.current &&
        autoCapture
      ) {
        hasStartedCountdown.current = true;
        setCountdown(2);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    if (
      autoCapture &&
      isFaceDetected &&
      countdown === null &&
      !hasStartedCountdown.current &&
      !capturedImage
    ) {
      hasStartedCountdown.current = true;
      setCountdown(2);
    }
  }, [autoCapture, isFaceDetected, countdown, capturedImage]);

  const capture = React.useCallback(() => {
    if (!webcamRef.current) return;

    isCapturing.current = true;
    if (detectionFrameId.current) {
      cancelAnimationFrame(detectionFrameId.current);
    }
    isDetecting.current = false;

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setCountdown(null);
      setIsFetchingStudent(true);
      onCapture?.(imageSrc);
      handlePhotoCapture(imageSrc);
    }
  }, [onCapture]);

  const resetCapture = () => {
    setCapturedImage(null);
    setCountdown(null);
    hasStartedCountdown.current = false;
    setIsFaceDetected(false);
    isCapturing.current = false;
    isDetecting.current = true;
    setIsFetchingStudent(false);
    detectFaces();
  };

  const handlePhotoCapture = async (base64Image: string) => {
    try {
      const result = await recognizeFace(base64Image);

      if (result?.student_id) {
        const studentData = await getStudent(result.student_id);
        const attendanceLog = await timeInOut(result.student_id);
        onStudentScanned?.(studentData, {
          in_status: attendanceLog.in_status,
          out_status: attendanceLog.out_status,
        });
      } else {
        onStudentScanned?.(null);
      }
    } catch (error) {
      console.log(error);
      onStudentScanned?.(null);
    } finally {
      setIsFetchingStudent(false);
    }
  };

  return (
    <div className="w-full h-full p-10">
      <div className="my-3 relative bg-white rounded-lg shadow-sm">
        {isEnabled ? (
          <>
            <div className="relative">
              <div className="absolute top-0 left-0 w-full p-2 z-10">
                <div className="flex justify-between items-center mb-2">
                  <div
                    className={`text-center p-2 rounded-md ${
                      isFaceDetected
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isFetchingStudent
                      ? "Fetching student information..."
                      : capturedImage
                      ? "Photo Captured"
                      : isFaceDetected
                      ? countdown !== null
                        ? `Capturing in ${countdown} seconds...`
                        : "Face Detected"
                      : "No Face Detected"}
                  </div>
                  <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-md shadow-sm">
                    <label className="text-sm text-gray-600">
                      Auto Capture
                    </label>
                    <Switch
                      checked={autoCapture}
                      onCheckedChange={setAutoCapture}
                    />
                  </div>
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
                <>
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={1280}
                    videoConstraints={videoConstraints}
                    className="w-full"
                  />
                  {countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-gray-200"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-white"
                            strokeWidth="8"
                            strokeDasharray={251.2}
                            strokeDashoffset={
                              251.2 - (251.2 * (2 - countdown)) / 2
                            }
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-8xl font-bold">
                            {countdown}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 1 }}
                  />
                </>
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
