import { z } from "zod";

export const idParamSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().cuid()
  })
});
