import React from "react";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import {
  Clock,
  Trash2,
  PenSquare,
  Plus,
  Users,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useUsersService, type User } from "@/services/users.service";
import { UserFormDialog } from "@/components/modules/users/UserFormDialog";
import {
  UserFilters,
  type UserFilters as UserFiltersType,
} from "@/components/modules/users/UserFilters";

const UsersTable: React.FC<{
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewDetails: (user: User) => void;
  isLoading?: boolean;
}> = ({ data, onEdit, onDelete, onViewDetails, isLoading }) =>
  isLoading ? (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading users...</p>
      </div>
    </div>
  ) : data.length === 0 ? (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="p-4 bg-gray-50 rounded-lg inline-block">
          <p className="text-gray-500">No users found</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {["Name", "Email", "Role", "Status", "Actions"].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.user_type === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : item.user_type === "teacher"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.user_type.charAt(0).toUpperCase() +
                    item.user_type.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.is_enabled
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.is_enabled ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Flex gap="2">
                  <Button
                    variant="soft"
                    color="blue"
                    size="1"
                    onClick={() => onViewDetails(item)}
                  >
                    <Users size={14} />
                  </Button>
                  <Button variant="soft" color="violet" size="1">
                    <Clock size={14} />
                  </Button>
                  <Button
                    variant="soft"
                    color="amber"
                    size="1"
                    onClick={() => onEdit(item)}
                  >
                    <PenSquare size={14} />
                  </Button>
                  <Button
                    variant="soft"
                    color="red"
                    size="1"
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </Flex>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

const DeleteConfirmationDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName: string;
}> = ({ open, onOpenChange, onConfirm, userName }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content className="max-w-md">
      <Flex direction="column" align="center" gap="3" className="py-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <Dialog.Title className="text-center">Delete User</Dialog.Title>
        <Dialog.Description className="text-center text-gray-600">
          Are you sure you want to delete the user "{userName}"? This action
          cannot be undone.
        </Dialog.Description>
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Button color="red" onClick={onConfirm}>
          Delete User
        </Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
);

const UpdateConfirmationDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName: string;
  updatedData: Omit<User, "id" | "created_at" | "updated_at">;
}> = ({ open, onOpenChange, onConfirm, userName, updatedData }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content className="max-w-md">
      <Flex direction="column" align="center" gap="3" className="py-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Info className="w-8 h-8 text-blue-600" />
        </div>
        <Dialog.Title className="text-center">Update User</Dialog.Title>
        <Dialog.Description className="text-center text-gray-600">
          Are you sure you want to update the user "{userName}" with the
          following changes?
        </Dialog.Description>
        <div className="w-full mt-2 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div>
              <span className="font-medium">Name:</span> {updatedData.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {updatedData.email}
            </div>
            <div>
              <span className="font-medium">Role:</span> {updatedData.user_type}
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              {updatedData.is_enabled ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Button color="blue" onClick={onConfirm}>
          Update User
        </Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
);

export const UserAccountsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | undefined>();
  const [updatedUserData, setUpdatedUserData] = React.useState<
    Omit<User, "id" | "created_at" | "updated_at"> | undefined
  >();
  const [filters, setFilters] = React.useState<UserFiltersType>({
    search: "",
    role: "all",
    status: "all",
  });
  const queryClient = useQueryClient();
  const usersService = useUsersService();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: usersService.getUsers,
  });

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      if (
        filters.search &&
        !user.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.role !== "all" && user.user_type !== filters.role) {
        return false;
      }
      if (filters.status !== "all") {
        const isActive = user.is_enabled;
        if (filters.status === "active" && !isActive) return false;
        if (filters.status === "inactive" && isActive) return false;
      }
      return true;
    });
  }, [users, filters]);

  const createMutation = useMutation({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDialogOpen(false);
      toast.success("User created successfully");
    },
    onError: () => {
      toast.error("Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<User, "id" | "created_at" | "updated_at">>;
    }) => usersService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDialogOpen(false);
      setUpdateDialogOpen(false);
      setSelectedUser(undefined);
      setUpdatedUserData(undefined);
      toast.success("User updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteDialogOpen(false);
      setUserToDelete(undefined);
      toast.success("User deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const handleCreateUser = (
    data: Omit<User, "id" | "created_at" | "updated_at">
  ) => {
    createMutation.mutate(data);
  };

  const handleUpdateUser = (
    data: Omit<User, "id" | "created_at" | "updated_at">
  ) => {
    if (selectedUser) {
      setUpdatedUserData(data);
      setUpdateDialogOpen(true);
    }
  };

  const handleConfirmUpdate = () => {
    if (selectedUser && updatedUserData) {
      updateMutation.mutate({
        id: selectedUser.id,
        data: updatedUserData,
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="h-full w-full p-4">
      <h1 className="text-2xl font-bold mb-6">User Accounts Management</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Flex justify="between" align="center" mb="4">
          <UserFilters onFiltersChange={setFilters} />
          <Button color="green" onClick={() => setDialogOpen(true)}>
            <Plus size={16} /> Add User
          </Button>
        </Flex>

        <UsersTable
          data={filteredUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onViewDetails={handleViewDetails}
          isLoading={isLoading}
        />

        <Flex justify="between" align="center" mt="4">
          <div className="text-sm text-gray-500">
            Showing {filteredUsers.length} entries
          </div>
        </Flex>
      </div>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedUser(undefined);
          }
        }}
        onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
        initialData={selectedUser}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setUserToDelete(undefined);
          }
        }}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name || ""}
      />

      <UpdateConfirmationDialog
        open={updateDialogOpen}
        onOpenChange={(open) => {
          setUpdateDialogOpen(open);
          if (!open) {
            setUpdatedUserData(undefined);
          }
        }}
        onConfirm={handleConfirmUpdate}
        userName={selectedUser?.name || ""}
        updatedData={
          updatedUserData || {
            name: "",
            email: "",
            user_type: "",
            is_enabled: true,
          }
        }
      />
    </div>
  );
};
