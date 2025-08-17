import { combineReducers } from "@reduxjs/toolkit";

import { type TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "@/stores/index.ts";
import messageSlice from "./slices/messageSlice.ts";
import jobSlice from "./slices/jobSlice.ts";
import ownedProjectSlice from "./slices/ownedProjectSlice.tsx";
import projectSlice from "./slices/projectSlice.ts";
import topicSlice from "./slices/topicSlice.ts";
import subscriptionSlice from "./slices/subscriptionSlice.ts";

const appReducer = combineReducers({
  messageSlice,
  jobSlice,
  projectSlice,
  topicSlice,
  subscriptionSlice,
  ownedProjectSlice,
});

const rootReducer = appReducer;

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useTypedSelector };
export default rootReducer;
