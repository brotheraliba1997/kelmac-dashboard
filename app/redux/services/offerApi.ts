import { baseQueryWithAuth } from "./api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const offerApi = createApi({
  reducerPath: "offerApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder: any) => ({
    getAllOffers: builder.query({
      query: () => "/offers",
      providesTags: ["Offer"],
    }),

    getOfferById: builder.query({
      query: (id: any) => `/offers/${id}`,
      providesTags: ["Offer"],
    }),
  }),
});

export const { useGetAllOffersQuery, useGetOfferByIdQuery } = offerApi;
