-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('FREE', 'PRO');

-- AlterTable User
ALTER TABLE "User" ADD COLUMN "plan" "UserPlan" NOT NULL DEFAULT 'FREE';
ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT;
ALTER TABLE "User" ADD COLUMN "stripeSubscriptionId" TEXT;
ALTER TABLE "User" ADD COLUMN "stripePriceId" TEXT;
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" TEXT;
ALTER TABLE "User" ADD COLUMN "subscriptionCurrentPeriodEnd" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "subscriptionCancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");
CREATE INDEX "User_stripeCustomerId_idx" ON "User"("stripeCustomerId");

-- CreateTable
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "stripeEventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeWebhookEvent_stripeEventId_key" ON "StripeWebhookEvent"("stripeEventId");
CREATE INDEX "StripeWebhookEvent_type_idx" ON "StripeWebhookEvent"("type");

-- AlterTable Proposal
ALTER TABLE "Proposal" ADD COLUMN "clientCity" TEXT;
ALTER TABLE "Proposal" ADD COLUMN "clientState" TEXT;
ALTER TABLE "Proposal" ADD COLUMN "companyResearchSnapshot" JSONB;
ALTER TABLE "Proposal" ADD COLUMN "companyResearchSources" JSONB;
ALTER TABLE "Proposal" ADD COLUMN "companyResearchConfirmedAt" TIMESTAMP(3);
ALTER TABLE "Proposal" ADD COLUMN "referenceProposalIds" JSONB;
ALTER TABLE "Proposal" ADD COLUMN "generationModel" TEXT;
ALTER TABLE "Proposal" ADD COLUMN "generationPromptVersion" TEXT;
ALTER TABLE "Proposal" ADD COLUMN "generatedAt" TIMESTAMP(3);
ALTER TABLE "Proposal" ADD COLUMN "quotaConsumedAt" TIMESTAMP(3);
ALTER TABLE "Proposal" ADD COLUMN "acceptedAt" TIMESTAMP(3);
ALTER TABLE "Proposal" ADD COLUMN "acceptedByName" TEXT;
ALTER TABLE "Proposal" ADD COLUMN "acceptedByEmail" TEXT;
ALTER TABLE "Proposal" ADD COLUMN "rejectedAt" TIMESTAMP(3);
ALTER TABLE "Proposal" ADD COLUMN "rejectionReason" TEXT;

-- Backfill quota for existing generated proposals
UPDATE "Proposal"
SET "quotaConsumedAt" = COALESCE("updatedAt", "createdAt")
WHERE "generatedContent" IS NOT NULL AND "quotaConsumedAt" IS NULL;
