import React from "react";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import {
  Clock,
  Trash2,
  PenSquare,
  Plus,
  Users,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSectionsService, type Section } from "@/services/sections.service";
import { StudentsListDialog } from "@/components/modules/students/StudentsListDialog";
import { ClassFormDialog } from "@/components/modules/classes/ClassFormDialog";
import {
  ClassFilters,
  type ClassFilters as ClassFiltersType,
} from "@/components/modules/classes/ClassFilters";

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
  const [filters, setFilters] = React.useState<ClassFiltersType>({
    search: "",
    level: "all",
    status: "all",
  });
  const queryClient = useQueryClient();
  const sectionsService = useSectionsService();

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["sections"],
    queryFn: sectionsService.getSections,
  });

  const filteredSections = React.useMemo(() => {
    return sections.filter((section) => {
      if (
        filters.search &&
        !section.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.level !== "all" && section.level !== filters.level) {
        return false;
      }
      if (filters.status !== "all") {
        const isActive = section.is_enabled;
        if (filters.status === "active" && !isActive) return false;
        if (filters.status === "inactive" && isActive) return false;
      }
      return true;
    });
  }, [sections, filters]);

  const { data: selectedSectionWithStudents } = useQuery({
    queryKey: ["section", selectedSection?.id],
    queryFn: () => sectionsService.getSection(selectedSection!.id),
    enabled: !!selectedSection && studentsListOpen,
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
          <ClassFilters onFiltersChange={setFilters} />
          <Button color="green" onClick={() => setDialogOpen(true)}>
            <Plus size={16} /> Add Class/Section
          </Button>
        </Flex>

        <ClassesTable
          data={filteredSections}
          onEdit={handleEditSection}
          onDelete={handleDeleteSection}
          onViewStudents={handleViewStudents}
        />

        <Flex justify="between" align="center" mt="4">
          <div className="text-sm text-gray-500">
            Showing {filteredSections.length} entries
          </div>
        </Flex>
      </div>

      <ClassFormDialog
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
        section={selectedSectionWithStudents}
        onImportSuccess={async () => {
          if (selectedSection) {
            const updatedSection = await sectionsService.getSection(
              selectedSection.id
            );
            setSelectedSection(updatedSection);
          }
        }}
      />
    </div>
  );
};
