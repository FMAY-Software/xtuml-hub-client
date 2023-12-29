// store

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import artifactSlice from "./nodes/artifacts/artifactSlice";
import stagingArtifactSlice from "./nodes/artifacts/stagingArtifactSlice";

const persistConfig = {
  key: "xhub",
  storage,
};

const rootReducer = combineReducers({
  artifacts: artifactSlice,
  staging: stagingArtifactSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type Dispatch = typeof store.dispatch;

export default store;
