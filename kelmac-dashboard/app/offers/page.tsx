'use client';
import { useGetAllOffersQuery } from '@/store/api/offerApi';
import OfferCard from '@/components/cards/OfferCard';

export default function OffersPage() {
  const { data: offers, isLoading, isError } = useGetAllOffersQuery();

  if (isLoading) return <div className="text-center mt-5">Loading offers...</div>;
  if (isError) return <div className="text-danger text-center mt-5">Failed to load offers</div>;

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-primary text-center mb-4">Available Offers</h2>
      <div className="row">
        {offers?.length > 0 ? (
          offers.map((offer: any) => (
            <OfferCard
              key={offer._id}
              _id={offer._id}
              offerType={offer.offerType}
              discountPercent={offer.discountPercent}
              courseTitle={offer?.course?.title}
              validTill={offer.validTill}
            />
          ))
        ) : (
          <div className="text-center text-muted">No active offers</div>
        )}
      </div>
    </div>
  );
}
