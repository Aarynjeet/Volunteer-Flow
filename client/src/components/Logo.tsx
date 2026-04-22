/**
 * VolunteerFlow monogram — V + F in a rounded square badge.
 * 36×36, two colors: teal #0F766E on #FFFFFF. Geometric fills, no shadows.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="0.5" y="0.5" width="35" height="35" rx="9" fill="#FFFFFF" stroke="#E2E8F0" />
      <g fill="#0F766E">
        <path d="M5 6h12.5v3H8v5.5h7.5v3H8V30H5V6z" />
        <path d="M15.5 30L20 9h2.5L27 30h-3l-1.6-6h-3.8L18.5 30h-3z" />
      </g>
    </svg>
  );
}
