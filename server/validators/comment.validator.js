import { z } from "zod";

export const createBookCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(2).max(2000)
  }),
  params: z.object({ id: z.string().cuid() }),
  query: z.object({})
});

export const createPostCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(2).max(2000)
  }),
  params: z.object({ id: z.string().cuid() }),
  query: z.object({})
});
