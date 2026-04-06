import { z } from "zod";

const email = z.string().trim().email();
const password = z.string().min(8).max(100);
const website = z.union([z.literal(""), z.string().trim().url()]).optional().default("");

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email,
    password,
    accountType: z.enum(["reader", "author"]).default("reader"),
    bio: z.string().trim().max(1200).optional().default(""),
    location: z.string().trim().max(160).optional().default(""),
    website
  }),
  params: z.object({}),
  query: z.object({})
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1)
  }),
  params: z.object({}),
  query: z.object({})
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    bio: z.string().trim().max(1200).optional(),
    location: z.string().trim().max(160).optional(),
    website
  }),
  params: z.object({}),
  query: z.object({})
});

export const upgradeToAuthorSchema = z.object({
  body: z.object({
    bio: z.string().trim().max(1200).optional().default(""),
    location: z.string().trim().max(160).optional().default(""),
    website
  }),
  params: z.object({}),
  query: z.object({})
});
