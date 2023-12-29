import { useEffect } from "react";
import {
  useArtifactDispatch,
  useArtifactSelector,
} from "../../store/nodes/artifacts/artifactHooks";
import { get_artifacts } from "../../api/get_artifacts";
import { setArtifacts } from "../../store/nodes/artifacts/artifactSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../providers/firebase/firebase";
import { addStagingArtifact } from "../../store/nodes/artifacts/stagingArtifactSlice";

const useArtifacts = (criteria: string, staging: boolean) => {
  const artifacts = useArtifactSelector((state) => state.artifacts);
  const dispatch = useArtifactDispatch();
  const user = useAuthState(auth);
  const stagingArtifacts = useArtifactSelector((state) => state.staging);

  // initialize artifacts from DB
  useEffect(() => {
    get_artifacts().then(async (current) => {
      dispatch(setArtifacts(current));
      if (user) {
        await auth.currentUser?.reload();
        // setup all users artifacts in staging
        let toStage = current.filter((a) => a.owner === user[0]?.email);
        toStage = toStage.filter(
          (ts) => !stagingArtifacts.find((s) => s.artifactId === ts.artifactId)
        );
        toStage.forEach((s) => dispatch(addStagingArtifact(s)));
      }
    });
  }, []);

  let current = artifacts.filter(
    (artifact) =>
      criteria != "" &&
      artifact.name.toLowerCase().includes(criteria.toLowerCase())
  );
  if (staging) {
    current =
      criteria === ""
        ? stagingArtifacts
        : stagingArtifacts.filter(
            (artifact) =>
              criteria != "" &&
              artifact.name.toLowerCase().includes(criteria.toLowerCase())
          );
  }
  return {
    artifacts: current,
  };
};

export default useArtifacts;
