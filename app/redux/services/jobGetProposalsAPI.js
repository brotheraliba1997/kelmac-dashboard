// import { createApi } from "@reduxjs/toolkit/query/react";
// import { baseQueryWithAuth } from "./api";

// export const JobGetProposalsAPI = createApi({
//   reducerPath: "JobGetProposalsAPI",
//   baseQuery: baseQueryWithAuth,
//   endpoints: (builder) => ({
//     tagTypes: ["refetchProposalsApi"],
//     getJobProposals: builder.query({
//       query: ({ page = 1, pageSize = 10, sort = "asc", id }) => ({
//         url: `/jobPosts/${id}/proposals`,
//         method: "GET",
//         params: { page, pageSize, sort, role: "client" },
//       }),
//       providesTags: ["refetchProposalsApi"],
//     }),
//   }),
// });

// export const { useGetJobProposalsQuery  } = JobGetProposalsAPI;
