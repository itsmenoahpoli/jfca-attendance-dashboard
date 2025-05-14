import React from "react";
import { Button, Dialog, Flex, TextField, Select } from "@radix-ui/themes";
import {
  Clock,
  Trash2,
  PenSquare,
  Plus,
  Users,
  AlertTriangle,
  Info,
  Users2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSectionsService, type Section } from "@/services/sections.service";
import {
  StudentProfileForm,
  type StudentProfileFormData,
} from "@/components/modules/students/student-profile-form";

const ClassesTable: React.FC<{
  data: Section[];
  onEdit: (section: Section) => void;
  onDelete: (section: Section) => void;
  onViewStudents: (section: Section) => void;
}> = ({ data, onEdit, onDelete, onViewStudents }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg">
      <thead className="bg-gray-50">
        <tr>
          {["Class Name", "Year Level", "School Year", "Status", "Actions"].map(
            (header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {item.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.level}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {item.school_year}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.is_enabled
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.is_enabled ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Flex gap="2">
                <Button
                  variant="soft"
                  color="blue"
                  size="1"
                  onClick={() => onViewStudents(item)}
                >
                  <Users size={14} />
                </Button>
                <Button variant="soft" color="violet" size="1">
                  <Clock size={14} />
                </Button>
                <Button
                  variant="soft"
                  color="amber"
                  size="1"
                  onClick={() => onEdit(item)}
                >
                  <PenSquare size={14} />
                </Button>
                <Button
                  variant="soft"
                  color="red"
                  size="1"
                  onClick={() => onDelete(item)}
                >
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
  onSubmit: (data: Omit<Section, "id">) => void;
  initialData?: Section;
}> = ({ open, onOpenChange, onSubmit, initialData }) => {
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
      // Reset form data when adding new section
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
                <Select.Item value="Grade 1">Grade 1</Select.Item>
                <Select.Item value="Grade 2">Grade 2</Select.Item>
                <Select.Item value="Grade 3">Grade 3</Select.Item>
                <Select.Item value="Grade 4">Grade 4</Select.Item>
                <Select.Item value="Grade 5">Grade 5</Select.Item>
                <Select.Item value="Grade 6">Grade 6</Select.Item>
                <Select.Item value="Grade 7">Grade 7</Select.Item>
                <Select.Item value="Grade 8">Grade 8</Select.Item>
                <Select.Item value="Grade 9">Grade 9</Select.Item>
                <Select.Item value="Grade 10">Grade 10</Select.Item>
                <Select.Item value="Grade 11">Grade 11</Select.Item>
                <Select.Item value="Grade 12">Grade 12</Select.Item>
                <Select.Item value="1st Year College">
                  1st Year College
                </Select.Item>
                <Select.Item value="2nd Year College">
                  2nd Year College
                </Select.Item>
                <Select.Item value="3rd Year College">
                  3rd Year College
                </Select.Item>
                <Select.Item value="4th Year College">
                  4th Year College
                </Select.Item>
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

const DeleteConfirmationDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  sectionName: string;
}> = ({ open, onOpenChange, onConfirm, sectionName }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content className="max-w-md">
      <Flex direction="column" align="center" gap="3" className="py-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <Dialog.Title className="text-center">Delete Section</Dialog.Title>
        <Dialog.Description className="text-center text-gray-600">
          Are you sure you want to delete the section "{sectionName}"? This
          action cannot be undone.
        </Dialog.Description>
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Button color="red" onClick={onConfirm}>
          Delete Section
        </Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
);

const UpdateConfirmationDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  sectionName: string;
  updatedData: Omit<Section, "id">;
}> = ({ open, onOpenChange, onConfirm, sectionName, updatedData }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content className="max-w-md">
      <Flex direction="column" align="center" gap="3" className="py-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Info className="w-8 h-8 text-blue-600" />
        </div>
        <Dialog.Title className="text-center">Update Section</Dialog.Title>
        <Dialog.Description className="text-center text-gray-600">
          Are you sure you want to update the section "{sectionName}" with the
          following changes?
        </Dialog.Description>
        <div className="w-full mt-2 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div>
              <span className="font-medium">Name:</span> {updatedData.name}
            </div>
            <div>
              <span className="font-medium">Level:</span> {updatedData.level}
            </div>
            <div>
              <span className="font-medium">School Year:</span>{" "}
              {updatedData.school_year}
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              {updatedData.is_enabled ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Button color="blue" onClick={onConfirm}>
          Update Section
        </Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
);

const StudentsListDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionName: string;
  section: Section;
}> = ({ open, onOpenChange, sectionName, section }) => {
  const [addStudentDialogOpen, setAddStudentDialogOpen] = React.useState(false);

  const handleAddStudent = (data: StudentProfileFormData) => {
    // TODO: Implement student creation
    console.log("Add student:", data);
    setAddStudentDialogOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-4xl">
        <Dialog.Title className="flex items-center gap-2">
          <Users2 className="w-5 h-5" />
          Students List - {sectionName}
        </Dialog.Title>
        <Dialog.Description className="text-gray-500 mb-4">
          View and manage students in this section.
        </Dialog.Description>
        <div className="mt-4">
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="p-4 bg-gray-50 rounded-lg inline-block">
                <Users2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No Students Found
                </h3>
                <p className="text-gray-500 mb-4">
                  This section doesn't have any students yet.
                </p>
                <Button
                  color="blue"
                  onClick={() => setAddStudentDialogOpen(true)}
                  className="inline-flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Student
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>

      <StudentProfileForm
        open={addStudentDialogOpen}
        onOpenChange={setAddStudentDialogOpen}
        onSubmit={handleAddStudent}
        section={section}
      />
    </Dialog.Root>
  );
};

export const ClassesPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState<
    Section | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [studentsListOpen, setStudentsListOpen] = React.useState(false);
  const [sectionToDelete, setSectionToDelete] = React.useState<
    Section | undefined
  >();
  const [updatedSectionData, setUpdatedSectionData] = React.useState<
    Omit<Section, "id"> | undefined
  >();
  const queryClient = useQueryClient();
  const sectionsService = useSectionsService();

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["sections"],
    queryFn: sectionsService.getSections,
  });

  const createMutation = useMutation({
    mutationFn: sectionsService.createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      setDialogOpen(false);
      toast.success("Section created successfully");
    },
    onError: () => {
      toast.error("Failed to create section");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Section, "id">>;
    }) => sectionsService.updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      setDialogOpen(false);
      setUpdateDialogOpen(false);
      setSelectedSection(undefined);
      setUpdatedSectionData(undefined);
      toast.success("Section updated successfully");
    },
    onError: () => {
      toast.error("Failed to update section");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sectionsService.deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      setDeleteDialogOpen(false);
      setSectionToDelete(undefined);
      toast.success("Section deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete section");
    },
  });

  const handleCreateSection = (data: Omit<Section, "id">) => {
    createMutation.mutate(data);
  };

  const handleUpdateSection = (data: Omit<Section, "id">) => {
    if (selectedSection) {
      setUpdatedSectionData(data);
      setUpdateDialogOpen(true);
    }
  };

  const handleConfirmUpdate = () => {
    if (selectedSection && updatedSectionData) {
      updateMutation.mutate({
        id: selectedSection.id,
        data: updatedSectionData,
      });
    }
  };

  const handleEditSection = (section: Section) => {
    setSelectedSection(section);
    setDialogOpen(true);
  };

  const handleDeleteSection = (section: Section) => {
    setSectionToDelete(section);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sectionToDelete) {
      deleteMutation.mutate(sectionToDelete.id);
    }
  };

  const handleViewStudents = (section: Section) => {
    setSelectedSection(section);
    setStudentsListOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

        <ClassesTable
          data={sections}
          onEdit={handleEditSection}
          onDelete={handleDeleteSection}
          onViewStudents={handleViewStudents}
        />

        <Flex justify="between" align="center" mt="4">
          <div className="text-sm text-gray-500">
            Showing {sections.length} entries
          </div>
        </Flex>
      </div>

      <AddClassDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedSection(undefined);
          }
        }}
        onSubmit={selectedSection ? handleUpdateSection : handleCreateSection}
        initialData={selectedSection}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setSectionToDelete(undefined);
          }
        }}
        onConfirm={handleConfirmDelete}
        sectionName={sectionToDelete?.name || ""}
      />

      <UpdateConfirmationDialog
        open={updateDialogOpen}
        onOpenChange={(open) => {
          setUpdateDialogOpen(open);
          if (!open) {
            setUpdatedSectionData(undefined);
          }
        }}
        onConfirm={handleConfirmUpdate}
        sectionName={selectedSection?.name || ""}
        updatedData={
          updatedSectionData || {
            name: "",
            level: "",
            school_year: "",
            is_enabled: true,
          }
        }
      />

      <StudentsListDialog
        open={studentsListOpen}
        onOpenChange={(open) => {
          setStudentsListOpen(open);
          if (!open) {
            setSelectedSection(undefined);
          }
        }}
        sectionName={selectedSection?.name || ""}
        section={selectedSection!}
      />
    </div>
  );
};
