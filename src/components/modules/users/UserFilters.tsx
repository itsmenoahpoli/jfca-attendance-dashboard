import React from "react";
import { TextField, Select } from "@radix-ui/themes";

export interface UserFilters {
  search: string;
  role: string;
  status: string;
}

interface UserFiltersProps {
  onFiltersChange: (filters: UserFilters) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  onFiltersChange,
}) => {
  const [filters, setFilters] = React.useState<UserFilters>({
    search: "",
    role: "all",
    status: "all",
  });

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="flex gap-4">
      <TextField.Root>
        <TextField.Slot>
          <input
            placeholder="Search users..."
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFilterChange("search", e.target.value)
            }
          />
        </TextField.Slot>
      </TextField.Root>

      <Select.Root
        value={filters.role}
        onValueChange={(value) => handleFilterChange("role", value)}
      >
        <Select.Trigger placeholder="Filter by role" />
        <Select.Content>
          <Select.Item value="all">All Roles</Select.Item>
          <Select.Item value="admin">Admin</Select.Item>
          <Select.Item value="teacher">Teacher</Select.Item>
          <Select.Item value="student">Student</Select.Item>
        </Select.Content>
      </Select.Root>

      <Select.Root
        value={filters.status}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <Select.Trigger placeholder="Filter by status" />
        <Select.Content>
          <Select.Item value="all">All Status</Select.Item>
          <Select.Item value="active">Active</Select.Item>
          <Select.Item value="inactive">Inactive</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
};
