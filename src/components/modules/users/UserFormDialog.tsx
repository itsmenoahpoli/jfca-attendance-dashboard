import React from "react";
import { Dialog, Flex, TextField, Select } from "@radix-ui/themes";
import { type User } from "@/services/users.service";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<User, "id">) => void;
  initialData?: User;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = React.useState<Omit<User, "id">>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "",
    is_active: initialData?.is_active ?? true,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        is_active: initialData.is_active,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <Dialog.Title>
              {initialData ? "Edit User" : "Create New User"}
            </Dialog.Title>

            <TextField.Root>
              <TextField.Slot>
                <input
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </TextField.Slot>
            </TextField.Root>

            <TextField.Root>
              <TextField.Slot>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </TextField.Slot>
            </TextField.Root>

            <Select.Root
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <Select.Trigger placeholder="Select role" />
              <Select.Content>
                <Select.Item value="admin">Admin</Select.Item>
                <Select.Item value="teacher">Teacher</Select.Item>
                <Select.Item value="student">Student</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root
              value={formData.is_active ? "active" : "inactive"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  is_active: value === "active",
                })
              }
            >
              <Select.Trigger placeholder="Select status" />
              <Select.Content>
                <Select.Item value="active">Active</Select.Item>
                <Select.Item value="inactive">Inactive</Select.Item>
              </Select.Content>
            </Select.Root>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                {initialData ? "Update" : "Create"}
              </button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
