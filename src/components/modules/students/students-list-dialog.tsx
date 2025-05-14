import React from "react";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { PenSquare, Plus, Trash2, Users2, QrCode, Printer } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { type Section } from "@/services/sections.service";
import {
  useStudentsService,
  type Student,
  type UpdateStudentData,
} from "@/services/students.service";
import {
  StudentProfileForm,
  type StudentProfileFormData,
} from "./student-profile-form";
import { DeleteConfirmationDialog } from "../common/delete-confirmation-dialog";
import { StudentQRDialog } from "./student-qr-dialog";

interface StudentsListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionName: string;
  section: Section | undefined;
}

export const StudentsListDialog: React.FC<StudentsListDialogProps> = ({
  open,
  onOpenChange,
  sectionName,
  section,
}) => {
  const [addStudentDialogOpen, setAddStudentDialogOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<
    Student | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [qrDialogOpen, setQrDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const studentsService = useStudentsService();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students", section?.id],
    queryFn: () => {
      if (!section) throw new Error("Section is required");
      return studentsService.getStudents(section.id);
    },
    enabled: open && !!section,
  });

  const createMutation = useMutation({
    mutationFn: studentsService.createStudent,
    onSuccess: () => {
      if (section) {
        queryClient.invalidateQueries({ queryKey: ["students", section.id] });
      }
      setAddStudentDialogOpen(false);
      toast.success("Student added successfully");
    },
    onError: () => {
      toast.error("Failed to add student");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentData }) =>
      studentsService.updateStudent(id, data),
    onSuccess: () => {
      if (section) {
        queryClient.invalidateQueries({ queryKey: ["students", section.id] });
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
        queryClient.invalidateQueries({ queryKey: ["students", section.id] });
      }
      setDeleteDialogOpen(false);
      setSelectedStudent(undefined);
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

  const handlePrintQR = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !selectedStudent) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Student QR Code - ${selectedStudent.name}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .qr-container {
              text-align: center;
            }
            .student-info {
              margin-top: 20px;
              text-align: center;
            }
            .student-name {
              font-size: 18px;
              font-weight: 500;
              color: #333;
              margin-bottom: 8px;
            }
            .student-id {
              font-size: 14px;
              color: #666;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img src="${
              document.querySelector(".qr-code svg")?.outerHTML
            }" width="200" height="200" />
            <div class="student-info">
              <div class="student-name">${selectedStudent.name}</div>
              <div class="student-id">${selectedStudent.id}</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!section) {
    return null;
  }

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
          {isLoading ||
          createMutation.isPending ||
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
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  color="blue"
                  onClick={() => setAddStudentDialogOpen(true)}
                  className="inline-flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Student
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Name", "Email", "Contact", "Actions"].map((header) => (
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
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.name}
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
        section={section}
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
        sectionName={selectedStudent ? selectedStudent.name : ""}
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
    </Dialog.Root>
  );
};
