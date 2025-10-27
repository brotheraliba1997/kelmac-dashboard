'use client';
import { useState } from 'react';
// import { useCreateCompanyMutation } from '@/store/api/companyApi';
import { useRouter } from 'next/navigation';

export default function ManageCompanyPage() {
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    currency: '',
    regionalDiscount: '',
  });

  const router = useRouter();
  // const [createCompany, { isLoading }] = useCreateCompanyMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // try {
    //   await createCompany({
    //     ...formData,
    //     regionalDiscount: Number(formData.regionalDiscount),
    //   }).unwrap();
    //   alert('✅ Company created successfully');
    //   router.push('/companies');
    // } catch (err) {
    //   console.error(err);
    //   alert('❌ Failed to create company');
    // }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-primary mb-4">Manage Company</h2>
      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Region</label>
          <input
            type="text"
            name="region"
            className="form-control"
            value={formData.region}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Currency</label>
          <input
            type="text"
            name="currency"
            className="form-control"
            value={formData.currency}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Regional Discount (%)</label>
          <input
            type="number"
            name="regionalDiscount"
            className="form-control"
            value={formData.regionalDiscount}
            onChange={handleChange}
          />
        </div>

        {/* <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Create Company'}
        </button> */}
      </form>
    </div>
  );
}
