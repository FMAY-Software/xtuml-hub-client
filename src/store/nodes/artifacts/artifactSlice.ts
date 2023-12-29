import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Artifact } from "../../../artifacts/model/artifact";

export interface HubState {
  artifacts: Artifact[];
}

const initialState: Artifact[] = [];

const artifactSlice = createSlice({
  name: "artifacts",
  initialState,
  reducers: {
    setArtifacts: (state, action: PayloadAction<Artifact[]>) => {
      return action.payload;
    },
    clearArtifacts: (state) => {
      state = [];
    },
  },
});

export const { setArtifacts, clearArtifacts } = artifactSlice.actions;
export default artifactSlice.reducer;
