import { z } from "zod";

const currentYear = new Date().getFullYear() + 1;

const httpUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  });

const optionalHttpUrl = z.union([z.literal(""), httpUrl]).optional().default("");

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(4000).optional().default(""),
    genre: z.string().trim().max(120).optional().default(""),
    purchaseLink: optionalHttpUrl,
    snippet: z.string().trim().optional().default(""),
    publishedYear: z.preprocess(
      (value) => (value === "" || value === undefined ? null : Number(value)),
      z.number().int().min(1400).max(currentYear).nullable()
    )
  }),
  params: z.object({}),
  query: z.object({})
});
