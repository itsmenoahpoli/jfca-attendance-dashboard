import React from "react";
import { Button, Dialog, Flex, Select } from "@radix-ui/themes";
import { FileDown } from "lucide-react";
import { type Student } from "@/services/students.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import brandLogo from "@/assets/images/brand-logo.png";

interface StudentExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
}

export const StudentExportDialog: React.FC<StudentExportDialogProps> = ({
  open,
  onOpenChange,
  students,
}) => {
  const [exportFilters, setExportFilters] = React.useState({
    yearLevel: "all",
    class: "all",
  });

  const getLogoBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          reject();
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const addHeader = (doc: jsPDF, logoBase64: string, pageWidth: number) => {
    const logoSize = 16;
    const margin = 10;
    doc.addImage(logoBase64, "PNG", margin, 8, logoSize, logoSize);
    doc.setFontSize(14);
    doc.text("JUBILEE CHRISTIAN FAITH ACADEMY", margin + logoSize + 6, 16);
    doc.setFontSize(10);
    doc.text("Imus, Cavite", margin + logoSize + 6, 22);
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 26, pageWidth - margin, 26);
    doc.setDrawColor(0, 0, 0);
  };

  const handleExportPDF = async () => {
    const filteredStudents = students.filter((student) => {
      const matchesYearLevel =
        exportFilters.yearLevel === "all" ||
        student.section?.level === exportFilters.yearLevel;
      const matchesClass =
        exportFilters.class === "all" ||
        student.section?.name
          ?.toLowerCase()
          .includes(exportFilters.class.toLowerCase());

      return matchesYearLevel && matchesClass;
    });

    if (filteredStudents.length === 0) {
      toast.warning("No students to export");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

    const logoBase64 = await getLogoBase64(brandLogo);
    addHeader(doc, logoBase64, pageWidth);

    let currentY = 40;

    doc.setFontSize(16);
    doc.text("Students List", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 10;

    const tableData = filteredStudents.map((student) => [
      `${student.first_name} ${student.middle_name} ${student.last_name}`,
      student.student_key,
      student.email,
      student.contact || "-",
      student.section?.name || "-",
      student.section?.level || "-",
      student.section?.school_year || "-",
      "Active",
    ]);

    autoTable(doc, {
      head: [
        [
          "Full Name",
          "Student Key",
          "Email",
          "Contact",
          "Section",
          "Year Level",
          "School Year",
          "Status",
        ],
      ],
      body: tableData,
      startY: currentY,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: margin, right: margin },
    });

    doc.save("students-list.pdf");
    toast.success("Students list exported successfully");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="w-[85%] max-w-[90%]">
        <Dialog.Title className="flex items-center gap-2">
          <FileDown className="w-5 h-5" />
          Export Students List
        </Dialog.Title>
        <Dialog.Description className="text-gray-500 mb-4">
          Configure export filters before generating the PDF
        </Dialog.Description>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Level
              </label>
              <Select.Root
                defaultValue="all"
                size="2"
                onValueChange={(value) =>
                  setExportFilters((prev) => ({ ...prev, yearLevel: value }))
                }
              >
                <Select.Trigger placeholder="Year Level" />
                <Select.Content>
                  <Select.Item value="all">All Year Levels</Select.Item>
                  <Select.Item value="10">Grade 10</Select.Item>
                  <Select.Item value="11">Grade 11</Select.Item>
                  <Select.Item value="12">Grade 12</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class/Section
              </label>
              <Select.Root
                defaultValue="all"
                size="2"
                onValueChange={(value) =>
                  setExportFilters((prev) => ({ ...prev, class: value }))
                }
              >
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
            </div>
          </div>
        </div>

        <Flex gap="3" mt="4" justify="end">
          <Button
            variant="soft"
            color="blue"
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2"
          >
            <FileDown size={16} />
            Export PDF
          </Button>
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
