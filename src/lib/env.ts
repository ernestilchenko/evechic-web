export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  publicApiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8010/api",
  serverApiUrl: process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8010/api",
};
