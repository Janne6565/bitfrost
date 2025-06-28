import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Job } from "@/@types/backendTypes.ts";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: {},
  } as { jobs: { [key: string]: Job } },
  reducers: {
    setJob: (state, action: PayloadAction<Job>) => {
      state.jobs[action.payload.uuid] = action.payload;
    },
    removeJob: (state, action: PayloadAction<Job>) => {
      delete state.jobs[action.payload.uuid];
    },
    setJobs: (state, action: PayloadAction<Job[]>) => {
      action.payload.forEach((item) => {
        state.jobs[item.uuid] = item;
      });
    },
  },
});

const { setJobs, removeJob, setJob } = jobSlice.actions;
export { setJobs, removeJob, setJob };
export default jobSlice.reducer;
