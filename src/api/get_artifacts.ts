import { Artifact } from "../artifacts/model/artifact";
import { get_endpoint_url } from "./endpoints";

export const get_artifacts = async (): Promise<Artifact[]> => {
  try {
    const response = await fetch(get_endpoint_url("/artifacts"));

    if (response.ok) {
      const data = await response.json();
      return data.artifacts;
    } else {
      console.error(`Failed to fetch artifacts. Status: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching artifacts: ${error}`);
    return [];
  }
};
