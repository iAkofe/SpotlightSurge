import { z } from "zod";

const httpUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  });

const optionalHttpUrl = z.union([z.literal(""), httpUrl]).optional().default("");

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(200),
    category: z.string().trim().max(80).optional().default(""),
    excerpt: z.string().trim().max(280).optional().default(""),
    content: z.string().trim().min(20).max(12000),
    coverImage: optionalHttpUrl,
    isPublished: z.boolean().optional().default(true)
  }),
  params: z.object({}),
  query: z.object({})
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(200).optional(),
    category: z.string().trim().max(80).optional(),
    excerpt: z.string().trim().max(280).optional(),
    content: z.string().trim().min(20).max(12000).optional(),
    coverImage: z.union([z.literal(""), httpUrl]).optional(),
    isPublished: z.boolean().optional()
  }),
  params: z.object({ id: z.string().cuid() }),
  query: z.object({})
});
