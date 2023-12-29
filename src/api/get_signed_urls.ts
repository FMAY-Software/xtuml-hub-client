import { get_endpoint_url } from "./endpoints";
import { SignedUrlResponse } from "./model/signed_url_response";

export const get_signed_urls = async (
  fileNames: string[],
  upload: boolean
): Promise<SignedUrlResponse> => {
  try {
    // Construct query parameters
    const queryParams = new URLSearchParams();
    fileNames.forEach((fileName) => queryParams.append("file_keys", fileName));

    // Append query parameters to the endpoint URL
    const endpointUrl = upload
      ? `${get_endpoint_url(
          "/artifacts/upload/urls"
        )}?${queryParams.toString()}`
      : `${get_endpoint_url(
          "/artifacts/download/urls"
        )}?${queryParams.toString()}`;

    const response = await fetch(endpointUrl);

    if (response.ok) {
      return (await response.json()) as SignedUrlResponse;
    } else {
      console.error(`Failed to fetch signed URLs. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching signed URLs: ${error}`);
  }

  // If there's an error or the response is not OK, return an empty object
  return {
    signed_urls: {},
  };
};
