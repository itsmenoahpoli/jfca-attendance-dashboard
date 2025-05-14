import React from "react";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { QrCode, Printer } from "lucide-react";
import { AppQRCode } from "@/components";
import { type Student } from "@/services/students.service";

interface StudentQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | undefined;
}

export const StudentQRDialog: React.FC<StudentQRDialogProps> = ({
  open,
  onOpenChange,
  student,
}) => {
  const handlePrintQR = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !student) return;

    // Get the SVG markup from the QR code
    const svgElement = document.querySelector(".qr-code svg");
    const svgMarkup = svgElement ? svgElement.outerHTML : "";

    printWindow.document.write(`
      <html>
        <head>
          <title>Student QR Code - ${student.name}</title>
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
            ${svgMarkup}
            <div class="student-info">
              <div class="student-name">${student.name}</div>
              <div class="student-id">${student.id}</div>
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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-sm">
        <Dialog.Title className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Student QR Code
        </Dialog.Title>
        <Dialog.Description className="text-gray-500 mb-4">
          Scan this QR code to identify the student
        </Dialog.Description>
        <div className="flex justify-center p-4">
          {student && (
            <div className="text-center">
              <div className="qr-code">
                <AppQRCode value={`${student.id}`} size={200} />
              </div>
              <p className="mt-4 !text-xs font-medium text-gray-500">
                {student.name}
              </p>
              <p className="mt-4 !text-xs font-medium text-gray-500">
                {student.id}
              </p>
            </div>
          )}
        </div>
        <Flex gap="3" mt="4" justify="end">
          <Button
            variant="soft"
            color="blue"
            onClick={handlePrintQR}
            className="inline-flex items-center gap-2"
          >
            <Printer size={16} />
            Print QR Code
          </Button>
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
