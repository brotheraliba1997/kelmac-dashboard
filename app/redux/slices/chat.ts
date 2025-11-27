import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { chatAPI } from "../services/chatAPI";

type ChatMessage = {
  _id?: string;
  chat?: string;
  sender: { _id: string };
  lastMessage?: ChatMessage;
  isSending?: boolean;
  [key: string]: unknown;
};

type ChatItem = {
  _id: string;
  lastMessage?: ChatMessage;
  [key: string]: unknown;
};

export type ChatState = {
  messages: ChatMessage[];
  chats: ChatItem[];
  selectedChat: ChatItem | null;
  typing: ChatItem | null;
  isLoading?: boolean;
};

const initialState: ChatState = {
  messages: [],
  chats: [],
  selectedChat: null,
  typing: null,
  isLoading: false,
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMessageReducer: (state, action: PayloadAction<ChatMessage>) => {
      state.messages = [...state.messages, action.payload];
      state.chats = state.chats.map((item) =>
        item._id === action.payload.chat
          ? { ...item, lastMessage: action.payload }
          : item
      );
    },
    confirmOrReceiveMessage: (state, action: PayloadAction<ChatMessage>) => {
      const alreadyAdded = state.messages.find(
        (message) =>
          message.isSending && message.sender._id === action.payload.sender._id
      );

      if (alreadyAdded) {
        state.messages = state.messages.map((item) =>
          item.isSending && item.sender._id === action.payload.sender._id
            ? action.payload
            : item
        );
      } else {
        state.messages = [...state.messages, action.payload];
        state.chats = state.chats.map((item) =>
          item._id === action.payload.chat
            ? { ...item, lastMessage: action.payload }
            : item
        );
      }
    },
    selectChat: (state, action: PayloadAction<ChatItem | null>) => {
      state.selectedChat = action.payload;
    },
    typingChat: (state, action: PayloadAction<ChatItem | null>) => {
      state.typing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(chatAPI.endpoints.getAllChats.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        chatAPI.endpoints.getAllChats.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.chats = payload.data;
        }
      )
      .addMatcher(chatAPI.endpoints.getChatMessage.matchPending, (state) => {
        state.messages = [];
      })
      .addMatcher(
        chatAPI.endpoints.getChatMessage.matchFulfilled,
        (state, { payload }) => {
          state.messages = payload.data;
        }
      )
      .addMatcher(chatAPI.endpoints.getChatMessage.matchRejected, (state) => {
        state.messages = [];
      });
  },
});

export const {
  confirmOrReceiveMessage,
  sendMessageReducer,
  selectChat,
  typingChat,
} = slice.actions;

export default slice.reducer;
