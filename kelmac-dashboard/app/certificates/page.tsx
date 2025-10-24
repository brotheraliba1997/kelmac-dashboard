'use client';
import { useGetAllCertificatesQuery } from '@/store/api/certificateApi';
import CertificateCard from '@/components/cards/CertificateCard';

export default function CertificatesPage() {
  const { data: certificates, isLoading, isError } = useGetAllCertificatesQuery();

  if (isLoading) return <div className="text-center mt-5">Loading certificates...</div>;
  if (isError) return <div className="text-center text-danger mt-5">Failed to load certificates</div>;

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-primary text-center mb-4">My Certificates</h2>
      <div className="row">
        {certificates?.length > 0 ? (
          certificates.map((cert: any) => (
            <CertificateCard
              key={cert._id}
              _id={cert._id}
              courseTitle={cert.course?.title || 'Unknown Course'}
              certificateUrl={cert.certificateUrl}
              issuedDate={cert.createdAt}
            />
          ))
        ) : (
          <div className="text-center text-muted">No certificates available yet</div>
        )}
      </div>
    </div>
  );
}
