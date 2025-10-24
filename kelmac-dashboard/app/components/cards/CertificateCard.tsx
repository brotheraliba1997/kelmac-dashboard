'use client';
import { FC } from 'react';
import Link from 'next/link';

interface CertificateCardProps {
  _id: string;
  courseTitle: string;
  certificateUrl: string;
  issuedDate: string;
}

const CertificateCard: FC<CertificateCardProps> = ({
  _id,
  courseTitle,
  certificateUrl,
  issuedDate,
}) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title text-primary">{courseTitle}</h5>
          <p className="text-secondary small">Issued: {new Date(issuedDate).toLocaleDateString()}</p>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Link href={`/certificates/${_id}`} className="btn btn-outline-primary btn-sm">
              View Details
            </Link>
            <a
              href={certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-sm"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
