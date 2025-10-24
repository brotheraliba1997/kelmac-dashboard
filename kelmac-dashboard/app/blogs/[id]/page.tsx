'use client';
import { useParams } from 'next/navigation';
// import { useGetBlogByIdQuery } from '@/store/api/blogApi';

export default function BlogDetailPage() {
  const { id } = useParams();
//   const { data: blog, isLoading, isError } = useGetBlogByIdQuery(id);

//   if (isLoading) return <div className="text-center mt-5">Loading blog...</div>;
//   if (isError) return <div className="text-danger text-center mt-5">Failed to load blog</div>;

  return (
    <div className="container mt-5">
      {/* <h2 className="fw-bold text-primary">{blog.title}</h2>
      <p className="text-muted">By {blog?.author?.name || 'Unknown'}</p>
      <hr />
      <p style={{ whiteSpace: 'pre-line' }}>{blog.content}</p> */}
    </div>
  );
}
