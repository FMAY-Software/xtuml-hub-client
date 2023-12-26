import { useEffect, useState } from "react";
import { Artifact } from "../../artifacts/model/artifact";

const useArtifacts = (criteria: string) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  useEffect(() => {
    setArtifacts([
      {
        name: "Test Artifact One",
        description: `The first artifact must always be the testing one.`,
      },
      {
        name: "Test Artifact Two",
        description: `The second artifact must always be the next testing one.`,
      },
    ]);
  }, []);

  const current = artifacts.filter(
    (artifact) =>
      criteria != "" &&
      artifact.name.toLowerCase().includes(criteria.toLowerCase())
  );
  return {
    artifacts: current,
  };
};

export default useArtifacts;
