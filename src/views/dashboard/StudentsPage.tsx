import React from "react";
import { Button, Flex, TextField, Select } from "@radix-ui/themes";
import { Clock, Trash2, PenSquare, Plus, QrCode } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  useStudentsService,
  type Student,
  type CreateStudentData,
} from "@/services/students.service";
import {
  StudentProfileForm,
  type StudentProfileFormData,
} from "@/components/modules/students/student-profile-form";
import { DeleteConfirmationDialog } from "@/components/modules/common/delete-confirmation-dialog";
import { StudentQRDialog } from "@/components/modules/students/student-qr-dialog";
import { StudentAttendanceLogsDialog } from "@/components/modules/students/student-attendance-logs-dialog";

const StudentsTable: React.FC<{
  data: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onViewQR: (student: Student) => void;
  onViewAttendance: (student: Student) => void;
}> = ({ data, onEdit, onDelete, onViewQR, onViewAttendance }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-lg">
      <thead className="bg-gray-50">
        <tr>
          {[
            "Full Name",
            "Email",
            "Contact",
            "Section",
            "Year Level",
            "School Year",
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
              {item.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.contact}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.section?.name || "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.section?.level || "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {item.section?.school_year || "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
              >
                Active
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Flex gap="2">
                <Button
                  variant="soft"
                  color="green"
                  size="1"
                  onClick={() => onViewQR(item)}
                >
                  <QrCode size={14} />
                </Button>
                <Button
                  variant="soft"
                  color="blue"
                  size="1"
                  onClick={() => onViewAttendance(item)}
                >
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

const Filters: React.FC<{
  onSearch: (value: string) => void;
  onYearLevelChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}> = ({ onSearch, onYearLevelChange, onClassChange, onStatusChange }) => (
  <Flex gap="3">
    <TextField.Root
      size="2"
      placeholder="Search student name..."
      onChange={(e) => onSearch(e.target.value)}
    />
    <Select.Root defaultValue="all" size="2" onValueChange={onYearLevelChange}>
      <Select.Trigger placeholder="Year Level" />
      <Select.Content>
        <Select.Item value="all">All Year Levels</Select.Item>
        <Select.Item value="10">Grade 10</Select.Item>
        <Select.Item value="11">Grade 11</Select.Item>
        <Select.Item value="12">Grade 12</Select.Item>
      </Select.Content>
    </Select.Root>
    <Select.Root defaultValue="all" size="2" onValueChange={onClassChange}>
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
    <Select.Root defaultValue="all" size="2" onValueChange={onStatusChange}>
      <Select.Trigger placeholder="Status" />
      <Select.Content>
        <Select.Item value="all">All Status</Select.Item>
        <Select.Item value="active">Active</Select.Item>
        <Select.Item value="inactive">Inactive</Select.Item>
      </Select.Content>
    </Select.Root>
  </Flex>
);

export const StudentsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<
    Student | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [qrDialogOpen, setQrDialogOpen] = React.useState(false);
  const [attendanceLogsDialogOpen, setAttendanceLogsDialogOpen] =
    React.useState(false);
  const [filters, setFilters] = React.useState({
    search: "",
    yearLevel: "all",
    class: "all",
    status: "all",
  });

  const queryClient = useQueryClient();
  const studentsService = useStudentsService();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentsService.getStudents("all"),
  });

  const createMutation = useMutation({
    mutationFn: studentsService.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setDialogOpen(false);
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
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setDialogOpen(false);
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
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setDeleteDialogOpen(false);
      setSelectedStudent(undefined);
      toast.success("Student deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete student");
    },
  });

  const handleAddStudent = (data: StudentProfileFormData) => {
    const apiData = {
      name: data.name,
      email: data.email,
      gender: data.gender,
      contact: data.contact,
      guardian_name: data.guardian_name,
      guardian_relation: data.guardian_relation,
      guardian_mobile_number: data.guardian_mobile_number,
      section_id: selectedStudent?.section_id || data.section,
      leftSideImage: data.leftSideImage,
      frontSideImage: data.frontSideImage,
      rightSideImage: data.rightSideImage,
    };

    if (selectedStudent) {
      updateMutation.mutate({
        id: selectedStudent.id,
        data: apiData,
      });
    } else {
      createMutation.mutate(apiData);
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

  const filteredStudents = React.useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesYearLevel =
        filters.yearLevel === "all" ||
        student.section_id.includes(filters.yearLevel);
      const matchesClass =
        filters.class === "all" || student.section_id.includes(filters.class);
      const matchesStatus =
        filters.status === "all" || filters.status === "active"; // Always show active since we don't have is_enabled

      return matchesSearch && matchesYearLevel && matchesClass && matchesStatus;
    });
  }, [students, filters]);

  return (
    <div className="h-full w-full p-4">
      <h1 className="text-2xl font-bold mb-6">Students Management</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Flex justify="between" align="center" mb="4">
          <Filters
            onSearch={(value) =>
              setFilters((prev) => ({ ...prev, search: value }))
            }
            onYearLevelChange={(value) =>
              setFilters((prev) => ({ ...prev, yearLevel: value }))
            }
            onClassChange={(value) =>
              setFilters((prev) => ({ ...prev, class: value }))
            }
            onStatusChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          />
          <Button color="green" onClick={() => setDialogOpen(true)}>
            <Plus size={16} /> Add Student
          </Button>
        </Flex>

        {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading students...</p>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="p-4 bg-gray-50 rounded-lg inline-block">
                <p className="text-gray-500">No students found</p>
              </div>
            </div>
          </div>
        ) : (
          <StudentsTable
            data={filteredStudents}
            onEdit={(student) => {
              setSelectedStudent(student);
              setDialogOpen(true);
            }}
            onDelete={handleDeleteStudent}
            onViewQR={(student) => {
              setSelectedStudent(student);
              setQrDialogOpen(true);
            }}
            onViewAttendance={(student) => {
              setSelectedStudent(student);
              setAttendanceLogsDialogOpen(true);
            }}
          />
        )}

        <Flex justify="between" align="center" mt="4">
          <div className="text-sm text-gray-500">
            Showing {filteredStudents.length} of {students.length} entries
          </div>
        </Flex>
      </div>

      <StudentProfileForm
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedStudent(undefined);
          }
        }}
        onSubmit={handleAddStudent}
        initialData={selectedStudent}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
        submitButtonText={selectedStudent ? "Update Student" : "Add Student"}
        section={
          selectedStudent?.section
            ? {
                ...selectedStudent.section,
                is_enabled: true,
              }
            : undefined
        }
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

      <StudentAttendanceLogsDialog
        open={attendanceLogsDialogOpen}
        onOpenChange={(open) => {
          setAttendanceLogsDialogOpen(open);
          if (!open) {
            setSelectedStudent(undefined);
          }
        }}
        student={selectedStudent}
      />
    </div>
  );
};
