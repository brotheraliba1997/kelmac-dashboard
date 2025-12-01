"use client";
import {
  GetUserRoleName,
  GetUserStatusName,
} from "@/app/utils/getUserRoleName";
import DynamicTable, {
  Column,
  FilterConfig,
} from "@/app/components/table/DynamicTableTailwind";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "@/app/redux/services/userApi";
import { useState } from "react";
import { useRouter } from "next/navigation";

type UserRow = {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: { id?: number } | number;
  status?: { id?: number } | number;
};

type UserFilterState = {
  search: string;
  isActive: string;
  isDeleted: string;
  company: string;
  country: string;
  role: string;
  limit: number;
  page: number;
};

export default function UsersPage() {
  const router = useRouter();
  // Filter state for table
  const [tableFilters, setTableFilters] = useState<UserFilterState>({
    search: "",
    isActive: "",
    isDeleted: "",
    company: "",
    country: "",
    role: "",
    limit: 20,
    page: 1,
  });

  const { data, error, isLoading } = useGetUsersQuery(tableFilters);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  type UsersApiResponse = {
    data?: UserRow[];
    totalItems?: number;
    currentPage?: number;
    totalPages?: number;
    limit?: number;
  };

  const apiResponse: UsersApiResponse | undefined = data as
    | UsersApiResponse
    | undefined;
  const users: UserRow[] = apiResponse?.data ?? [];

  const resolveRoleId = (role: UserRow["role"]): number | undefined =>
    typeof role === "object" ? role?.id : role;

  const resolveStatusId = (status: UserRow["status"]): number | undefined =>
    typeof status === "object" ? status?.id : status;

  const columns: Column<UserRow>[] = [
    {
      key: "firstName",
      label: "Client",
      render: (user) => (
        <div className="d-flex align-items-center gap-2">
          <div className="fw-semibold text-capitalize">
            {user?.firstName} {user?.lastName}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      render: (user) => <div className="text-lowercase">{user?.email}</div>,
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <span className="badge bg-primary text-capitalize">
          {GetUserRoleName(resolveRoleId(user?.role))}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (user) => {
        const statusName = GetUserStatusName(resolveStatusId(user?.status));
        return (
          <>
            {statusName === "Active" && (
              <span className="badge bg-success text-capitalize">
                {statusName}
              </span>
            )}
            {statusName === "Blocked" && (
              <span className="badge bg-danger text-capitalize">
                {statusName}
              </span>
            )}
            {statusName === "Pending" && (
              <span className="badge bg-warning text-dark text-capitalize">
                {statusName}
              </span>
            )}
            {statusName === "unknown" && (
              <span className="badge bg-secondary text-capitalize">
                Unknown
              </span>
            )}
          </>
        );
      },
      sortable: true,
    },
  ];
  // Table filter configs
  const roleOptions = [
    { value: "1", label: "Admin" },
    { value: "2", label: "Student" },
    { value: "3", label: "Instructor" },
    { value: "4", label: "Corporate" },
    { value: "5", label: "Finance" },
  ];

  const usersFilters: FilterConfig[] = [
    {
      key: "isActive",
      label: "Active",
      type: "select",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
    },
    {
      key: "isDeleted",
      label: "Deleted",
      type: "select",
      options: [
        { value: "true", label: "Deleted" },
        { value: "false", label: "Not Deleted" },
      ],
    },
    {
      key: "role",
      label: "Role",
      type: "select",
      options: [...roleOptions],
    },
  ];

  const handleUsersFilterChange = (filters: Partial<UserFilterState>) => {
    const filterKeys = Object.keys(filters);
    const shouldResetPage = filterKeys.some(
      (key) => key !== "page" && key !== "limit"
    );
    const typedFilters = filters as Partial<typeof tableFilters>;

    setTableFilters((prev) => ({
      ...prev,
      ...typedFilters,
      page: shouldResetPage ? 1 : typedFilters.page ?? prev.page,
      limit: typedFilters.limit ?? prev.limit,
    }));
  };

  const handlePageChange = (page: number) => {
    setTableFilters((prev) => ({ ...prev, page }));
  };
  const handleLimitChange = (newLimit: number) => {
    setTableFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleAddUser = () => {
    router.push("/dashboard/users/create");
  };

  const handleViewUser = (user: UserRow) => {
    if (!user?.id) return;
    // router.push(`/dashboard/users/${user.id}`);
  };

  const handleEditUser = (user: UserRow) => {
    if (!user?.id) return;
    router.push(`/dashboard/users/edit/${user.id}`);
  };

  const handleDeleteUser = async (user: UserRow) => {
    if (!user?.id || isDeleting) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;
    try {
      await deleteUser(user.id).unwrap();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };
  console.log("Userss data:", data);
  return (
    <div className="page-wrapper" style={{ minHeight: 730 }}>
      <div className="content container-fluid">
        <DynamicTable
          data={users || []}
          columns={columns}
          loading={isLoading}
          pageTitle="Users Management"
          error={error ? "Error loading users. Please try again." : null}
          searchPlaceholder="Search by name or email..."
          searchKeys={["firstName", "lastName", "email"]}
          filters={usersFilters}
          onFilterChange={handleUsersFilterChange}
          pagination={
            apiResponse && apiResponse.totalItems
              ? {
                  total: apiResponse.totalItems,
                  currentPage: apiResponse.currentPage ?? tableFilters.page,
                  totalPages: apiResponse.totalPages ?? 1,
                  pageSize: apiResponse.limit ?? tableFilters.limit,
                  onPageChange: handlePageChange,
                  onPageSizeChange: handleLimitChange,
                  pageSizeOptions: [4, 10, 20, 50, 100],
                }
              : undefined
          }
          emptyMessage="No users found"
          onAdd={handleAddUser}
          addButtonLabel="Add User"
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={isDeleting ? undefined : handleDeleteUser}
        />
      </div>
    </div>
  );
}
