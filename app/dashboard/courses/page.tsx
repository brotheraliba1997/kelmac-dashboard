"use client";
import MainDashboard from "@/app/components/dashboard--component/MainDashboard-component";
import React, { use, useEffect, useState } from "react";
import Table from "@/app/components/table/index";
import Link from "next/link";
import { useGetUsersQuery } from "@/app/redux/services/userApi";
import {
  GetUserRoleName,
  GetUserStatusName,
} from "@/app/utils/getUserRoleName";

export default function CoursesPage() {
  const { data, error } = useGetUsersQuery({});

  console.log("data from users page==>", data?.data);
  const allUsers = [
    {
      id: 1,
      firstName: "Hamza",
      lastName: "Ali",
      email: "hamza@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      firstName: "Usman",
      lastName: "Khan",
      email: "usman@example.com",
      role: "Student",
      status: "Pending",
    },
    {
      id: 3,
      firstName: "Ali",
      lastName: "Raza",
      email: "ali.raza@example.com",
      role: "Instructor",
      status: "Active",
    },
    {
      id: 4,
      firstName: "Ahsan",
      lastName: "Qureshi",
      email: "ahsan.q@example.com",
      role: "Corporate",
      status: "Blocked",
    },
    {
      id: 5,
      firstName: "Taha",
      lastName: "Malik",
      email: "taha.malik@example.com",
      role: "Student",
      status: "Active",
    },
    {
      id: 6,
      firstName: "Bilal",
      lastName: "Shahid",
      email: "bilal.shahid@example.com",
      role: "Instructor",
      status: "Active",
    },
    {
      id: 7,
      firstName: "Zain",
      lastName: "Ahmad",
      email: "zain.ahmad@example.com",
      role: "Corporate",
      status: "Pending",
    },
    {
      id: 8,
      firstName: "Imran",
      lastName: "Khalid",
      email: "imran.k@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 9,
      firstName: "Saad",
      lastName: "Hassan",
      email: "saad.h@example.com",
      role: "Student",
      status: "Pending",
    },
    {
      id: 10,
      firstName: "Hassan",
      lastName: "Butt",
      email: "hassan.b@example.com",
      role: "Instructor",
      status: "Active",
    },
    {
      id: 11,
      firstName: "Nabeel",
      lastName: "Iqbal",
      email: "nabeel.i@example.com",
      role: "Corporate",
      status: "Blocked",
    },
  ];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const totalEntries = allUsers.length;
  const totalPages = Math.ceil(totalEntries / pageSize);

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = allUsers.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [page, pageSize]);

  const columns = [
    {
      displayName: "Client",
      displayField: (e: any) => (
        <div className="d-flex align-items-center gap-2">
          <div className="fw-semibold text-capitalize">
            {e?.firstName} {e?.lastName}
          </div>
        </div>
      ),
      searchable: true,
    },

    {
      displayName: "Email",
      displayField: (e: any) => (
        <div className="text-lowercase">{e?.email}</div>
      ),
      searchable: true,
    },

    {
      displayName: "Role",
      displayField: (e: any) => (
        <span className="badge bg-primary text-capitalize">
          {GetUserRoleName(e?.role?.id)}
        </span>
      ),
      searchable: true,
    },

    {
      displayName: "Status",
      displayField: (e: any) => {
        const statusName = GetUserStatusName(e?.status?.id);

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
      searchable: true,
    },
  ];

  return (
    <>
      <div className="page-wrapper" style={{ minHeight: 730 }}>
        <div className="content container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-12  col-12">
              <div className="card-header py-3 bg-gradient">
                <div className="row">
                  <div className="col">
                    <h4 className="card-title">Courses List</h4>
                  </div>
                  <div className="col-auto">
                    <Link
                      href="/dashboard/users/create"
                      className=" btn btn-dark btn-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-plus me-2"
                      >
                        <line x1={12} y1={5} x2={12} y2={19} />
                        <line x1={5} y1={12} x2={19} y2={12} />
                      </svg>
                      Add Courses
                    </Link>
                  </div>
                </div>
              </div>

              <Table
                title="Courses List "
                columns={columns}
                dataSource={data?.data ?? []}
                isLoading={isLoading}
                totalPages={totalPages}
                totalEntries={totalEntries}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
