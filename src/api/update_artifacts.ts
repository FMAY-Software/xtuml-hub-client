import { Artifact } from "../artifacts/model/artifact";
import { get_endpoint_url } from "./endpoints";

export const update_artifacts = async (
  artifacts: Artifact[]
): Promise<Record<string, string>> => {
  try {
    // Retrieve the endpoint URL for writing artifacts
    const endpointUrl = get_endpoint_url("/artifacts/update");

    // Send a POST request to the serverless endpoint
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ artifacts }),
    });

    // Check if the request was successful (status code 200)
    if (response.ok) {
      // Parse and return the entire response JSON
      const responseData = await response.json();
      return responseData;
    } else {
      // Handle the error based on the response status code
      console.error(`Failed to write artifacts. Status: ${response.status}`);
      throw new Error(`Failed to write artifacts. Status: ${response.status}`);
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error writing artifacts:", error);
    throw error;
  }
};
