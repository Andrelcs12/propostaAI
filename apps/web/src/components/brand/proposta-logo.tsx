type PropostaLogoProps = {
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
};

export function PropostaLogo({
  className = "size-8",
  showWordmark = true,
  wordmarkClassName,
}: PropostaLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
      >
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="10"
          className="fill-[#0f766e]"
        />
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="10"
          fill="url(#proposta-logo-glow)"
          opacity="0.55"
        />
        <path
          d="M13 12h12a2 2 0 0 1 2 2v16a1 1 0 0 1-1.53.85L20 27.5l-5.47 3.35A1 1 0 0 1 13 30V12Z"
          fill="#ecfeff"
          opacity="0.95"
        />
        <path
          d="M16 16h8M16 20h8M16 24h5"
          stroke="#0f766e"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M27.5 11.5 29 13l-3.5 3.5L24 15l3.5-3.5Z"
          fill="#5eead4"
        />
        <circle cx="29.5" cy="10.5" r="1.2" fill="#99f6e4" />
        <defs>
          <linearGradient
            id="proposta-logo-glow"
            x1="8"
            y1="4"
            x2="34"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#14b8a6" />
            <stop offset="1" stopColor="#0f766e" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {showWordmark ? (
        <span
          className={
            wordmarkClassName ??
            "text-base font-semibold tracking-tight text-foreground"
          }
        >
          Proposta<span className="text-primary">AI</span>
        </span>
      ) : null}
    </span>
  );
}
