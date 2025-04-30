import React from "react";
import { Button, Dialog, Flex, TextField, Select } from "@radix-ui/themes";
import { Clock, Trash2, PenSquare, Plus } from "lucide-react";

type Student = {
  id: string;
  fullName: string;
  yearLevel: string;
  assignedClass: string;
  status: "Active" | "Inactive";
};

const DUMMY_DATA: Student[] = Array.from({ length: 10 }, (_, i) => ({
  id: `student-${i + 1}`,
  fullName: [
    "John Smith",
    "Maria Garcia",
    "James Johnson",
    "Patricia Lee",
    "Robert Wilson",
    "Linda Anderson",
    "Michael Brown",
    "Elizabeth Taylor",
    "William Davis",
    "Jennifer Martinez",
  ][i],
  yearLevel: `Grade ${Math.floor(Math.random() * 3) + 10}`,
  assignedClass: `Grade ${
    Math.floor(Math.random() * 3) + 10
  }-${String.fromCharCode(65 + (i % 3))}`,
  status: i % 3 === 0 ? "Inactive" : "Active",
}));

const StudentsTable: React.FC<{ data: Student[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg">
      <thead className="bg-gray-50">
        <tr>
          {[
            "Full Name",
            "Year Level",
            "Assigned Class/Section",
            "Status",
            "Actions",
          ].map((header) => (
            <th
              key={header}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {item.fullName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.yearLevel}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.assignedClass}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Flex gap="2">
                <Button variant="soft" color="violet" size="1">
                  <Clock size={14} />
                </Button>
                <Button variant="soft" color="amber" size="1">
                  <PenSquare size={14} />
                </Button>
                <Button variant="soft" color="red" size="1">
                  <Trash2 size={14} />
                </Button>
              </Flex>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Filters: React.FC = () => (
  <Flex gap="3">
    <TextField.Root size="2" placeholder="Search student name..." />
    <Select.Root defaultValue="all" size="2">
      <Select.Trigger placeholder="Year Level" />
      <Select.Content>
        <Select.Item value="all">All Year Levels</Select.Item>
        <Select.Item value="10">Grade 10</Select.Item>
        <Select.Item value="11">Grade 11</Select.Item>
        <Select.Item value="12">Grade 12</Select.Item>
      </Select.Content>
    </Select.Root>
    <Select.Root defaultValue="all" size="2">
      <Select.Trigger placeholder="Class/Section" />
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
    <Select.Root defaultValue="all" size="2">
      <Select.Trigger placeholder="Status" />
      <Select.Content>
        <Select.Item value="all">All Status</Select.Item>
        <Select.Item value="active">Active</Select.Item>
        <Select.Item value="inactive">Inactive</Select.Item>
      </Select.Content>
    </Select.Root>
  </Flex>
);

const AddStudentDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content className="max-w-md">
      <Dialog.Title>Add New Student</Dialog.Title>
      <Flex direction="column" gap="3" className="mt-4">
        <TextField.Root placeholder="Full Name" />
        <Select.Root defaultValue="">
          <Select.Trigger placeholder="Year Level" />
          <Select.Content>
            <Select.Item value="10">Grade 10</Select.Item>
            <Select.Item value="11">Grade 11</Select.Item>
            <Select.Item value="12">Grade 12</Select.Item>
          </Select.Content>
        </Select.Root>
        <Select.Root defaultValue="">
          <Select.Trigger placeholder="Assign to Class/Section" />
          <Select.Content>
            <Select.Item value="10a">Grade 10-A</Select.Item>
            <Select.Item value="10b">Grade 10-B</Select.Item>
            <Select.Item value="11a">Grade 11-A</Select.Item>
            <Select.Item value="11b">Grade 11-B</Select.Item>
            <Select.Item value="12a">Grade 12-A</Select.Item>
            <Select.Item value="12b">Grade 12-B</Select.Item>
          </Select.Content>
        </Select.Root>
        <Select.Root defaultValue="active">
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
        <Button color="green">Save Student</Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
);

export const StudentsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="h-full w-full p-4">
      <h1 className="text-2xl font-bold mb-6">Students Management</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Flex justify="between" align="center" mb="4">
          <Filters />
          <Button color="green" onClick={() => setDialogOpen(true)}>
            <Plus size={16} /> Add Student
          </Button>
        </Flex>

        <StudentsTable data={DUMMY_DATA} />

        <Flex justify="between" align="center" mt="4">
          <div className="text-sm text-gray-500">
            Showing 1 to 10 of 20 entries
          </div>
          <Flex gap="2">
            <Button variant="soft" color="gray" disabled>
              Previous
            </Button>
            <Button variant="soft" color="gray">
              1
            </Button>
            <Button variant="soft" color="gray">
              2
            </Button>
            <Button variant="soft" color="gray">
              Next
            </Button>
          </Flex>
        </Flex>
      </div>

      <AddStudentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};
