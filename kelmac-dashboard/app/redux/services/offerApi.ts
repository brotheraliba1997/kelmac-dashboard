import { baseApi } from './baseApi';

export const offerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOffers: builder.query({
      query: () => '/offers',
      providesTags: ['Offer'],
    }),

    getOfferById: builder.query({
      query: (id) => `/offers/${id}`,
      providesTags: ['Offer'],
    }),
  }),
});

export const { useGetAllOffersQuery, useGetOfferByIdQuery } = offerApi;
