import React from "react";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { FileDown, QrCode } from "lucide-react";
import { AppQRCode } from "@/components";
import { type Student } from "@/services/students.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import brandLogo from "@/assets/images/brand-logo.png";

interface QRPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
}

export const QRPreviewDialog: React.FC<QRPreviewDialogProps> = ({
  open,
  onOpenChange,
  students,
}) => {
  const groupedStudents = students.reduce((acc, student) => {
    const sectionKey = student.section?.name
      ? `${student.section.name} - ${student.section.level} (${student.section.school_year})`
      : "No Section";

    if (!acc[sectionKey]) {
      acc[sectionKey] = [];
    }
    acc[sectionKey].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

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
    doc.text("JESUS CHRISTIAN FAITH ACADEMY", margin + logoSize + 6, 16);
    doc.setFontSize(10);
    doc.text("Imus, Cavite", margin + logoSize + 6, 22);
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 26, pageWidth - margin, 26);
    doc.setDrawColor(0, 0, 0);
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const qrSize = 28;
    const qrExportSize = 168;
    const rowHeight = 38;

    const logoBase64 = await getLogoBase64(brandLogo);

    const sections = Object.entries(groupedStudents);

    for (let i = 0; i < sections.length; i++) {
      const [sectionName, sectionStudents] = sections[i];

      if (i > 0) {
        doc.addPage();
      }

      addHeader(doc, logoBase64, pageWidth);
      let currentY = 40;

      doc.setFontSize(16);
      doc.text("Student QR Codes", pageWidth / 2, currentY, {
        align: "center",
      });
      currentY += 10;

      doc.setFontSize(14);
      doc.text(sectionName, margin, currentY);
      currentY += 15;

      const tableData = sectionStudents.map((student) => [
        student.id,
        student.name,
        student.email,
      ]);

      autoTable(doc, {
        head: [["Student ID", "Name", "Email"]],
        body: tableData,
        startY: currentY,
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: margin, right: margin },
      });

      currentY = (doc as any).lastAutoTable.finalY + 10;

      const qrCodesPerRow = 2;
      const columnWidth = (pageWidth - margin * 2) / qrCodesPerRow;
      let currentX = margin;
      let rowCount = 0;

      for (const student of sectionStudents) {
        if (currentY + rowHeight > pageHeight - margin) {
          doc.addPage();
          addHeader(doc, logoBase64, pageWidth);
          currentY = 40;
          currentX = margin;
          rowCount = 0;
        }

        const imgData = await QRCode.toDataURL(student.id, {
          width: qrExportSize,
          margin: 1,
          color: {
            dark: "#333333",
            light: "#FFFFFF",
          },
        });
        doc.addImage(imgData, "PNG", currentX, currentY, qrSize, qrSize);

        const nameMaxWidth = columnWidth - qrSize - 20;
        const nameLines = doc.splitTextToSize(student.name, nameMaxWidth);
        doc.setFontSize(10);
        doc.text(nameLines, currentX + qrSize + 10, currentY + 10);
        doc.setFontSize(8);
        doc.text(
          `ID: ${student.id}`,
          currentX + qrSize + 10,
          currentY + 18 + (nameLines.length - 1) * 8
        );
        doc.text(
          `Email: ${student.email}`,
          currentX + qrSize + 10,
          currentY + 26 + (nameLines.length - 1) * 8
        );

        rowCount++;
        if (rowCount % qrCodesPerRow === 0) {
          currentY += rowHeight + (nameLines.length - 1) * 8;
          currentX = margin;
        } else {
          currentX += columnWidth;
        }
      }
    }

    doc.save("student-qr-codes.pdf");
    toast.success("QR codes exported successfully");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="!w-[90vw] !max-w-[90vw] flex flex-col">
        <div className="flex-none pb-4">
          <Dialog.Title className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Codes Preview
          </Dialog.Title>
          <Dialog.Description className="text-gray-500 mb-4">
            Preview of QR codes that will be exported
          </Dialog.Description>
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.entries(groupedStudents).map(
            ([sectionName, sectionStudents]) => (
              <div key={sectionName} className="mb-8">
                <h2 className="text-lg font-semibold mb-4 px-4">
                  {sectionName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                  {sectionStudents.map((student) => (
                    <div
                      key={student.id}
                      className="border border-gray-200 rounded-lg p-4 flex items-start gap-4"
                    >
                      <div className="qr-code">
                        <AppQRCode value={student.id} size={100} color="gray" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{student.name}</h3>
                        <p className="text-xs text-gray-500">
                          ID: {student.id}
                        </p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        <div className="flex-none">
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
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
