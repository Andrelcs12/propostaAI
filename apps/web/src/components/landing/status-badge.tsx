type StatusBadgeProps = {
  children: React.ReactNode;
  muted?: boolean;
};

export function StatusBadge({ children, muted = false }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        muted
          ? "bg-secondary text-muted-foreground"
          : "border-primary/20 bg-primary/10 text-primary"
      }`}
    >
      {children}
    </span>
  );
}
