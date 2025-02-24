import React from "react";
import { Avatar, Flex, DropdownMenu } from "@radix-ui/themes";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { useLayout, useAuth } from "@/hooks";
import { AppSignoutButton } from "@/components";
import { FORMATTERS } from "@/utils";

const ICON_SIZE: number = 16;

const CollapseSidebarTrigger: React.FC = () => {
  const { toggleSidebar, sidebarCollapsed } = useLayout();

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  return (
    <button onClick={handleToggleSidebar}>
      {sidebarCollapsed ? (
        <ArrowRightFromLine color="black" size={ICON_SIZE} />
      ) : (
        <ArrowLeftFromLine color="black" size={ICON_SIZE} />
      )}
    </button>
  );
};

const MyAccountDropdown: React.FC<{ userName: string }> = (props) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleDropdownOpen = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleNavigate = (url: string) => {
    handleDropdownOpen(false);
    console.log(url);
  };

  console.log(handleNavigate);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger>
        <button>
          <Avatar size="3" radius="full" fallback={FORMATTERS.getInitials(props.userName)} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>My Account</DropdownMenu.Item>
        <DropdownMenu.Item>Change Password</DropdownMenu.Item>
        <DropdownMenu.Item>Session Logs</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="red" onSelect={(e) => e.preventDefault()}>
          <AppSignoutButton handleDropdownOpen={handleDropdownOpen} />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export const ContentNavbar: React.FC = () => {
  const { userName } = useAuth();

  return (
    <Flex
      className="w-full h-[60px] bg-white shadow pl-2 pr-5 pt-1"
      align="center"
      justify="between"
    >
      <div>
        <CollapseSidebarTrigger />
      </div>

      <Flex direction="row" justify="end" gap="5">
        <MyAccountDropdown userName={userName!} />
      </Flex>
    </Flex>
  );
};
