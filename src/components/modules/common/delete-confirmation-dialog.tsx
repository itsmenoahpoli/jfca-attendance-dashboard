import React from "react";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  sectionName: string;
}

export const DeleteConfirmationDialog: React.FC<
  DeleteConfirmationDialogProps
> = ({ open, onOpenChange, onConfirm, sectionName }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content className="max-w-md">
      <Flex direction="column" align="center" gap="3" className="py-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <Dialog.Title className="text-center">Delete Item</Dialog.Title>
        <Dialog.Description className="text-center text-gray-600">
          Are you sure you want to delete "{sectionName}"? This action cannot be
          undone.
        </Dialog.Description>
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Button color="red" onClick={onConfirm}>
          Delete
        </Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
);
