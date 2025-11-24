"use client";
import {
  GetUserRoleName,
  GetUserStatusName,
} from "@/app/utils/getUserRoleName";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import DynamicTable, {
  Column,
  FilterConfig,
} from "@/app/components/table/DynamicTableTailwind";
import { useGetUsersQuery } from "@/app/redux/services/userApi";
import { useState } from "react";
import Link from "next/link";
export default function UsersPage() {
  // Filter state for table
  const [tableFilters, setTableFilters] = useState({
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

  // Always use the API response for users
  const users = Array.isArray(data?.data) && data.data;

  const columns = [
    {
      key: "client",
      label: "Client",
      render: (e: any) => (
        <div className="d-flex align-items-center gap-2">
          <div className="fw-semibold text-capitalize">
            {e?.firstName} {e?.lastName}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      render: (e: any) => <div className="text-lowercase">{e?.email}</div>,
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      render: (e: any) => (
        <span className="badge bg-primary text-capitalize">
          {GetUserRoleName(e?.role?.id || e?.role)}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (e: any) => {
        const statusName = GetUserStatusName(e?.status?.id || e?.status);
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
    {
      label: "Actions",
      render: (e: any) => (
        <div className="d-flex gap-3">
          <FaEye
            className="text-primary"
            style={{ cursor: "pointer" }}
            // onClick={() => handleView(e)}
            title="View"
          />

          <Link href={`/dashboard/users/${e?.id}`}>
            <FaEdit
              className="text-success"
              style={{ cursor: "pointer" }}
              // onClick={() => handleEdit(e)}
              title="Edit"
            />
          </Link>
          <FaTrash
            className="text-danger"
            style={{ cursor: "pointer" }}
            // onClick={() => handleDelete(e)}
            title="Delete"
          />
        </div>
      ),
    },
  ];
  console.log(isLoading, "data from users page==>", users);
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
        { value: "", label: "All" },
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
    },
    {
      key: "isDeleted",
      label: "Deleted",
      type: "select",
      options: [
        { value: "", label: "All" },
        { value: "true", label: "Deleted" },
        { value: "false", label: "Not Deleted" },
      ],
    },
    {
      key: "role",
      label: "Role",
      type: "select",
      options: [{ value: "", label: "All" }, ...roleOptions],
    },
  ];

  const handleUsersFilterChange = (filters: Record<string, any>) => {
    const filterKeys = Object.keys(filters);
    const shouldResetPage = filterKeys.some(
      (key) => key !== "page" && key !== "limit"
    );
    setTableFilters((prev) => ({
      ...prev,
      ...filters,
      page: shouldResetPage ? 1 : filters.page ?? prev.page,
      limit: filters.limit ?? prev.limit,
    }));
  };

  const handlePageChange = (page: number) => {
    setTableFilters((prev) => ({ ...prev, page }));
  };
  const handleLimitChange = (newLimit: number) => {
    setTableFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
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
            data
              ? {
                  total: data.totalItems,
                  currentPage: data.currentPage,
                  totalPages: data.totalPages,
                  pageSize: data.limit,
                  onPageChange: handlePageChange,
                  onPageSizeChange: handleLimitChange,
                  pageSizeOptions: [4, 10, 20, 50, 100],
                }
              : undefined
          }
          emptyMessage="No users found"
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
