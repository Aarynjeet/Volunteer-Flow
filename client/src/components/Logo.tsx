/**
 * VolunteerFlow monogram — V then F (left to right) on a teal badge.
 * 36×36: field #0F766E, letterforms white.
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
      <rect x="0.5" y="0.5" width="35" height="35" rx="9" fill="#0F766E" stroke="rgb(255 255 255 / 0.2)" />
      <text x="4" y="26" fontSize="18" fontWeight="800" fill="white">
        V
      </text>
      <text x="18" y="26" fontSize="18" fontWeight="800" fill="white">
        F
      </text>
    </svg>
  );
}
