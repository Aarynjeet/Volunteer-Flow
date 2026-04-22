/**
 * VolunteerFlow mark — check in circle (completion + trust at small sizes).
 * 32×32, geometric, single-color via currentColor.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="16" cy="16" r="12.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.5 16.25 13.5 20.25 22.5 11.25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
