import React from "react";
import { Button, Dialog, Flex, TextField, Select } from "@radix-ui/themes";
import Webcam from "react-webcam";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertTriangle, Webcam as WebcamIcon } from "lucide-react";
import { type Student } from "@/services/students.service";
import { type Section } from "@/services/sections.service";
import { useSectionsService } from "@/services/sections.service";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.string().min(1, "Gender is required"),
  contact: z.string().min(1, "Contact number is required"),
  guardian_name: z.string().min(1, "Guardian name is required"),
  guardian_relation: z.string().min(1, "Guardian relation is required"),
  guardian_mobile_number: z.string().min(1, "Guardian contact is required"),
  section: z.string().min(1, "Section is required"),
  leftSideImage: z.string().optional(),
  frontSideImage: z.string().optional(),
  rightSideImage: z.string().optional(),
});

export type StudentProfileFormData = z.infer<typeof formSchema>;

type StudentProfileFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StudentProfileFormData) => void;
  initialData?: Partial<Student>;
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
  guardian_relation: "",
  guardian_mobile_number: "",
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
  const sectionsService = useSectionsService();
  const { data: sections = [] } = useQuery({
    queryKey: ["sections"],
    queryFn: sectionsService.getSections,
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudentProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initStudentState,
      section: section?.id || "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  React.useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name || "");
      setValue("email", initialData.email || "");
      setValue("gender", initialData.gender || "");
      setValue("contact", initialData.contact || "");
      setValue("guardian_name", initialData.guardian_name || "");
      setValue("guardian_relation", "parent");
      setValue(
        "guardian_mobile_number",
        initialData.guardian_mobile_number || ""
      );
      setValue("section", section?.id || initialData.section_id || "");

      if (
        initialData.images?.facefront ||
        initialData.images?.faceleft ||
        initialData.images?.faceright
      ) {
        setValue("leftSideImage", initialData.images.faceleft || "");
        setValue("frontSideImage", initialData.images.facefront || "");
        setValue("rightSideImage", initialData.images.faceright || "");
        setShowWebcam(false);
      } else {
        setValue("leftSideImage", "");
        setValue("frontSideImage", "");
        setValue("rightSideImage", "");
        setShowWebcam(true);
        setCurrentCapture("front");
      }
    }
  }, [initialData, setValue, section?.id]);

  const leftSideImage = watch("leftSideImage");
  const frontSideImage = watch("frontSideImage");
  const rightSideImage = watch("rightSideImage");
  const [showWebcam, setShowWebcam] = React.useState(true);

  React.useEffect(() => {
    if (leftSideImage && frontSideImage && rightSideImage) {
      setShowWebcam(false);
    }
  }, [leftSideImage, frontSideImage, rightSideImage]);

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
        if (currentCapture === "front") {
          setCurrentCapture("right");
        } else if (currentCapture === "right") {
          setCurrentCapture("left");
        } else if (currentCapture === "left") {
          setShowWebcam(false);
        }
      }
    }
  };

  const resetForm = () => {
    setValue("name", "");
    setValue("email", "");
    setValue("gender", "");
    setValue("contact", "");
    setValue("guardian_name", "");
    setValue("guardian_relation", "");
    setValue("guardian_mobile_number", "");
    setValue("section", "");
    setValue("leftSideImage", "");
    setValue("frontSideImage", "");
    setValue("rightSideImage", "");
    setCurrentCapture("front");
    setShowWebcam(true);
    setWebcamError(null);
  };

  const onFormSubmit = (data: StudentProfileFormData) => {
    onSubmit(data);
    if (!initialData) {
      resetForm();
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleDialogClose}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description className="text-gray-500 mb-4">
          Fill in the student's information. Photo capture is optional.
        </Dialog.Description>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Flex direction="column" gap="4" className="mt-4">
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
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">
                      Student Photos (Optional)
                    </h3>
                    <Button
                      onClick={() => {
                        setValue("leftSideImage", "");
                        setValue("frontSideImage", "");
                        setValue("rightSideImage", "");
                        setCurrentCapture("front");
                        setShowWebcam(true);
                      }}
                      variant="soft"
                      color="gray"
                      size="1"
                    >
                      Reset Photos
                    </Button>
                  </div>
                  {showWebcam ? (
                    <>
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full rounded-lg"
                        onUserMediaError={handleWebcamError}
                      />
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
                    </>
                  ) : (
                    <Flex justify="center" mt="2" mb="4">
                      <Button
                        onClick={() => setShowWebcam(true)}
                        type="button"
                        color="blue"
                      >
                        <WebcamIcon className="w-4 h-4 mr-2" />
                        Open Camera
                      </Button>
                    </Flex>
                  )}
                  <Flex gap="1" mt="2" justify="center">
                    <div className="relative w-16 h-16 border border-gray-200 rounded overflow-hidden">
                      {leftSideImage ? (
                        <img
                          src={leftSideImage}
                          alt="Left side"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <span className="text-[10px] text-gray-400">
                            Left
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="relative w-16 h-16 border border-gray-200 rounded overflow-hidden">
                      {frontSideImage ? (
                        <img
                          src={frontSideImage}
                          alt="Front side"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <span className="text-[10px] text-gray-400">
                            Front
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="relative w-16 h-16 border border-gray-200 rounded overflow-hidden">
                      {rightSideImage ? (
                        <img
                          src={rightSideImage}
                          alt="Right side"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <span className="text-[10px] text-gray-400">
                            Right
                          </span>
                        </div>
                      )}
                    </div>
                  </Flex>
                </>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Student Name
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField.Root
                    type="text"
                    placeholder="Enter student name"
                    {...field}
                  ></TextField.Root>
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField.Root
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger
                      placeholder="Select gender"
                      className="!w-full"
                    />
                    <Select.Content>
                      <Select.Item value="male">Male</Select.Item>
                      <Select.Item value="female">Female</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Section
              </label>
              <Controller
                name="section"
                control={control}
                render={({ field }) =>
                  section ? (
                    <TextField.Root type="text" value={section.name} disabled />
                  ) : (
                    <Select.Root
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger
                        placeholder="Select section"
                        className="!w-full"
                      />
                      <Select.Content>
                        {sections.map((section) => (
                          <Select.Item key={section.id} value={section.id}>
                            {section.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  )
                }
              />
              {!section && errors.section && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.section.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <TextField.Root
                    type="text"
                    placeholder="Enter contact number"
                    {...field}
                  />
                )}
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contact.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Guardian Name
              </label>
              <Controller
                name="guardian_name"
                control={control}
                render={({ field }) => (
                  <TextField.Root
                    type="text"
                    placeholder="Enter guardian name"
                    {...field}
                  />
                )}
              />
              {errors.guardian_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.guardian_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Guardian Relation
              </label>
              <Controller
                name="guardian_relation"
                control={control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger
                      placeholder="Select relation"
                      className="!w-full"
                    />
                    <Select.Content>
                      <Select.Item value="parent">Parent</Select.Item>
                      <Select.Item value="sibling">Sibling</Select.Item>
                      <Select.Item value="grandparent">Grandparent</Select.Item>
                      <Select.Item value="aunt_uncle">Aunt/Uncle</Select.Item>
                      <Select.Item value="other">Other</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {errors.guardian_relation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.guardian_relation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Guardian Contact Number
              </label>
              <Controller
                name="guardian_mobile_number"
                control={control}
                render={({ field }) => (
                  <TextField.Root
                    type="text"
                    placeholder="Enter guardian contact number"
                    {...field}
                  />
                )}
              />
              {errors.guardian_mobile_number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.guardian_mobile_number.message}
                </p>
              )}
            </div>
          </Flex>
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" color="blue" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : submitButtonText}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
