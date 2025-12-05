import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export interface Location {
  id?: string;
  country: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
  locationImage?: string; // base64 or url
}

export interface LocationResponse {
  data: Location[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface LocationQueryParams {
  currency?: string;
  countryCode?: string;
  country?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Location"],
  endpoints: (builder) => ({
    getLocations: builder.query<LocationResponse, LocationQueryParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params && typeof params === "object") {
          if (params.currency) searchParams.append("currency", params.currency);
          if (params.countryCode)
            searchParams.append("countryCode", params.countryCode);
          if (params.country) searchParams.append("country", params.country);
          if (params.search) searchParams.append("search", params.search);
          if (params.limit) searchParams.append("limit", String(params.limit));
          if (params.page) searchParams.append("page", String(params.page));
        }
        const queryString = searchParams.toString();
        return `/location${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Location" as const,
                id: id || "UNKNOWN",
              })),
              { type: "Location", id: "LIST" },
            ]
          : [{ type: "Location", id: "LIST" }],
    }),
    createLocation: builder.mutation<Location, Partial<Location>>({
      query: (body) => ({
        url: "/location",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Location", id: "LIST" }],
    }),
    uploadLocationImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "/location/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useCreateLocationMutation,
  useUploadLocationImageMutation,
} = locationApi;
