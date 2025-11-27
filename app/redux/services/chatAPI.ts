import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

type ChatIdArg = string;

type MessagePayloadArgs = {
  id: string;
  payload: Record<string, unknown>;
};

export const chatAPI = createApi({
  reducerPath: "ChatAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["refetchChatRoom"],
  endpoints: (builder) => ({
    getAllChats: builder.query<unknown, void>({
      query: () => ({
        url: `/chats/all`,
        method: "GET",
      }),
      invalidatesTags: ["refetchChatRoom"],
    }),

    getChatMessage: builder.mutation<unknown, ChatIdArg>({
      query: (id) => ({
        url: `/chats/${id}/messages`,
        method: "GET",
      }),
    }),

    getMessagesByChatId: builder.mutation<unknown, { id: string }>({
      query: ({ id }) => ({
        url: `/chats/${id}/messages`,
        method: "GET",
        // body: payload,
      }),
    }),

    sentMessage: builder.mutation<unknown, MessagePayloadArgs>({
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
