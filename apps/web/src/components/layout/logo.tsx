import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-base font-semibold tracking-normal text-foreground"
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
        P
      </span>
      Proposta AI
    </Link>
  );
}
