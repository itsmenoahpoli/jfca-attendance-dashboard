import React from "react";
import { Flex, TextField, Select, Button } from "@radix-ui/themes";
import { X, FilterX } from "lucide-react";
import { gradeLevels } from "@/constants/year-levels.constant";

interface AttendanceLogFiltersProps {
  onFilterChange: (filters: {
    search: string;
    yearLevel: string;
    section: string;
    status: string;
  }) => void;
}

export const AttendanceLogFilters: React.FC<AttendanceLogFiltersProps> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = React.useState({
    search: "",
    yearLevel: "all",
    section: "all",
    status: "all",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      search: "",
      yearLevel: "all",
      section: "all",
      status: "all",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const getFilterLabel = (key: keyof typeof filters, value: string) => {
    if (value === "all" || value === "") return "";

    switch (key) {
      case "yearLevel":
        return value;
      case "section":
        return `Grade ${value.slice(0, 2)}-${value.slice(2).toUpperCase()}`;
      case "status":
        return value.charAt(0).toUpperCase() + value.slice(1);
      case "search":
        return `Search: ${value}`;
      default:
        return value;
    }
  };

  const activeFilters = Object.entries(filters)
    .filter(([, value]) => value !== "all" && value !== "")
    .map(([key, value]) => ({
      key: key as keyof typeof filters,
      value,
      label: getFilterLabel(key as keyof typeof filters, value),
    }));

  return (
    <div className="space-y-2">
      <Flex gap="3" align="center">
        <TextField.Root
          size="2"
          placeholder="Search student name..."
          style={{ width: "200px" }}
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        <Select.Root
          value={filters.yearLevel}
          onValueChange={(value) => handleFilterChange("yearLevel", value)}
          size="2"
        >
          <Select.Trigger placeholder="Year Level" style={{ width: "200px" }} />
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
          value={filters.section}
          onValueChange={(value) => handleFilterChange("section", value)}
          size="2"
        >
          <Select.Trigger
            placeholder="Class/Section"
            style={{ width: "200px" }}
          />
          <Select.Content>
            <Select.Item value="all">All Classes</Select.Item>
            <Select.Item value="10a">Grade 10-A</Select.Item>
            <Select.Item value="10b">Grade 10-B</Select.Item>
            <Select.Item value="11a">Grade 11-A</Select.Item>
            <Select.Item value="11b">Grade 11-B</Select.Item>
            <Select.Item value="12a">Grade 12-A</Select.Item>
            <Select.Item value="12b">Grade 12-B</Select.Item>
          </Select.Content>
        </Select.Root>
        <Select.Root
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
          size="2"
        >
          <Select.Trigger placeholder="Status" style={{ width: "200px" }} />
          <Select.Content>
            <Select.Item value="all">All Status</Select.Item>
            <Select.Item value="present">Present</Select.Item>
            <Select.Item value="late">Late</Select.Item>
            <Select.Item value="absent">Absent</Select.Item>
          </Select.Content>
        </Select.Root>
        {activeFilters.length > 0 && (
          <Button
            variant="soft"
            color="gray"
            onClick={handleClearFilters}
            className="flex items-center gap-1"
          >
            <FilterX size={16} />
            Clear Filters
          </Button>
        )}
      </Flex>

      {activeFilters.length > 0 && (
        <Flex gap="2" wrap="wrap">
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              <span>{filter.label}</span>
              <button
                onClick={() =>
                  handleFilterChange(
                    filter.key,
                    filter.key === "search" ? "" : "all"
                  )
                }
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </Flex>
      )}
    </div>
  );
};
