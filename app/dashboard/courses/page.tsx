"use client";

import DynamicTable, {
  Column,
  FilterConfig,
} from "@/app/components/table/DynamicTableTailwind";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/app/redux/services/courseApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CourseRow = {
  id?: string;
  title?: string;
  description?: string;
  instructor?: {
    firstName?: string;
    lastName?: string;
  };
  price?: number;
  sessions?: unknown[];
};

type CoursesApiResponse = {
  data?: CourseRow[];
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
};

export default function CoursesPage() {
  const router = useRouter();
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
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const apiResponse: CoursesApiResponse | undefined = data as
    | CoursesApiResponse
    | undefined;
  const courses = apiResponse?.data ?? [];
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const columns: Column<CourseRow>[] = [
    {
      key: "title",
      label: "Title",
      render: (course) => (
        <div className="font-semibold text-gray-900 capitalize">
          {course?.title}
        </div>
      ),
      sortable: true,
    },

    {
      key: "description",
      label: "Description",
      render: (course) => (
        <div className="text-gray-600 truncate" style={{ maxWidth: "250px" }}>
          {course?.description || "—"}
        </div>
      ),
      sortable: true,
    },

    {
      key: "instructor",
      label: "Instructor",
      render: (course) => (
        <div className="font-medium text-primary-600">
          {course?.instructor?.firstName
            ? `${course.instructor.firstName} ${course.instructor.lastName}`
            : "—"}
        </div>
      ),
      sortable: true,
    },

    {
      key: "price",
      label: "Price",
      render: (course) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
          ${Number(course?.price || 0).toFixed(2)}
        </span>
      ),
      sortable: true,
    },

    {
      key: "sessions",
      label: "Sessions",
      render: (course) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {course?.sessions?.length || 0} Sessions
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
  ];

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

  const handleCoursesFilterChange = (filters: Record<string, unknown>) => {
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
    setCurrentPage(page);
  };
  const handleLimitChange = (newLimit: number) => {
    setTableFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    setLimit(newLimit);
  };

  const handleAddCourse = () => router.push("/dashboard/courses/create");
  const handleViewCourse = (course: CourseRow) => {
    if (!course?.id) return;
    // router.push(`/dashboard/courses/${course.id}`);
  };
  const handleEditCourse = (course: CourseRow) => {
    if (!course?.id) return;
    router.push(`/dashboard/courses/edit/${course.id}`);
  };
  const handleDeleteCourse = async (course: CourseRow) => {
    if (!course?.id || isDeleting) return;
    const confirmed = window.confirm("Delete this course?");
    if (!confirmed) return;
    try {
      await deleteCourse(course.id).unwrap();
    } catch (err) {
      console.error("Failed to delete course", err);
    }
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
            apiResponse && apiResponse.totalItems
              ? {
                  total: apiResponse.totalItems,
                  currentPage: apiResponse.currentPage ?? currentPage,
                  totalPages: apiResponse.totalPages ?? 1,
                  pageSize: apiResponse.limit ?? limit,
                  onPageChange: handlePageChange,
                  onPageSizeChange: handleLimitChange,
                  pageSizeOptions: [4, 10, 20, 50, 100],
                }
              : {
                  total: courses.length,
                  currentPage,
                  totalPages: Math.max(1, Math.ceil(courses.length / limit)),
                  pageSize: limit,
                  onPageChange: handlePageChange,
                  onPageSizeChange: handleLimitChange,
                  pageSizeOptions: [4, 10, 20, 50, 100],
                }
          }
          emptyMessage="No courses found"
          onAdd={handleAddCourse}
          addButtonLabel="Add Course"
          onView={handleViewCourse}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
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
