import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const chatAPI = createApi({
  reducerPath: "ChatAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["refetchChatRoom"],
  endpoints: (builder) => ({
    getAllChats: builder.query({
      query: () => ({
        url: `/chats/all`,
        method: "GET",
      }),
      invalidatesTags: ["refetchChatRoom"],
    }),

    getChatMessage: builder.mutation({
      query: (id) => ({
        url: `/chats/${id}/messages`,
        method: "GET",
      }),
    }),

    getMessagesByChatId: builder.mutation({
      query: ({ id }) => ({
        url: `/chats/${id}/messages`,
        method: "GET",
        // body: payload,
      }),
    }),

    sentMessage: builder.mutation({
      query: ({ payload, id }) => ({
        url: `/chats/${id}/messages`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetAllChatsQuery,
  useGetChatMessageMutation,
  useSentMessageMutation,
  useGetMessagesByChatIdMutation,
} = chatAPI;
