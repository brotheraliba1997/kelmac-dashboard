'use client';
import { useParams } from 'next/navigation';
import { useGetCertificateByIdQuery } from '@/store/api/certificateApi';
import Link from 'next/link';

export default function CertificateDetailPage() {
  const { id } = useParams();
  const { data: certificate, isLoading, isError } = useGetCertificateByIdQuery(id);

  if (isLoading) return <div className="text-center mt-5">Loading certificate...</div>;
  if (isError) return <div className="text-danger text-center mt-5">Failed to load certificate</div>;

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-primary mb-3">
        Certificate for {certificate.course?.title || 'Unknown Course'}
      </h2>

      <p className="text-muted">Issued to: {certificate.user?.name || 'N/A'}</p>
      <p className="text-secondary small">
        Issued On: {new Date(certificate.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-4">
        <iframe
          src={certificate.certificateUrl}
          width="100%"
          height="600px"
          className="border rounded"
        />
      </div>

      <div className="mt-4 d-flex gap-2">
        <a
          href={certificate.certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success"
        >
          Download PDF
        </a>
        <Link href="/certificates" className="btn btn-outline-secondary">
          Back to Certificates
        </Link>
      </div>
    </div>
  );
}
