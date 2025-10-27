'use client';
// import { useCreateBlogMutation } from '@/store/api/blogApi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBlogPage() {
  const router = useRouter();
//   const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    //   await createBlog(formData).unwrap();
      alert('✅ Blog created successfully');
      router.push('/blogs');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to create blog');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-primary mb-4">Create New Blog</h2>
      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            name="content"
            className="form-control"
            rows={6}
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        {/* <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Blog'}
        </button> */}
      </form>
    </div>
  );
}
