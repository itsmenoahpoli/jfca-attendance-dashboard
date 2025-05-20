import React from "react";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { FileDown, QrCode } from "lucide-react";
import { AppQRCode } from "@/components";
import { type Student } from "@/services/students.service";

interface QRPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
  onExport: () => void;
}

export const QRPreviewDialog: React.FC<QRPreviewDialogProps> = ({
  open,
  onOpenChange,
  students,
  onExport,
}) => {
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
          <div className="grid grid-cols-4 gap-4 p-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="border border-gray-200 rounded-lg p-4 flex items-start gap-4"
              >
                <div className="qr-code">
                  <AppQRCode value={student.id} size={100} color="gray" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{student.name}</h3>
                  <p className="text-xs text-gray-500">ID: {student.id}</p>
                  <p className="text-xs text-gray-500">
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 my-1 inline-block">
                      {student.section?.name
                        ? `${student.section.name} - ${student.section.level} (${student.section.school_year})`
                        : "N/A"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-none">
          <Flex gap="3" mt="4" justify="end">
            <Button
              variant="soft"
              color="blue"
              onClick={onExport}
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
