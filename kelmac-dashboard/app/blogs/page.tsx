'use client';
// import { useGetAllBlogsQuery } from '@/store/api/blogApi';
// import BlogCard from '@/components/cards/BlogCard';

export default function BlogsPage() {
//   const { data: blogs, isLoading, isError } = useGetAllBlogsQuery();

//   if (isLoading) return <div className="text-center mt-5">Loading blogs...</div>;
//   if (isError) return <div className="text-center text-danger mt-5">Failed to load blogs</div>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-primary mb-4 text-center">All Blogs</h2>
      {/* <div className="row">
        {blogs?.length > 0 ? (
          blogs.map((blog: any) => (
            <BlogCard
              key={blog._id}
              _id={blog._id}
              title={blog.title}
              content={blog.content}
              author={blog?.author?.name || 'Unknown'}
            />
          ))
        ) : (
          <div className="text-center text-muted">No blogs found</div>
        )}
      </div> */}
    </div>
  );
}
