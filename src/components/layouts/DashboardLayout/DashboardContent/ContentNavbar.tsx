import React from "react";
import { Avatar, Flex, DropdownMenu, Button } from "@radix-ui/themes";
import { ArrowLeftFromLine, ArrowRightFromLine, QrCode } from "lucide-react";
import { useLayout, useAuth } from "@/hooks";
import { AppSignoutButton } from "@/components";
import { FORMATTERS } from "@/utils";
import { WEB_ROUTES } from "@/constants";

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

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger>
        <button>
          <Avatar
            size="3"
            radius="full"
            className="!bg-orange-400"
            fallback={FORMATTERS.getInitials(props.userName)}
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {/* <DropdownMenu.Separator /> */}
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
      <Flex gap="4">
        <CollapseSidebarTrigger />
        <a
          href={WEB_ROUTES.MODULE_ATTENDANCE}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="soft"
            className="!border-2 !border-blue-500 hover:!bg-blue-50"
          >
            <QrCode size={ICON_SIZE} className="mr-2" />
            Attendance Module
          </Button>
        </a>
      </Flex>

      <Flex direction="row" justify="end" gap="5">
        <MyAccountDropdown userName={userName ?? "ADMINISTRATOR"} />
      </Flex>
    </Flex>
  );
};
