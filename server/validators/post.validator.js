import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2).max(200),
    category: z.string().trim().max(80).optional().default(""),
    excerpt: z.string().trim().max(280).optional().default(""),
    content: z.string().trim().min(20).max(12000),
    coverImage: z.string().trim().url().optional().or(z.literal("")).default(""),
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
    coverImage: z.string().trim().url().optional().or(z.literal("")),
    isPublished: z.boolean().optional()
  }),
  params: z.object({ id: z.string().cuid() }),
  query: z.object({})
});
