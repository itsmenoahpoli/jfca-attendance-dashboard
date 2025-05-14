import React from "react";
import { Button, Dialog, Flex, TextField, Select } from "@radix-ui/themes";
import Webcam from "react-webcam";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type Section } from "@/services/sections.service";
import { AlertTriangle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.string().min(1, "Gender is required"),
  contact: z.string().min(1, "Contact number is required"),
  guardian_name: z.string().min(1, "Guardian name is required"),
  guardian_contact: z.string().min(1, "Guardian contact is required"),
  section: z.string().min(1, "Section is required"),
  leftSideImage: z.string().min(1, "Left side image is required"),
  frontSideImage: z.string().min(1, "Front side image is required"),
  rightSideImage: z.string().min(1, "Right side image is required"),
});

export type StudentProfileFormData = z.infer<typeof formSchema>;

type StudentProfileFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StudentProfileFormData) => void;
  initialData?: Partial<StudentProfileFormData>;
  title?: string;
  submitButtonText?: string;
  section?: Section;
};

const initStudentState: StudentProfileFormData = {
  name: "",
  email: "",
  gender: "",
  contact: "",
  guardian_name: "",
  guardian_contact: "",
  section: "",
  leftSideImage: "",
  frontSideImage: "",
  rightSideImage: "",
};

export const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title = "Add New Student",
  submitButtonText = "Add Student",
  section,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initStudentState,
      ...initialData,
      section: section?.name || initialData?.section || "",
    },
  });

  React.useEffect(() => {
    if (section?.name) {
      setValue("section", section.name);
    }
  }, [section, setValue]);

  const webcamRef = React.useRef<Webcam>(null);
  const [currentCapture, setCurrentCapture] = React.useState<
    "left" | "front" | "right"
  >("front");
  const [webcamError, setWebcamError] = React.useState<string | null>(null);

  const handleWebcamError = () => {
    setWebcamError(
      "No camera hardware detected. Please connect a camera and try again."
    );
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setValue(`${currentCapture}SideImage`, imageSrc);
        if (currentCapture === "left") {
          setCurrentCapture("front");
        } else if (currentCapture === "front") {
          setCurrentCapture("right");
        }
      }
    }
  };

  const onFormSubmit = (data: StudentProfileFormData) => {
    onSubmit(data);
    if (!initialData) {
      setValue("name", "");
      setValue("email", "");
      setValue("gender", "");
      setValue("contact", "");
      setValue("guardian_name", "");
      setValue("guardian_contact", "");
      setValue("section", section?.name || "");
      setValue("leftSideImage", "");
      setValue("frontSideImage", "");
      setValue("rightSideImage", "");
      setCurrentCapture("front");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>{title}</Dialog.Title>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Flex direction="column" gap="3" className="mt-4">
            <div className="mb-4">
              {webcamError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <Flex gap="2" align="center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <p className="text-xs text-red-600">{webcamError}</p>
                  </Flex>
                </div>
              )}
              {!webcamError && (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-lg"
                  onUserMediaError={handleWebcamError}
                />
              )}
              <Flex justify="center" mt="2">
                <Button
                  onClick={captureImage}
                  type="button"
                  disabled={!!webcamError}
                >
                  Capture{" "}
                  {currentCapture.charAt(0).toUpperCase() +
                    currentCapture.slice(1)}{" "}
                  Side
                </Button>
              </Flex>
              {errors.leftSideImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.leftSideImage.message}
                </p>
              )}
              {errors.frontSideImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.frontSideImage.message}
                </p>
              )}
              {errors.rightSideImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.rightSideImage.message}
                </p>
              )}
            </div>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField.Root>
                  <TextField.Slot>
                    <input placeholder="Student Name" {...field} />
                  </TextField.Slot>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </TextField.Root>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField.Root>
                  <TextField.Slot>
                    <input
                      placeholder="Email Address"
                      type="email"
                      {...field}
                    />
                  </TextField.Slot>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </TextField.Root>
              )}
            />

            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select.Root value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger placeholder="Gender" />
                  <Select.Content>
                    <Select.Item value="male">Male</Select.Item>
                    <Select.Item value="female">Female</Select.Item>
                  </Select.Content>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.gender.message}
                    </p>
                  )}
                </Select.Root>
              )}
            />

            <Controller
              name="section"
              control={control}
              render={({ field }) => (
                <Select.Root value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger placeholder="Select Section" />
                  <Select.Content>
                    <Select.Item value={section?.name || ""}>
                      {section?.name || ""}
                    </Select.Item>
                  </Select.Content>
                  {errors.section && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.section.message}
                    </p>
                  )}
                </Select.Root>
              )}
            />

            <Controller
              name="contact"
              control={control}
              render={({ field }) => (
                <TextField.Root>
                  <TextField.Slot>
                    <input placeholder="Contact Number" {...field} />
                  </TextField.Slot>
                  {errors.contact && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contact.message}
                    </p>
                  )}
                </TextField.Root>
              )}
            />

            <Controller
              name="guardian_name"
              control={control}
              render={({ field }) => (
                <TextField.Root>
                  <TextField.Slot>
                    <input placeholder="Guardian Name" {...field} />
                  </TextField.Slot>
                  {errors.guardian_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.guardian_name.message}
                    </p>
                  )}
                </TextField.Root>
              )}
            />

            <Controller
              name="guardian_contact"
              control={control}
              render={({ field }) => (
                <TextField.Root>
                  <TextField.Slot>
                    <input placeholder="Guardian Contact Number" {...field} />
                  </TextField.Slot>
                  {errors.guardian_contact && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.guardian_contact.message}
                    </p>
                  )}
                </TextField.Root>
              )}
            />
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" color="blue">
              {submitButtonText}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
