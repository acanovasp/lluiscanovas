import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "2xwxn775",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Set to false for development, true for production
});
