import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithAuth } from "./api";

type PaginationArgs = {
  page?: number;
  pageSize?: number;
  sort?: string;
  status?: string;
};

type FindWorkArgs = PaginationArgs;

type JobProposalPayload = {
  payload: Record<string, unknown>;
  id: string;
};

type JobProposalsQueryArgs = PaginationArgs & { id: string };

type ReviewPayload = {
  id: string;
  payload: Record<string, unknown>;
};

export const JobAPI = createApi({
  reducerPath: "jobAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "refetchJobs",
    "refetchJobsContracts",
    "refetchJobPost",
    "refetchJobProposals",
    "refetchJobsPosts",
  ],
  endpoints: (builder) => ({
    createJobPost: builder.mutation<unknown, Record<string, unknown>>({
      query: (payload) => ({
        url: "/jobPosts",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["refetchJobs"],
    }),

    getJobPosts: builder.query<unknown, PaginationArgs | void>({
      query: ({
        page = 1,
        pageSize = 10,
        sort = "asc",
        status = "Pending",
      }: PaginationArgs = {}) => ({
        url: "/jobPosts",
        method: "GET",
        params: { page, pageSize, sort, role: "client", status },
      }),
      providesTags: ["refetchJobs"],
    }),
    findWork: builder.query<unknown, FindWorkArgs | void>({
      query: ({
        page = 1,
        sort = "asc",
        status = "Pending",
      }: FindWorkArgs = {}) => ({
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
        const cache = currentCache as { page: number; data: any[] };
        const items = newItems as { page: number; data: any[] };
        if (
          cache.page !== items.page
          // &&
          // cache.pageSize !== items.pageSize
        )
          cache.data.push(...items.data);
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    getJobPostById: builder.query<unknown, string>({
      query: (id) => ({
        url: `/jobPosts/${id}`,
        method: "GET",
      }),
      providesTags: [{ type: "refetchJobPost" }],
    }),

    sendJobProposal: builder.mutation<unknown, JobProposalPayload>({
      query: ({ payload, id }) => ({
        url: `/jobPosts/${id}/proposals`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["refetchJobPost"],
    }),

    getJobProposals: builder.query<unknown, JobProposalsQueryArgs>({
      query: ({ page = 1, pageSize = 10, sort = "asc", id }) => ({
        url: `/jobPosts/${id}/proposals`,
        method: "GET",
        params: { page, pageSize, sort, role: "client" },
      }),
      providesTags: [{ type: "refetchJobProposals" }],
    }),

    acceptJobProposal: builder.mutation<unknown, string>({
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

    getJobContracts: builder.query<unknown, PaginationArgs | void>({
      query: ({
        page = 1,
        pageSize = 10,
        sort = "asc",
        status = "in_progress",
      }: PaginationArgs = {}) => ({
        url: "/jobContracts",
        method: "GET",
        params: { page, pageSize, sort, status },
      }),
      providesTags: ["refetchJobsContracts"],
    }),

    getJobContractById: builder.query<unknown, string>({
      query: (id) => ({
        url: `/jobContracts/${id}`,
        method: "GET",
      }),
      providesTags: ["refetchJobsContracts"],
    }),

    endCall: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/jobContracts/${id}/endCall`,
        method: "GET",
      }),
    }),

    startCall: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/jobContracts/${id}/startCall`,
        method: "GET",
      }),
    }),

    submitReview: builder.mutation<unknown, ReviewPayload>({
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
