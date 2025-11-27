import { baseQueryWithAuth } from "./api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const offerApi = createApi({
  reducerPath: "offerApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getAllOffers: builder.query<unknown, void>({
      query: () => "/offers",
      providesTags: ["Offer"],
    }),

    getOfferById: builder.query<unknown, string>({
      query: (id) => `/offers/${id}`,
      providesTags: ["Offer"],
    }),
  }),
});

export const { useGetAllOffersQuery, useGetOfferByIdQuery } = offerApi;
