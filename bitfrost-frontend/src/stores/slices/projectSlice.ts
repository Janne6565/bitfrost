import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "@/@types/backendTypes.ts";

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: {},
  } as { projects: { [key: string]: Project } },
  reducers: {
    setProject: (state, action: PayloadAction<Project>) => {
      state.projects[action.payload.projectTag] = action.payload;
    },
    removeProject: (state, action: PayloadAction<string>) => {
      delete state.projects[action.payload];
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      action.payload.forEach((item) => {
        state.projects[item.projectTag] = item;
      });
    },
  },
});

const { setProject, removeProject, setProjects } = projectSlice.actions;

export { setProjects, setProject, removeProject };
export default projectSlice.reducer;
