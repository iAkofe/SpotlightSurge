import { z } from "zod";

const currentYear = new Date().getFullYear() + 1;

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(4000).optional().default(""),
    genre: z.string().trim().max(120).optional().default(""),
    purchaseLink: z.string().trim().max(2048).optional().default(""),
    snippet: z.string().trim().optional().default(""),
    publishedYear: z.preprocess(
      (value) => (value === "" || value === undefined ? null : Number(value)),
      z.number().int().min(1400).max(currentYear).nullable()
    )
  }),
  params: z.object({}),
  query: z.object({})
});
