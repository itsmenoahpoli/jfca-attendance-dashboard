import React from "react";
import { Dialog, Flex, Select, TextField } from "@radix-ui/themes";
import { Calendar } from "lucide-react";
import { type Student } from "@/services/students.service";

interface StudentAttendanceLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | undefined;
}

export const StudentAttendanceLogsDialog: React.FC<
  StudentAttendanceLogsDialogProps
> = ({ open, onOpenChange, student }) => {
  const [filters, setFilters] = React.useState({
    startDate: "",
    endDate: "",
    type: "all",
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="!w-[90vw] !max-w-[90vw]">
        <Dialog.Title>Attendance Logs - {student?.name}</Dialog.Title>
        <Dialog.Description className="text-gray-500 mb-4">
          View attendance logs for this student.
        </Dialog.Description>

        <div className="mt-4">
          <Flex gap="3" mb="4">
            <TextField.Root size="2">
              <TextField.Slot>
                <Calendar size={16} />
              </TextField.Slot>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </TextField.Root>
            <TextField.Root size="2">
              <TextField.Slot>
                <Calendar size={16} />
              </TextField.Slot>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </TextField.Root>
            <Select.Root
              value={filters.type}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value }))
              }
              size="2"
            >
              <Select.Trigger placeholder="Type" />
              <Select.Content>
                <Select.Item value="all">All Types</Select.Item>
                <Select.Item value="time-in">Time In</Select.Item>
                <Select.Item value="time-out">Time Out</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="p-4 bg-gray-50 rounded-lg inline-block">
                <p className="text-gray-500">No attendance logs found</p>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
