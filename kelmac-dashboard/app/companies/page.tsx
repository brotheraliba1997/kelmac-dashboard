'use client';
import { useGetAllCompaniesQuery } from '@/store/api/companyApi';
import CompanyCard from '@/components/cards/CompanyCard';

export default function CompaniesPage() {
  const { data: companies, isLoading, isError } = useGetAllCompaniesQuery();

  if (isLoading) return <div className="text-center mt-5">Loading companies...</div>;
  if (isError) return <div className="text-danger text-center mt-5">Failed to load companies</div>;

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-primary text-center mb-4">Corporate Dashboard</h2>
      <div className="row">
        {companies?.length > 0 ? (
          companies.map((comp: any) => (
            <CompanyCard
              key={comp._id}
              name={comp.name}
              region={comp.region}
              currency={comp.currency}
              employees={comp.employees?.length || 0}
              discount={comp.regionalDiscount}
            />
          ))
        ) : (
          <div className="text-center text-muted">No companies found</div>
        )}
      </div>
    </div>
  );
}
