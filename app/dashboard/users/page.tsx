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
            apiResponse &&
            apiResponse?.totalItems && {
              total: apiResponse.totalItems,
              currentPage: apiResponse.currentPage ?? tableFilters.page,
              totalPages: apiResponse.totalPages ?? 1,
              pageSize: apiResponse.limit ?? tableFilters.limit,
              onPageChange: handlePageChange,
              onPageSizeChange: handleLimitChange,
              pageSizeOptions: [4, 10, 20, 50, 100],
            }
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

// "use client";
// import MainDashboard from "@/app/components/dashboard--component/MainDashboard-component";
// import React, { use, useEffect, useState } from "react";
// import Table from "@/app/components/table/index";
// import Link from "next/link";
// import { useGetUsersQuery } from "@/app/redux/services/userApi";
// import {
//   GetUserRoleName,
//   GetUserStatusName,
// } from "@/app/utils/getUserRoleName";

// export default function page() {
//   const { data, error } = useGetUsersQuery({});

//   console.log("data from users page==>", data);
//   const allUsers = [
//     {
//       id: 1,
//       firstName: "Hamza",
//       lastName: "Ali",
//       email: "hamza@example.com",
//       role: "Admin",
//       status: "Active",
//     },
//     {
//       id: 2,
//       firstName: "Usman",
//       lastName: "Khan",
//       email: "usman@example.com",
//       role: "Student",
//       status: "Pending",
//     },
//     {
//       id: 3,
//       firstName: "Ali",
//       lastName: "Raza",
//       email: "ali.raza@example.com",
//       role: "Instructor",
//       status: "Active",
//     },
//     {
//       id: 4,
//       firstName: "Ahsan",
//       lastName: "Qureshi",
//       email: "ahsan.q@example.com",
//       role: "Corporate",
//       status: "Blocked",
//     },
//     {
//       id: 5,
//       firstName: "Taha",
//       lastName: "Malik",
//       email: "taha.malik@example.com",
//       role: "Student",
//       status: "Active",
//     },
//     {
//       id: 6,
//       firstName: "Bilal",
//       lastName: "Shahid",
//       email: "bilal.shahid@example.com",
//       role: "Instructor",
//       status: "Active",
//     },
//     {
//       id: 7,
//       firstName: "Zain",
//       lastName: "Ahmad",
//       email: "zain.ahmad@example.com",
//       role: "Corporate",
//       status: "Pending",
//     },
//     {
//       id: 8,
//       firstName: "Imran",
//       lastName: "Khalid",
//       email: "imran.k@example.com",
//       role: "Admin",
//       status: "Active",
//     },
//     {
//       id: 9,
//       firstName: "Saad",
//       lastName: "Hassan",
//       email: "saad.h@example.com",
//       role: "Student",
//       status: "Pending",
//     },
//     {
//       id: 10,
//       firstName: "Hassan",
//       lastName: "Butt",
//       email: "hassan.b@example.com",
//       role: "Instructor",
//       status: "Active",
//     },
//     {
//       id: 11,
//       firstName: "Nabeel",
//       lastName: "Iqbal",
//       email: "nabeel.i@example.com",
//       role: "Corporate",
//       status: "Blocked",
//     },
//   ];

//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [isLoading, setIsLoading] = useState(true);

//   const totalEntries = allUsers.length;
//   const totalPages = Math.ceil(totalEntries / pageSize);

//   const indexOfLastItem = page * pageSize;
//   const indexOfFirstItem = indexOfLastItem - pageSize;
//   const currentData = allUsers.slice(indexOfFirstItem, indexOfLastItem);

//   useEffect(() => {
//     setIsLoading(true);
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 700);
//     return () => clearTimeout(timer);
//   }, [page, pageSize]);

//   const columns = [
//     {
//       key: "Client",
//       render: (e: any) => (
//         <div className="d-flex align-items-center gap-2">
//           <div className="fw-semibold text-capitalize">
//             {e?.firstName} {e?.lastName}
//           </div>
//         </div>
//       ),
//       sortable: true,
//     },

//     {
//       key: "Email",
//       render: (e: any) => (
//         <div className="text-lowercase">{e?.email}</div>
//       ),
//       sortable: true,
//     },

//     {
//       key: "Role",
//       render: (e: any) => (
//         <span className="badge bg-primary text-capitalize">
//           {GetUserRoleName(e?.role?._id)}
//         </span>
//       ),
//       sortable: true,
//     },

//     {
//       key: "Status",
//       render: (e: any) => {
//         const statusName = GetUserStatusName(e?.status?.id);

//         return (
//           <>
//             {statusName === "Active" && (
//               <span className="badge bg-success text-capitalize">
//                 {statusName}
//               </span>
//             )}
//             {statusName === "Blocked" && (
//               <span className="badge bg-danger text-capitalize">
//                 {statusName}
//               </span>
//             )}
//             {statusName === "Pending" && (
//               <span className="badge bg-warning text-dark text-capitalize">
//                 {statusName}
//               </span>
//             )}
//             {statusName === "unknown" && (
//               <span className="badge bg-secondary text-capitalize">
//                 Unknown
//               </span>
//             )}
//           </>
//         );
//       },
//       sortable: true,
//     },
//   ];

//   return (
//     <>
//       <div className="page-wrapper" style={{ minHeight: 730 }}>
//         <div className="content container-fluid">
//           <div className="row justify-content-center">
//             <div className="col-xl-12  col-12">
//               <div className="card-header py-3 bg-gradient">
//                 <div className="row">
//                   <div className="col">
//                     <h4 className="card-title">Clients List</h4>
//                   </div>
//                   <div className="col-auto">
//                     <Link
//                       href="/dashboard/users/create"
//                       className=" btn btn-dark btn-sm"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width={24}
//                         height={24}
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="feather feather-plus me-2"
//                       >
//                         <line x1={12} y1={5} x2={12} y2={19} />
//                         <line x1={5} y1={12} x2={19} y2={12} />
//                       </svg>
//                       Add Client
//                     </Link>
//                   </div>
//                 </div>
//               </div>

//               <Table
//                 title="Users List "
//                 columns={columns}
//                 dataSource={data?.data ?? []}
//                 isLoading={isLoading}
//                 totalPages={totalPages}
//                 totalEntries={totalEntries}
//                 page={page}
//                 setPage={setPage}
//                 pageSize={pageSize}
//                 setPageSize={setPageSize}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
