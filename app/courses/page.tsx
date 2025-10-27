'use client';
// import { useGetAllCoursesQuery } from '@/store/api/courseApi';
// import CourseCard from '@/components/cards/CourseCard';

export default function CoursesPage() {
//   const { data: courses, isLoading, isError } = useGetAllCoursesQuery();

//   if (isLoading) return <div className="text-center mt-5">Loading courses...</div>;
//   if (isError) return <div className="text-center text-danger mt-5">Failed to load courses</div>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4 text-center text-primary">All Courses</h2>
      {/* <div className="row">
        {courses?.length > 0 ? (
          courses.map((course: any) => (
            <CourseCard
              key={course._id}
              title={course.title}
              description={course.description}
              instructor={course?.instructor?.name || 'N/A'}
              price={course.price}
            />
          ))
        ) : (
          <div className="text-center text-muted">No courses available</div>
        )}
      </div> */}
    </div>
  );
}
