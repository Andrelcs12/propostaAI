CREATE TYPE "CompanyVisualPreference" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

CREATE TYPE "CompanyFontPreference" AS ENUM ('INTER', 'MANROPE', 'POPPINS', 'DM_SANS');

CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tradeName" TEXT,
    "description" TEXT,
    "segment" TEXT,
    "website" TEXT,
    "commercialEmail" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "city" TEXT,
    "state" TEXT,
    "logoUrl" TEXT,
    "lightLogoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#0F766E',
    "secondaryColor" TEXT NOT NULL DEFAULT '#14B8A6',
    "accentColor" TEXT NOT NULL DEFAULT '#06B6D4',
    "visualPreference" "CompanyVisualPreference" NOT NULL DEFAULT 'LIGHT',
    "fontPreference" "CompanyFontPreference" NOT NULL DEFAULT 'INTER',
    "responsibleName" TEXT,
    "responsibleRole" TEXT,
    "document" TEXT,
    "address" TEXT,
    "presentationText" TEXT,
    "footerText" TEXT,
    "contactText" TEXT,
    "onboardingStep" INTEGER NOT NULL DEFAULT 1,
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
