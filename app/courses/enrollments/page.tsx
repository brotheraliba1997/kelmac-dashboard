'use client';
// import { useGetUserEnrollmentsQuery } from '@/store/api/enrollmentApi';
// import CourseCard from '@/components/cards/CourseCard';

export default function MyEnrollmentsPage() {
//   const { data, isLoading } = useGetUserEnrollmentsQuery();

//   if (isLoading) return <div className="text-center mt-5">Loading enrollments...</div>;

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-primary mb-4">My Enrolled Courses</h2>
      <div className="row">
        {/* {data?.length ? (
          data.map((enroll: any) => (
            <CourseCard
              key={enroll.course._id}
              title={enroll.course.title}
              description={enroll.course.description}
              instructor={enroll.course?.instructor?.name || 'N/A'}
              price={enroll.course.price}
            />
          ))
        ) : (
          <div className="text-muted text-center">No enrolled courses yet</div>
        )} */}
      </div>
    </div>
  );
}
