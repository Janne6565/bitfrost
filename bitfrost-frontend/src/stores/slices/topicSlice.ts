import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Topic } from "@/@types/backendTypes.ts";

const topicSlice = createSlice({
  name: "tags",
  initialState: {
    topics: {},
  } as { topics: { [key: string]: Topic } },
  reducers: {
    setTopic: (state, action: PayloadAction<Topic>) => {
      state.topics[action.payload.uuid] = action.payload;
    },
    removeTopic: (state, action: PayloadAction<string>) => {
      delete state.topics[action.payload];
    },
    setTopics: (state, action: PayloadAction<Topic[]>) => {
      action.payload.forEach((item) => {
        state.topics[item.uuid] = item;
      });
    },
  },
});

const { setTopics, removeTopic, setTopic } = topicSlice.actions;

export { setTopic, setTopics, removeTopic };
export default topicSlice.reducer;
