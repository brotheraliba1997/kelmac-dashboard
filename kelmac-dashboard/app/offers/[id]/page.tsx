'use client';
import { useParams } from 'next/navigation';
// import { useGetOfferByIdQuery } from '@/store/api/offerApi';
import Link from 'next/link';

export default function OfferDetailPage() {
  const { id } = useParams();
  // const { data: offer, isLoading, isError } = useGetOfferByIdQuery(id);

  // if (isLoading) return <div className="text-center mt-5">Loading offer...</div>;
  // if (isError) return <div className="text-danger text-center mt-5">Failed to load offer</div>;

  return (
    <div className="container mt-5">
      {/* <h2 className="fw-bold text-primary mb-3">
        {offer.offerType} Offer - {offer.discountPercent}% Off
      </h2>

      {offer?.course && (
        <p className="mb-2">
          <strong>Course:</strong>{' '}
          <Link href={`/courses/${offer.course._id}`} className="text-decoration-none">
            {offer.course.title}
          </Link>
        </p>
      )}

      {offer?.user && (
        <p>
          <strong>User-Specific:</strong> {offer.user.name}
        </p>
      )}

      <p>
        <strong>Valid Till:</strong> {new Date(offer.validTill).toLocaleDateString()}
      </p>

      <div className="mt-4">
        <Link href="/offers" className="btn btn-outline-secondary me-2">
          Back to Offers
        </Link>
        {offer.course && (
          <Link href={`/courses/${offer.course._id}`} className="btn btn-success">
            Enroll with Offer
          </Link>
        )} */}
      {/* </div> */}
    </div>
  );
}
