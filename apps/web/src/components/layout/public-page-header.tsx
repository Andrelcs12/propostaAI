import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export function PublicPageHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between">
        <Logo />
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Proposta AI
        </Link>
      </div>
    </header>
  );
}
