import React from "react";
import { Flex, TextField, Select, Badge } from "@radix-ui/themes";
import { X } from "lucide-react";
import { gradeLevels } from "@/constants/year-levels.constant";

interface ClassFiltersProps {
  onFiltersChange: (filters: ClassFilters) => void;
}

export interface ClassFilters {
  search: string;
  level: string;
  status: string;
}

export const ClassFilters: React.FC<ClassFiltersProps> = ({
  onFiltersChange,
}) => {
  const [filters, setFilters] = React.useState<ClassFilters>({
    search: "",
    level: "all",
    status: "all",
  });

  const handleFilterChange = (key: keyof ClassFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilter = (key: keyof ClassFilters) => {
    const newFilters = { ...filters, [key]: key === "search" ? "" : "all" };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== "all"
  );

  return (
    <div className="space-y-4">
      <Flex gap="3">
        <TextField.Root
          size="2"
          placeholder="Search class name..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="!w-[200px]"
        />
        <Select.Root
          value={filters.level}
          onValueChange={(value) => handleFilterChange("level", value)}
          size="2"
        >
          <Select.Trigger placeholder="Year Level" className="!w-[200px]" />
          <Select.Content>
            <Select.Item value="all">All Year Levels</Select.Item>
            {gradeLevels.map((level) => (
              <Select.Item key={level} value={level}>
                {level}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Select.Root
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
          size="2"
        >
          <Select.Trigger placeholder="Status" className="!w-[200px]" />
          <Select.Content>
            <Select.Item value="all">All Status</Select.Item>
            <Select.Item value="active">Active</Select.Item>
            <Select.Item value="inactive">Inactive</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      {hasActiveFilters && (
        <Flex gap="2" wrap="wrap">
          {filters.search && (
            <Badge color="blue" variant="soft">
              Search: {filters.search}
              <button
                onClick={() => clearFilter("search")}
                className="ml-1 hover:text-blue-700"
              >
                <X size={14} />
              </button>
            </Badge>
          )}
          {filters.level !== "all" && (
            <Badge color="violet" variant="soft">
              Level: {filters.level}
              <button
                onClick={() => clearFilter("level")}
                className="ml-1 hover:text-violet-700"
              >
                <X size={14} />
              </button>
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge color="amber" variant="soft">
              Status: {filters.status}
              <button
                onClick={() => clearFilter("status")}
                className="ml-1 hover:text-amber-700"
              >
                <X size={14} />
              </button>
            </Badge>
          )}
        </Flex>
      )}
    </div>
  );
};
