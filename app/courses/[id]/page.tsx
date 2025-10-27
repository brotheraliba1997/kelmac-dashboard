'use client';
import { useParams } from 'next/navigation';
// import { useGetCourseByIdQuery } from '@/store/api/courseApi';
// import { useEnrollInCourseMutation } from '@/store/api/enrollmentApi';

export default function CourseDetail() {
  const { id } = useParams();
//   const { data: course, isLoading } = useGetCourseByIdQuery(id);
//   const [enrollInCourse, { isLoading: enrolling }] = useEnrollInCourseMutation();

  const handleEnroll = async () => {
    try {
    //   await enrollInCourse(id).unwrap();
      alert('✅ Enrolled successfully!');
    } catch (err) {
      alert('❌ Enrollment failed');
    }
  };

//   if (isLoading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      {/* <h2 className="text-primary">{course.title}</h2>
      <p className="text-muted">{course.description}</p>
      <h6>Instructor: {course?.instructor?.name || 'N/A'}</h6>
      <h5 className="mt-3">Price: ${course.price}</h5>

      <button onClick={handleEnroll} className="btn btn-success mt-4" disabled={enrolling}>
        {enrolling ? 'Enrolling...' : 'Enroll Now'}
      </button> */}
    </div>
  );
}
