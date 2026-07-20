import type { Metadata } from "next";
import { PublicPageHeader } from "@/components/layout/public-page-header";

export const metadata: Metadata = {
  title: "Proposta comercial",
  robots: { index: false, follow: false },
};

export default function PublicProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <PublicPageHeader />
      {children}
    </>
  );
}
