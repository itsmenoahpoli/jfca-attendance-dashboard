import React from "react";
import { Button, Dialog, Flex, Table } from "@radix-ui/themes";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStudentsService } from "@/services/students.service";
import * as XLSX from "xlsx";

interface StudentExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: string;
}

interface ExcelStudent {
  "Student Name": string;
  "Email Address": string;
  Gender: string;
  "Contact Number": string;
  "Guardian Name": string;
  "Guardian Contact Number": string;
  "Guardian Relation": string;
  Section: string;
}

export const StudentExcelImportDialog: React.FC<
  StudentExcelImportDialogProps
> = ({ open, onOpenChange, sectionId }) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [parsedData, setParsedData] = React.useState<ExcelStudent[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [alert, setAlert] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const studentsService = useStudentsService();

  const importMutation = useMutation({
    mutationFn: async (students: ExcelStudent[]) => {
      const promises = students.map((student) => {
        return studentsService.createStudent({
          name: student["Student Name"],
          email: student["Email Address"],
          gender: student.Gender,
          contact: student["Contact Number"],
          guardian_name: student["Guardian Name"],
          guardian_mobile_number: student["Guardian Contact Number"],
          guardian_relation: student["Guardian Relation"],
          section_id: sectionId,
          leftSideImage: "",
          frontSideImage: "",
          rightSideImage: "",
        });
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setAlert({ type: "success", message: "Students imported successfully" });
      setTimeout(() => {
        onOpenChange(false);
        setFile(null);
        setParsedData([]);
        setError(null);
        setAlert(null);
      }, 2000);
    },
    onError: () => {
      setAlert({ type: "error", message: "Failed to import students" });
    },
  });

  const parseExcelFile = (file: File) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ExcelStudent>(worksheet);

        const requiredColumns = [
          "Student Name",
          "Email Address",
          "Gender",
          "Contact Number",
          "Guardian Name",
          "Guardian Contact Number",
          "Guardian Relation",
          "Section",
        ] as const;

        if (jsonData.length === 0) {
          setError("No data found in the Excel file");
          setFile(null);
          setParsedData([]);
          return;
        }

        const firstRow = jsonData[0];
        const missingColumns = requiredColumns.filter(
          (col) => !(col in firstRow)
        );

        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(", ")}`);
          setFile(null);
          setParsedData([]);
          return;
        }

        setParsedData(jsonData);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        setError("Error parsing Excel file");
        setFile(null);
        setParsedData([]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(selectedFile);
        parseExcelFile(selectedFile);
      } else {
        setError("Please upload an Excel file (.xlsx or .xls)");
        setFile(null);
        setParsedData([]);
      }
    }
  };

  const handleImport = () => {
    if (parsedData.length > 0) {
      importMutation.mutate(parsedData);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="!w-[90vw] !max-w-[90vw]">
        <Dialog.Title>Import Students from Excel</Dialog.Title>
        <Dialog.Description className="text-gray-500 mb-4">
          Upload an Excel file containing student information. The file should
          include columns for Student Name, Email Address, Gender, Contact
          Number, Guardian Name, Guardian Contact Number, Guardian Relation, and
          Section.
        </Dialog.Description>

        {alert && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
              alert.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {alert.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-medium">{alert.message}</p>
          </div>
        )}

        <div className="mt-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            className="hidden"
          />

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                {parsedData.length > 0 && (
                  <p className="text-xs text-green-600">
                    {parsedData.length} students found in file
                  </p>
                )}
                <Button
                  variant="soft"
                  color="red"
                  size="1"
                  onClick={() => {
                    setFile(null);
                    setParsedData([]);
                    setError(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  Excel files only (.xlsx, .xls)
                </p>
                <Button
                  variant="soft"
                  color="blue"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </Button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {parsedData.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">
                Preview ({parsedData.length} students)
              </h3>
              <div className="max-h-[300px] overflow-y-auto border border-gray-100 rounded-lg shadow-sm">
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row className="bg-gray-50/50">
                      <Table.ColumnHeaderCell className="font-medium text-gray-600">
                        Name
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell className="font-medium text-gray-600">
                        Email
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell className="font-medium text-gray-600">
                        Gender
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell className="font-medium text-gray-600">
                        Contact Number
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell className="font-medium text-gray-600">
                        Guardian Name
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell className="font-medium text-gray-600">
                        Guardian Relation
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell className="font-medium text-gray-600">
                        Guardian Contact
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {parsedData.map((student, index) => (
                      <Table.Row
                        key={index}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <Table.Cell className="text-gray-700">
                          {student["Student Name"]}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700">
                          {student["Email Address"]}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700">
                          {student.Gender}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700">
                          {student["Contact Number"]}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700">
                          {student["Guardian Name"]}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700">
                          {student["Guardian Relation"]}
                        </Table.Cell>
                        <Table.Cell className="text-gray-700">
                          {student["Guardian Contact Number"]}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </div>
            </div>
          )}
        </div>

        <Flex gap="3" mt="4" justify="end">
          <Button
            variant="soft"
            color="gray"
            onClick={() => {
              onOpenChange(false);
              setFile(null);
              setParsedData([]);
              setError(null);
              setAlert(null);
            }}
          >
            Cancel
          </Button>
          <Button
            color="blue"
            disabled={
              !file || importMutation.isPending || parsedData.length === 0
            }
            onClick={handleImport}
          >
            {importMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Importing Students...</span>
              </div>
            ) : parsedData.length > 0 ? (
              "Confirm & Upload Students"
            ) : (
              "Import"
            )}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
