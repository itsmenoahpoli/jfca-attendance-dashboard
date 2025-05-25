import React from "react";
import { Button, Dialog, Flex, Avatar } from "@radix-ui/themes";
import { PenSquare, Plus, Trash2, Users2, QrCode, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { type Section } from "@/services/sections.service";
import {
  useStudentsService,
  type Student,
  type CreateStudentData,
} from "@/services/students.service";
import {
  StudentProfileForm,
  type StudentProfileFormData,
} from "./StudentProfileForm";
import { StudentQRDialog } from "./StudentQrDialog";
import { StudentExcelImportDialog } from "./StudentExcelImportDialog";
import { DeleteConfirmationDialog } from "../common/DeleteConfirmationDialog";

interface StudentsListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionName: string;
  section: Section | undefined;
  onImportSuccess?: () => void;
}

export const StudentsListDialog: React.FC<StudentsListDialogProps> = ({
  open,
  onOpenChange,
  sectionName,
  section,
  onImportSuccess,
}) => {
  const [addStudentDialogOpen, setAddStudentDialogOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<
    Student | undefined
  >();
  const [selectedStudents, setSelectedStudents] = React.useState<Set<string>>(
    new Set()
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [qrDialogOpen, setQrDialogOpen] = React.useState(false);
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const studentsService = useStudentsService();

  const createMutation = useMutation({
    mutationFn: studentsService.createStudent,
    onSuccess: () => {
      if (section) {
        queryClient.invalidateQueries({ queryKey: ["sections"] });
      }
      setAddStudentDialogOpen(false);
      toast.success("Student added successfully");
    },
    onError: () => {
      toast.error("Failed to add student");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateStudentData>;
    }) => studentsService.updateStudent(id, data),
    onSuccess: () => {
      if (section) {
        queryClient.invalidateQueries({ queryKey: ["sections"] });
      }
      setAddStudentDialogOpen(false);
      setSelectedStudent(undefined);
      toast.success("Student updated successfully");
    },
    onError: () => {
      toast.error("Failed to update student");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: studentsService.deleteStudent,
    onSuccess: () => {
      if (section) {
        queryClient.invalidateQueries({ queryKey: ["sections"] });
      }
      setDeleteDialogOpen(false);
      setSelectedStudent(undefined);
      setSelectedStudents(new Set());
      toast.success("Student deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete student");
    },
  });

  const handleAddStudent = (data: StudentProfileFormData) => {
    if (!section) return;

    if (selectedStudent) {
      updateMutation.mutate({
        id: selectedStudent.id,
        data: {
          ...data,
          section_id: section.id,
        },
      });
    } else {
      createMutation.mutate({
        ...data,
        section_id: section.id,
      });
    }
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      deleteMutation.mutate(selectedStudent.id);
    }
  };

  const handleBatchDelete = () => {
    if (selectedStudents.size === 0) return;

    const deletePromises = Array.from(selectedStudents).map((studentId) =>
      studentsService.deleteStudent(studentId)
    );

    Promise.all(deletePromises)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["sections"] });
        queryClient.refetchQueries({ queryKey: ["sections"] });
        setSelectedStudents(new Set());
        toast.success(
          `Successfully deleted ${selectedStudents.size} student${
            selectedStudents.size > 1 ? "s" : ""
          }`
        );
      })
      .catch(() => {
        toast.error("Failed to delete some students");
      });
  };

  const toggleStudentSelection = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  if (!section) {
    return null;
  }

  const students = section.students || [];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="!w-[90vw] !max-w-[90vw]">
        <Dialog.Title className="flex items-center gap-2">
          <Users2 className="w-5 h-5" />
          Students List - {sectionName}
        </Dialog.Title>
        <Dialog.Description className="text-gray-500 mb-4">
          View and manage students in this section.
        </Dialog.Description>
        <div className="mt-4">
          {createMutation.isPending ||
          updateMutation.isPending ||
          deleteMutation.isPending ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading students...</p>
              </div>
            </div>
          ) : students.length === 0 ? (
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
                  <Flex gap="2" justify="center">
                    <Button
                      color="blue"
                      onClick={() => setAddStudentDialogOpen(true)}
                      className="inline-flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Student
                    </Button>
                    <Button
                      color="green"
                      onClick={() => setImportDialogOpen(true)}
                      className="inline-flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Batch Import
                    </Button>
                  </Flex>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                {selectedStudents.size > 0 && (
                  <Button
                    color="red"
                    onClick={handleBatchDelete}
                    className="inline-flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Selected ({selectedStudents.size})
                  </Button>
                )}
                <Flex gap="2">
                  <Button
                    color="green"
                    onClick={() => setImportDialogOpen(true)}
                    className="inline-flex items-center gap-2"
                  >
                    <Upload size={16} />
                    Batch Import
                  </Button>
                  <Button
                    color="blue"
                    onClick={() => setAddStudentDialogOpen(true)}
                    className="inline-flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Student
                  </Button>
                </Flex>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedStudents.size === students.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents(
                                new Set(students.map((s) => s.id))
                              );
                            } else {
                              setSelectedStudents(new Set());
                            }
                          }}
                        />
                      </th>
                      {["Image", "Name", "Email", "Contact", "Actions"].map(
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
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={selectedStudents.has(student.id)}
                            onChange={() => toggleStudentSelection(student.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.images?.facefront ? (
                            <img
                              src={student.images.facefront}
                              alt={`${student.first_name} ${student.last_name}`}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <Avatar
                              fallback={student.first_name
                                .charAt(0)
                                .toUpperCase()}
                              size="5"
                              radius="full"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {`${student.first_name} ${student.middle_name} ${student.last_name}`.trim()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.contact || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Flex gap="2">
                            <Button
                              variant="soft"
                              color="blue"
                              size="1"
                              onClick={() => {
                                setSelectedStudent(student);
                                setQrDialogOpen(true);
                              }}
                            >
                              <QrCode size={14} />
                            </Button>
                            <Button
                              variant="soft"
                              color="amber"
                              size="1"
                              onClick={() => {
                                setSelectedStudent(student);
                                setAddStudentDialogOpen(true);
                              }}
                            >
                              <PenSquare size={14} />
                            </Button>
                            <Button
                              variant="soft"
                              color="red"
                              size="1"
                              onClick={() => handleDeleteStudent(student)}
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
            </div>
          )}
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
        onOpenChange={(open) => {
          setAddStudentDialogOpen(open);
          if (!open) {
            setSelectedStudent(undefined);
          }
        }}
        onSubmit={handleAddStudent}
        section={section!}
        initialData={selectedStudent}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
        submitButtonText={selectedStudent ? "Update Student" : "Add Student"}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setSelectedStudent(undefined);
          }
        }}
        onConfirm={handleConfirmDelete}
        sectionName={
          selectedStudent
            ? `${selectedStudent.first_name} ${selectedStudent.last_name}`.trim()
            : ""
        }
      />

      <StudentQRDialog
        open={qrDialogOpen}
        onOpenChange={(open) => {
          setQrDialogOpen(open);
          if (!open) {
            setSelectedStudent(undefined);
          }
        }}
        student={selectedStudent}
      />

      <StudentExcelImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        sectionId={section?.id || ""}
        onImportSuccess={onImportSuccess}
      />
    </Dialog.Root>
  );
};
