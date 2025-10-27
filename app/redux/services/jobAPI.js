import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const JobAPI = createApi({
  reducerPath: "jobAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "refetchJobs",
    "refetchJobsContracts",
    "refetchJobPost, refetchJobProposals",
  ],
  endpoints: (builder) => ({
    createJobPost: builder.mutation({
      query: (payload) => ({
        url: "/jobPosts",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["refetchJobs"],
    }),

    getJobPosts: builder.query({
      query: ({
        page = 1,
        pageSize = 10,
        sort = "asc",
        status = "Pending",
      }) => ({
        url: "/jobPosts",
        method: "GET",
        params: { page, pageSize, sort, role: "client", status },
      }),
      providesTags: ["refetchJobs"],
    }),
    findWork: builder.query({
      query: ({
        page = 1,
        pageSize = 10,
        sort = "asc",
        status = "Pending",
      }) => ({
        url: "/jobPosts",
        method: "GET",
        params: { page, pageSize: 20, sort, status },
      }),
      providesTags: ["refetchJobs"],

      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        if (
          currentCache.page !== newItems.page
          // &&
          // currentCache.pageSize !== newItems.pageSize
        )
          currentCache.data.push(...newItems.data);
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    getJobPostById: builder.query({
      query: (id) => ({
        url: `/jobPosts/${id}`,
        method: "GET",
      }),
      providesTags: ["refetchJobPost"],
    }),

    sendJobProposal: builder.mutation({
      query: ({ payload, id }) => ({
        url: `/jobPosts/${id}/proposals`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["refetchJobPost"],
    }),

    getJobProposals: builder.query({
      query: ({ page = 1, pageSize = 10, sort = "asc", id }) => ({
        url: `/jobPosts/${id}/proposals`,
        method: "GET",
        params: { page, pageSize, sort, role: "client" },
      }),
      providesTags: ["refetchJobProposals"],
    }),

    acceptJobProposal: builder.mutation({
      query: (id) => ({
        url: `/jobProposals/${id}/accept`,
        method: "GET",
      }),
      invalidatesTags: [
        "refetchJobProposals",
        "refetchJobsPosts",
        "refetchJobsContracts",
      ],
    }),

    getJobContracts: builder.query({
      query: ({
        page = 1,
        pageSize = 10,
        sort = "asc",
        status = "in_progress",
      }) => ({
        url: "/jobContracts",
        method: "GET",
        params: { page, pageSize, sort, status },
      }),
      providesTags: ["refetchJobsContracts"],
    }),

    getJobContractById: builder.query({
      query: (id) => ({
        url: `/jobContracts/${id}`,
        method: "GET",
      }),
      providesTags: ["refetchJobsContracts"],
    }),

    endCall: builder.mutation({
      query: (id) => ({
        url: `/jobContracts/${id}/endCall`,
        method: "GET",
      }),
    }),

    startCall: builder.mutation({
      query: (id) => ({
        url: `/jobContracts/${id}/startCall`,
        method: "GET",
      }),
    }),

    submitReview: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/jobContracts/${id}/review`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["refetchJobsContracts"],
    }),
  }),
});

export const {
  useGetJobPostsQuery,
  useFindWorkQuery,
  useCreateJobPostMutation,
  useGetJobPostByIdQuery,
  useSendJobProposalMutation,
  useGetJobProposalsQuery,
  useAcceptJobProposalMutation,
  useGetJobContractsQuery,
  useGetJobContractByIdQuery,
  useStartCallMutation,
  useEndCallMutation,
  useSubmitReviewMutation,
} = JobAPI;
