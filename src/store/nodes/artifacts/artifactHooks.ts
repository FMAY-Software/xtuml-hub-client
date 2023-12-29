// hooks

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, Dispatch } from "../../xhub";

export const useArtifactDispatch = () => useDispatch<Dispatch>();
export const useArtifactSelector: TypedUseSelectorHook<RootState> = useSelector;
