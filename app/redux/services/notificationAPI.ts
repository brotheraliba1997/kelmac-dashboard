import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithAuth } from "./api";

type NotificationQueryArgs = {
  page?: number;
  pageSize?: number;
};

export const NotificationAPI = createApi({
  reducerPath: "notificationAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["refetchNotification"],
  endpoints: (builder) => ({
    getNotificationAPI: builder.query<unknown, NotificationQueryArgs | void>({
      query: ({ page = 1 }: NotificationQueryArgs = {}) => ({
        url: `/notifications/`,
        method: "GET",
        params: { page, limit: 6 },
      }),

      providesTags: ["refetchNotification"],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      // merge: (currentCache, newItems) => {
      //   currentCache.data.push(...newItems.data);
      // },


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

    updateNotification: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
  
    }),
  }),
});

export const { useGetNotificationAPIQuery, useUpdateNotificationMutation } =
  NotificationAPI;
