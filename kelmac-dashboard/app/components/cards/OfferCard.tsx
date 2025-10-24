'use client';
import { FC } from 'react';
import Link from 'next/link';

interface OfferCardProps {
  _id: string;
  offerType: string;
  discountPercent: number;
  courseTitle?: string;
  validTill: string;
}

const OfferCard: FC<OfferCardProps> = ({
  _id,
  offerType,
  discountPercent,
  courseTitle,
  validTill,
}) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title text-primary">
            {offerType} Offer - {discountPercent}% Off
          </h5>
          {courseTitle && (
            <p className="text-muted mb-2">
              Related Course: <strong>{courseTitle}</strong>
            </p>
          )}
          <p className="text-secondary small">Valid Till: {new Date(validTill).toLocaleDateString()}</p>

          <Link href={`/offers/${_id}`} className="btn btn-outline-primary btn-sm mt-2">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
