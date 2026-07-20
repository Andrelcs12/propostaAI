-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN "publicToken" TEXT;
ALTER TABLE "Proposal" ADD COLUMN "publicEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Proposal" ADD COLUMN "publishedAt" TIMESTAMP(3);
ALTER TABLE "Proposal" ADD COLUMN "firstViewedAt" TIMESTAMP(3);
ALTER TABLE "Proposal" ADD COLUMN "lastViewedAt" TIMESTAMP(3);
ALTER TABLE "Proposal" ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_publicToken_key" ON "Proposal"("publicToken");
CREATE INDEX "Proposal_publicToken_idx" ON "Proposal"("publicToken");
