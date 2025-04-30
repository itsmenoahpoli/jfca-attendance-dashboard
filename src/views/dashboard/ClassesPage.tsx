import React from "react";
import { Button, Dialog, Flex, TextField, Select } from "@radix-ui/themes";
import { Clock, Trash2, PenSquare, Plus, Users } from "lucide-react";

type Class = {
  id: string;
  className: string;
  yearLevel: string;
  adviserName: string;
  status: "Active" | "Inactive";
  lastUpdated: Date;
  dateCreated: Date;
};

const DUMMY_DATA: Class[] = Array.from({ length: 10 }, (_, i) => ({
  id: `class-${i + 1}`,
  className: `Grade ${Math.floor(Math.random() * 3) + 10}-${String.fromCharCode(
    65 + (i % 3)
  )}`,
  yearLevel: `Grade ${Math.floor(Math.random() * 3) + 10}`,
  adviserName: ["John Smith", "Mary Johnson", "Robert Wilson"][i % 3],
  status: i % 3 === 0 ? "Inactive" : "Active",
  lastUpdated: new Date(),
  dateCreated: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
}));

const ClassesTable: React.FC<{ data: Class[] }> = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg">
      <thead className="bg-gray-50">
        <tr>
          {[
            "Class Name",
            "Year Level",
            "Adviser Name",
            "Status",
            "Last Updated",
            "Date Created",
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
              {item.className}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.yearLevel}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {item.adviserName}
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
              {item.lastUpdated.toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.dateCreated.toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Flex gap="2">
                <Button variant="soft" color="blue" size="1">
                  <Users size={14} />
                </Button>
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
    <TextField.Root size="2" placeholder="Search class name..." />
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
      <Select.Trigger placeholder="Status" />
      <Select.Content>
        <Select.Item value="all">All Status</Select.Item>
        <Select.Item value="active">Active</Select.Item>
        <Select.Item value="inactive">Inactive</Select.Item>
      </Select.Content>
    </Select.Root>
  </Flex>
);

const AddClassDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content className="max-w-md">
      <Dialog.Title>Add New Class/Section</Dialog.Title>
      <Flex direction="column" gap="3" className="mt-4">
        <TextField.Root placeholder="Class Name" />
        <Select.Root defaultValue="">
          <Select.Trigger placeholder="Year Level" />
          <Select.Content>
            <Select.Item value="10">Grade 10</Select.Item>
            <Select.Item value="11">Grade 11</Select.Item>
            <Select.Item value="12">Grade 12</Select.Item>
          </Select.Content>
        </Select.Root>
        <TextField.Root placeholder="Adviser Name" />
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
        <Button color="green">Save Class</Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
);

export const ClassesPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="h-full w-full p-4">
      <h1 className="text-2xl font-bold mb-6">Classes/Sections Management</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Flex justify="between" align="center" mb="4">
          <Filters />
          <Button color="green" onClick={() => setDialogOpen(true)}>
            <Plus size={16} /> Add Class/Section
          </Button>
        </Flex>

        <ClassesTable data={DUMMY_DATA} />

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

      <AddClassDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};
