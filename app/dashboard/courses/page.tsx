"use client";
import MainDashboard from "@/app/components/dashboard--component/MainDashboard-component";
import React, { use, useEffect, useState } from "react";
import Table from "@/app/components/table/index";
import Link from "next/link";
import {
  GetUserRoleName,
  GetUserStatusName,
} from "@/app/utils/getUserRoleName";
import { useGetAllCoursesQuery } from "@/app/redux/services/courseApi";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
// import DynamicTableTailwind from "@/app/components/table/DynamicTableTailwind";
import DynamicTable, {
  Column,
  FilterConfig,
} from "@/app/components/table/DynamicTableTailwind";
export default function CoursesPage() {
  // Filter state for table
  const [tableFilters, setTableFilters] = useState({
    search: "",
    isPublished: "",
    isFeatured: "",
    language: "",
    skillLevel: "",
    minRating: "",
    maxPrice: "",
    minPrice: "",
    topic: "",
    category: "",
    limit: 20,
    page: 1,
  });

  const { data, error, isLoading } = useGetAllCoursesQuery(tableFilters);
  console.log("data from courses page==>", data);

  const courses = (data as any)?.data || data || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  // const totalEntries = courses.length;
  // const totalPages = Math.ceil(totalEntries / pageSize);

  // const indexOfLastItem = page * pageSize;
  // const indexOfFirstItem = indexOfLastItem - pageSize;
  // const currentData = courses.slice(indexOfFirstItem, indexOfLastItem);

  // useEffect(() => {
  //   setIsLoading(true);
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 700);
  //   return () => clearTimeout(timer);
  // }, [page, pageSize]);

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (e: any) => (
        <div className="fw-semibold text-capitalize">{e?.title}</div>
      ),
      sortable: true,
    },

    {
      key: "description",
      label: "Description",
      render: (e: any) => (
        <div className="text-muted text-truncate" style={{ maxWidth: "250px" }}>
          {e?.description || "—"}
        </div>
      ),
      sortable: true,
    },

    {
      key: "instructor",
      label: "Instructor",
      render: (e: any) => (
        <div className="fw-medium text-primary">
          {e?.instructor?.firstName
            ? `${e.instructor.firstName} ${e.instructor.lastName}`
            : e?.instructor || "—"}
        </div>
      ),
      sortable: true,
    },

    {
      key: "price",
      label: "Price",
      render: (e: any) => (
        <span className="badge bg-info">
          ${Number(e?.price || 0).toFixed(2)}
        </span>
      ),
      sortable: true,
    },

    {
      key: "sessions",
      label: "Sessions",
      render: (e: any) => (
        <span className="badge bg-secondary">
          {e?.sessions?.length || 0} Sessions
        </span>
      ),
      sortable: false,
    },

    // {
    //   label: "Status",
    //   render: (e: any) =>
    //     e?.isPublished ? (
    //       <span className="badge bg-success">Published</span>
    //     ) : (
    //       <span className="badge bg-warning text-dark">Draft</span>
    //     ),
    //   sortable: true,
    // },

    // {
    //   label: "Actions",
    //   render: (e: any) => (
    //     <div className="d-flex gap-3">
    //       <FaEye
    //         className="text-primary"
    //         style={{ cursor: "pointer" }}
    //         // onClick={() => handleView(e)}
    //         title="View"
    //       />

    //       <Link href={`/dashboard/courses/${e?.id}`}>
    //         <FaEdit
    //           className="text-success"
    //           style={{ cursor: "pointer" }}
    //           // onClick={() => handleEdit(e)}
    //           title="Edit"
    //         />
    //       </Link>
    //       <FaTrash
    //         className="text-danger"
    //         style={{ cursor: "pointer" }}
    //         // onClick={() => handleDelete(e)}
    //         title="Delete"
    //       />
    //     </div>
    //   ),
    // },
  ];
  //  const [statusFilter, setStatusFilter] = useState("");

  // Table filter configs
  const coursesFilters: FilterConfig[] = [
    {
      key: "search",
      label: "Search",
      type: "text",
      placeholder: "Search courses...",
    },
    {
      key: "isPublished",
      label: "Published",
      type: "select",
      options: [
        { value: "", label: "All" },
        { value: "true", label: "Published" },
        { value: "false", label: "Draft" },
      ],
    },
    {
      key: "isFeatured",
      label: "Featured",
      type: "select",
      options: [
        { value: "", label: "All" },
        { value: "true", label: "Featured" },
        { value: "false", label: "Not Featured" },
      ],
    },
    {
      key: "language",
      label: "Language",
      type: "text",
      placeholder: "e.g. en",
    },
    {
      key: "skillLevel",
      label: "Skill Level",
      type: "text",
      placeholder: "e.g. beginner",
    },
    { key: "minRating", label: "Min Rating", type: "text", placeholder: "0-5" },
    {
      key: "minPrice",
      label: "Min Price",
      type: "text",
      placeholder: "Min price",
    },
    {
      key: "maxPrice",
      label: "Max Price",
      type: "text",
      placeholder: "Max price",
    },
    { key: "topic", label: "Topic", type: "text", placeholder: "e.g. React" },
    {
      key: "category",
      label: "Category",
      type: "text",
      placeholder: "e.g. Web Dev",
    },
  ];

  // Table filter change handler
  const handleCoursesFilterChange = (filters: Record<string, any>) => {
    // Only reset page if filters other than page/limit are changed
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

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setTableFilters((prev) => ({ ...prev, page }));
    setCurrentPage(page);
  };
  const handleLimitChange = (newLimit: number) => {
    setTableFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    setLimit(newLimit);
  };

  return (
    <div className="page-wrapper" style={{ minHeight: 730 }}>
      <div className="content container-fluid">
        <DynamicTable
          data={courses || []}
          columns={columns}
          loading={isLoading}
          pageTitle="Courses Management"
          error={error ? "Error loading courses. Please try again." : null}
          searchPlaceholder="Search by title, instructor, or description..."
          searchKeys={[
            "title",
            "description",
            "instructor.firstName",
            "instructor.lastName",
          ]}
          filters={coursesFilters}
          onFilterChange={handleCoursesFilterChange}
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
          emptyMessage="No courses found"
        />
      </div>
    </div>
  );
  // return (
  //   <>
  //     <div className="page-wrapper" style={{ minHeight: 730 }}>
  //       <div className="content container-fluid">
  //         <div className="row justify-content-center">
  //           <div className="col-xl-12  col-12">
  //             <div className="card-header py-3 bg-gradient">
  //               <div className="row">
  //                 <div className="col">
  //                   <h4 className="card-title">Courses List</h4>
  //                 </div>
  //                 <div className="col-auto">
  //                   <Link
  //                     href="/dashboard/courses/create"
  //                     className=" btn btn-dark btn-sm"
  //                   >
  //                     <svg
  //                       xmlns="http://www.w3.org/2000/svg"
  //                       width={24}
  //                       height={24}
  //                       viewBox="0 0 24 24"
  //                       fill="none"
  //                       stroke="currentColor"
  //                       strokeWidth={2}
  //                       strokeLinecap="round"
  //                       strokeLinejoin="round"
  //                       className="feather feather-plus me-2"
  //                     >
  //                       <line x1={12} y1={5} x2={12} y2={19} />
  //                       <line x1={5} y1={12} x2={19} y2={12} />
  //                     </svg>
  //                     Add Courses
  //                   </Link>
  //                 </div>
  //               </div>
  //             </div>

  //             <Table
  //               title="Courses List "
  //               columns={columns}
  //               dataSource={currentData}
  //               isLoading={isLoading}
  //               totalPages={totalPages}
  //               totalEntries={totalEntries}
  //               page={page}
  //               setPage={setPage}
  //               pageSize={pageSize}
  //               setPageSize={setPageSize}
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
}
