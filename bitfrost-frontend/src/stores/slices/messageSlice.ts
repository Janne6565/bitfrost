import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "@/@types/backendTypes.ts";

const messageSlice = createSlice({
  name: "jobs",
  initialState: {
    messages: {},
  } as { messages: { [key: string]: Message } },
  reducers: {
    setMessage: (state, action: PayloadAction<Message>) => {
      state.messages[action.payload.uuid] = action.payload;
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      delete state.messages[action.payload];
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      action.payload.forEach((item) => {
        state.messages[item.uuid] = item;
      });
    },
  },
});

const { setMessages, removeMessage, setMessage } = messageSlice.actions;
export { setMessages, removeMessage, setMessage };
export default messageSlice.reducer;
