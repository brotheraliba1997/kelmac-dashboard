'use client';
// import { useCreateCourseMutation } from '@/store/api/courseApi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
  const router = useRouter();
//   const [createCourse, { isLoading }] = useCreateCourseMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    //   await createCourse({
    //     ...formData,
    //     price: Number(formData.price),
    //   }).unwrap();
      alert('✅ Course created successfully');
      router.push('/courses');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to create course');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-primary mb-4">Create New Course</h2>
      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Course Title</label>
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
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price ($)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        {/* <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Course'}
        </button> */}
      </form>
    </div>
  );
}
