# SpotlightSurge Backend (Unified Auth + Social Login)

## Account behavior

- Signup supports choosing `reader` or `author`.
- Readers can upgrade to author at any time.
- Upgrade is one-way (`READER -> AUTHOR`) and cannot be reverted.
- Authors can access all reader-visible features.

## Tech stack

- Express API
- PostgreSQL + Prisma
- JWT access token + refresh cookie
- Google/Facebook OAuth via Passport
- Cloudinary uploads
- Zod validation + rate limiting + Pino logging

## Environment

Set `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required non-OAuth vars:

- `PORT`
- `CLIENT_ORIGIN`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ACCESS_TOKEN_TTL`
- `REFRESH_TOKEN_TTL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional OAuth vars (required only if you want that provider enabled):

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`
- `FACEBOOK_CALLBACK_URL`

## Setup

1. `npm install`
2. `npm run prisma:generate`
3. `npm run prisma:migrate`
4. `npm run dev:api`

## Main auth endpoints

- `POST /api/auth/register`
  - body: `name`, `email`, `password`, `accountType` (`reader` | `author`)
  - optional author fields: `bio`, `website`, `profileImage`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `POST /api/auth/upgrade-to-author` (reader-only, irreversible)
- `GET /api/auth/authors` (authenticated)

## Social auth endpoints

- `GET /api/auth/oauth/google`
- `GET /api/auth/oauth/google/callback`
- `GET /api/auth/oauth/facebook`
- `GET /api/auth/oauth/facebook/callback`

On success, backend redirects to:

- `${CLIENT_ORIGIN}/auth?accessToken=...`

## Book endpoints

- `POST /api/books` (author/admin only)
- `GET /api/books/me` (author/admin only)
- `GET /api/books` (authenticated users)
- `DELETE /api/books/:id` (owner author or admin)
