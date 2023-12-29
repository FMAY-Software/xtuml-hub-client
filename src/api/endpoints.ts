const urls = {
  dev: "http://localhost:3000/dev",
  production: "https://2zk0g4yr0l.execute-api.us-east-1.amazonaws.com/dev",
};
export const get_endpoint_url = (path: string) => {
  // @ts-ignore
  const mode = import.meta.env.MODE; // This will be "development" or "production"

  // Use the appropriate URL based on the mode
  const baseUrl = mode === "development" ? urls.dev : urls.production;

  return `${baseUrl}${path}`;
};
