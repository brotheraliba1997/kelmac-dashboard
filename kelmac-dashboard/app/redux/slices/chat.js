import { createSlice } from "@reduxjs/toolkit";
import { chatAPI } from "../services/chatAPI";

const initialState = {
  messages: [],
  chats: [],
  selectedChat: null,
  typing: null,
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMessageReducer: (state, action) => {
      state.messages = [...state.messages, action.payload];
      state.chats = state.chats.map((item) =>
        item._id === action.payload.chat
          ? { ...item, lastMessage: action.payload }
          : item
      );
    },
    confirmOrReceiveMessage: (state, action) => {
      const alreadyAdded = state.messages.find(
        (x) => x.isSending && x.sender._id == action.payload.sender._id
      );
      if (alreadyAdded) {
        state.messages = state.messages.map((item) =>
          item.isSending && item.sender._id == action.payload.sender._id
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

    selectChat: (state, action) => {
      state.selectedChat = action.payload;
    },

    typingChat: (state, action) => {
      state.typing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        chatAPI.endpoints.getAllChats.matchPending,
        (state, { payload }) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        chatAPI.endpoints.getAllChats.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;

          state.chats = payload.data;
        }
      )
      .addMatcher(chatAPI.endpoints.getChatMessage.matchPending, (state) => {
        state.messages = [];
        // state.selectedChat = null;
      })
      .addMatcher(
        chatAPI.endpoints.getChatMessage.matchFulfilled,
        (state, { payload }) => {
          state.messages = payload.data;
          // Corrected from 'tokens'
        }
      )
      .addMatcher(chatAPI.endpoints.getChatMessage.matchRejected, (state) => {
        state.messages = null;
      });
    // .addMatcher(
    //   chatAPI.endpoints.sentMessage.matchPending,
    //   (state, { payload }) => {
    //     state.messages = [...state.messages, { ...payload, isSending: true }];
    //     // Corrected from 'tokens'
    //   }
    // )
    // .addMatcher(
    //   chatAPI.endpoints.sentMessage.matchFulfilled,
    //   (state, { payload }) => {
    //     state.messages = [
    //       ...state.messages,
    //       { ...payload, isSending: false },
    //     ];
    //     // Corrected from 'tokens'
    //   }
    // );
  },
});

export const {
  confirmOrReceiveMessage,
  sendMessageReducer,
  selectChat,
  typingChat,
} = slice.actions;

export default slice.reducer;
