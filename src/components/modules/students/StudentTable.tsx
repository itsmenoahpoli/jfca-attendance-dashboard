import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { type Student } from "@/services/students.service";
import { StudentQRDialog } from "./StudentQrDialog";
import { StudentDeleteDialog } from "./StudentDeleteDialog";
import { StudentFormDialog } from "./StudentFormDialog";

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onEdit,
  onDelete,
}) => {
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(
    null
  );
  const [isQRDialogOpen, setIsQRDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const getFullName = (student: Student) => {
    return `${student.first_name} ${student.middle_name} ${student.last_name}`.trim();
  };

  const handleViewQR = (student: Student) => {
    setSelectedStudent(student);
    setIsQRDialogOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{getFullName(student)}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.contact}</TableCell>
                <TableCell>{student.section?.name}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      student.is_enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.is_enabled ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewQR(student)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(student)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(student)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StudentQRDialog
        open={isQRDialogOpen}
        onOpenChange={setIsQRDialogOpen}
        student={selectedStudent || undefined}
      />

      <StudentDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        student={selectedStudent || undefined}
        onDelete={onDelete}
      />

      <StudentFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        student={selectedStudent || undefined}
        onSubmit={onEdit}
      />
    </>
  );
};
