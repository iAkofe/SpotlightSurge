-- Add READER role for the unified account model
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'Role' AND e.enumlabel = 'READER'
  ) THEN
    ALTER TYPE "Role" ADD VALUE 'READER';
  END IF;
END $$;

-- Rename Author table to User and align constraints/indexes
ALTER TABLE "Author" RENAME TO "User";
ALTER TABLE "User" RENAME CONSTRAINT "Author_pkey" TO "User_pkey";
ALTER INDEX "Author_email_key" RENAME TO "User_email_key";

-- Move author refresh tokens to userId
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_authorId_fkey";
ALTER TABLE "RefreshToken" RENAME COLUMN "authorId" TO "userId";
ALTER INDEX "RefreshToken_authorId_expiresAt_idx" RENAME TO "RefreshToken_userId_expiresAt_idx";
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Move reader refresh tokens into unified refresh token table
INSERT INTO "RefreshToken" ("id", "userId", "tokenHash", "expiresAt", "revokedAt", "createdAt")
SELECT rrt."id", rrt."readerId", rrt."tokenHash", rrt."expiresAt", rrt."revokedAt", rrt."createdAt"
FROM "ReaderRefreshToken" rrt
ON CONFLICT ("tokenHash") DO NOTHING;

-- Book foreign key now references User table
ALTER TABLE "Book" DROP CONSTRAINT "Book_authorId_fkey";
ALTER TABLE "Book" ADD CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Remove obsolete reader-only tables
DROP TABLE "ReaderRefreshToken";
DROP TABLE "Reader";
