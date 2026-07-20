-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('COMPANY', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "ProposalTone" AS ENUM ('PROFESSIONAL', 'DIRECT', 'PERSUASIVE', 'FRIENDLY', 'PREMIUM');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'GENERATING', 'READY', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BillingType" AS ENUM ('FIXED', 'HOURLY', 'MONTHLY', 'PROJECT');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN "profileType" "ProfileType" NOT NULL DEFAULT 'COMPANY';
ALTER TABLE "Company" ADD COLUMN "defaultValidityDays" INTEGER NOT NULL DEFAULT 15;
ALTER TABLE "Company" ADD COLUMN "defaultDeliveryTime" TEXT;
ALTER TABLE "Company" ADD COLUMN "defaultPaymentConditions" TEXT;
ALTER TABLE "Company" ADD COLUMN "defaultCurrency" TEXT NOT NULL DEFAULT 'BRL';
ALTER TABLE "Company" ADD COLUMN "defaultBillingType" "BillingType" NOT NULL DEFAULT 'PROJECT';
ALTER TABLE "Company" ADD COLUMN "defaultIntroMessage" TEXT;
ALTER TABLE "Company" ADD COLUMN "defaultClosingMessage" TEXT;
ALTER TABLE "Company" ADD COLUMN "defaultTerms" TEXT;
ALTER TABLE "Company" ADD COLUMN "showDetailedValues" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Company" ADD COLUMN "showDiscount" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Company" ADD COLUMN "showContactData" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Company" ADD COLUMN "showSignature" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Company" ADD COLUMN "defaultTone" "ProposalTone" NOT NULL DEFAULT 'PROFESSIONAL';
ALTER TABLE "Company" ADD COLUMN "onboardingCompletedAt" TIMESTAMP(3);

-- Migrate footerText to defaultClosingMessage for existing records
UPDATE "Company" SET "defaultClosingMessage" = "footerText" WHERE "footerText" IS NOT NULL AND "defaultClosingMessage" IS NULL;

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "tone" "ProposalTone" NOT NULL DEFAULT 'PROFESSIONAL',
    "clientName" TEXT NOT NULL,
    "clientContactName" TEXT,
    "clientEmail" TEXT,
    "clientPhone" TEXT,
    "clientSegment" TEXT,
    "clientWebsite" TEXT,
    "clientDescription" TEXT,
    "clientProblem" TEXT,
    "title" TEXT NOT NULL,
    "serviceOffered" TEXT,
    "objective" TEXT,
    "scope" JSONB NOT NULL DEFAULT '[]',
    "deliverables" JSONB NOT NULL DEFAULT '[]',
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "investment" JSONB NOT NULL DEFAULT '[]',
    "paymentConditions" TEXT,
    "validityDate" TIMESTAMP(3),
    "observations" TEXT,
    "differentials" JSONB NOT NULL DEFAULT '[]',
    "nextSteps" TEXT,
    "terms" TEXT,
    "generatedContent" JSONB,
    "senderSnapshot" JSONB NOT NULL,
    "styleSnapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Proposal_userId_idx" ON "Proposal"("userId");

-- CreateIndex
CREATE INDEX "Proposal_companyId_idx" ON "Proposal"("companyId");

-- CreateIndex
CREATE INDEX "Proposal_status_idx" ON "Proposal"("status");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
