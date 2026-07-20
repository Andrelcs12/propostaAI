import Link from "next/link";
import { PropostaLogo } from "@/components/brand/proposta-logo";

type LogoProps = {
  href?: string;
  showWordmark?: boolean;
};

export function Logo({ href = "/", showWordmark = true }: LogoProps) {
  const content = (
    <PropostaLogo
      className="size-8"
      showWordmark={showWordmark}
      wordmarkClassName="text-base font-semibold tracking-tight text-foreground"
    />
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="inline-flex cursor-pointer transition-opacity hover:opacity-90">
      {content}
    </Link>
  );
}
