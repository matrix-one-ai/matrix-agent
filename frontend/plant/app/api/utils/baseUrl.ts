/**
 * Get the base URL of the application
 * @returns The base URL of the application
 */
export function getBaseUrl() {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://plant.fun";
}
