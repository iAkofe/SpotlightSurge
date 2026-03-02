-- CreateTable
CREATE TABLE "Reader" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReaderRefreshToken" (
    "id" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReaderRefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reader_email_key" ON "Reader"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderRefreshToken_tokenHash_key" ON "ReaderRefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "ReaderRefreshToken_readerId_expiresAt_idx" ON "ReaderRefreshToken"("readerId", "expiresAt");

-- AddForeignKey
ALTER TABLE "ReaderRefreshToken" ADD CONSTRAINT "ReaderRefreshToken_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "Reader"("id") ON DELETE CASCADE ON UPDATE CASCADE;
