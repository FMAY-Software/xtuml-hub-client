import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Artifact } from "../../../artifacts/model/artifact";

const initialState: Artifact[] = [];

const stagingArtifactSlice = createSlice({
  name: "stagingArtifacts",
  initialState,
  reducers: {
    addArtifact: (state, action: PayloadAction<Artifact>) => {
      state.push(action.payload);
    },
    removeArtifact: (state, action: PayloadAction<Artifact>) => {
      const index = state.findIndex(
        (artifact) => artifact.name === action.payload.name
      );
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    updateArtifact: (state, action: PayloadAction<Artifact>) => {
      const index = state.findIndex(
        (artifact) =>
          artifact.name === action.payload.name ||
          artifact.name === action.payload.lastName
      );
      if (index !== -1) {
        // automatic write of last_modified
        action.payload.last_modified = new Date().toISOString();
        // replace item
        state.splice(index, 1, action.payload);
      }
    },
    updateArtifactModificationNoTimeUpdate: (
      state,
      action: PayloadAction<Artifact>
    ) => {
      const index = state.findIndex(
        (artifact) =>
          artifact.name === action.payload.name ||
          artifact.name === action.payload.lastName
      );
      if (index !== -1) {
        // replace item
        state.splice(index, 1, action.payload);
      }
    },
    clearArtifacts: (state) => {
      return [];
    },
  },
});

export const {
  addArtifact: addStagingArtifact,
  removeArtifact: removeStagingArtifact,
  updateArtifact: updateStagingArtifact,
  updateArtifactModificationNoTimeUpdate:
    updateArtifactModificationNoTimeUpdate,
  clearArtifacts: clearStagingArtifacts,
} = stagingArtifactSlice.actions;
export default stagingArtifactSlice.reducer;
