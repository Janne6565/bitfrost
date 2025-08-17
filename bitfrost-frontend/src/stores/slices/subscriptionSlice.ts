import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Subscription } from "@/@types/backendTypes.ts";

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState: {
    subscriptions: {},
  } as { subscriptions: { [key: string]: Subscription } },
  reducers: {
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscriptions[action.payload.uuid] = action.payload;
    },
    removeSubscription: (state, action: PayloadAction<string>) => {
      delete state.subscriptions[action.payload];
    },
    setSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
      action.payload.forEach((item) => {
        state.subscriptions[item.uuid] = item;
      });
    },
  },
});

const { setSubscriptions, removeSubscription, setSubscription } =
  subscriptionSlice.actions;

export { setSubscription, setSubscriptions, removeSubscription };
export default subscriptionSlice.reducer;
