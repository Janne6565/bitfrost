import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "@/@types/backendTypes.ts";

const ownedProjectSlice = createSlice({
  name: "ownedProjects",
  initialState: {
    ownedProjects: [],
  } as { ownedProjects: Project[] },
  reducers: {
    setOwnedProjects: (state, action: PayloadAction<Project[]>) => {
      state.ownedProjects = action.payload;
    },
    addOwnedProject: (state, action: PayloadAction<Project>) => {
      state.ownedProjects.push(action.payload);
    },
    removeOwedProject: (state, action: PayloadAction<string>) => {
      state.ownedProjects = state.ownedProjects.filter(
        (project) => project.projectTag !== action.payload,
      );
    },
  },
});

const { addOwnedProject, setOwnedProjects, removeOwedProject } =
  ownedProjectSlice.actions;
export { addOwnedProject, removeOwedProject, setOwnedProjects };
export default ownedProjectSlice.reducer;
