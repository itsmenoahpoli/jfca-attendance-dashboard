import React from "react";
import { Button, Dialog, Flex, TextField, Select } from "@radix-ui/themes";
import { type Section } from "@/services/sections.service";
import { gradeLevels } from "@/constants/year-levels.constant";

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Section, "id">) => void;
  initialData?: Section;
}

export const ClassFormDialog: React.FC<ClassFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = React.useState<Omit<Section, "id">>({
    name: initialData?.name || "",
    level: initialData?.level || "",
    school_year: initialData?.school_year || "",
    is_enabled: initialData?.is_enabled ?? true,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        level: initialData.level,
        school_year: initialData.school_year,
        is_enabled: initialData.is_enabled,
      });
    } else {
      setFormData({
        name: "",
        level: "",
        school_year: "",
        is_enabled: true,
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        name: "",
        level: "",
        school_year: "",
        is_enabled: true,
      });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Title>
          {initialData ? "Edit Class/Section" : "Add New Class/Section"}
        </Dialog.Title>
        <Dialog.Description className="text-gray-500 mb-4">
          {initialData
            ? "Update the details of this class/section."
            : "Fill in the details to create a new class/section."}
        </Dialog.Description>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3" className="mt-4">
            <TextField.Root
              placeholder="Class Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Select.Root
              value={formData.level}
              onValueChange={(value) =>
                setFormData({ ...formData, level: value })
              }
            >
              <Select.Trigger placeholder="Year Level" />
              <Select.Content>
                {gradeLevels.map((level) => (
                  <Select.Item key={level} value={level}>
                    {level}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <TextField.Root
              placeholder="School Year"
              value={formData.school_year}
              onChange={(e) =>
                setFormData({ ...formData, school_year: e.target.value })
              }
            />
            <Select.Root
              value={formData.is_enabled ? "active" : "inactive"}
              onValueChange={(value) =>
                setFormData({ ...formData, is_enabled: value === "active" })
              }
            >
              <Select.Trigger placeholder="Status" />
              <Select.Content>
                <Select.Item value="active">Active</Select.Item>
                <Select.Item value="inactive">Inactive</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" color="green">
              {initialData ? "Update Class" : "Save Class"}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
