import React from "react";
import { AlertDialog, Flex, Button } from "@radix-ui/themes";
import { LogOut } from "lucide-react";

type Props = {
  handleDropdownOpen: (isOpen: boolean) => void;
};

export const AppSignoutButton: React.FC<Props> = (props) => {
  const handleConfirm = () => {
    props.handleDropdownOpen(false);
    window.location.href = "/auth/signin";
  };

  const handleCancel = () => {
    props.handleDropdownOpen(false);
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <button>
          <Flex direction="row" gap="2">
            <LogOut size={15} /> Sign Out
          </Flex>
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Content className="w-1/5">
        <AlertDialog.Title className="!text-md max-sm:!text-sm">
          Sign Out
        </AlertDialog.Title>
        <AlertDialog.Description className="!text-sm max-sm:!text-xs text-gray-700">
          Do you confirm to sign out and end your session?
        </AlertDialog.Description>
        <Flex gap="3" justify="end" className="mt-4">
          <AlertDialog.Cancel onClick={handleCancel}>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button color="red" onClick={handleConfirm}>
              Sign Out
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
