/**
 * VolunteerFlow monogram — V then F (left to right) on a forest badge.
 * 36×36: field #2D6A4F (light) / #52B788 (dark), letterforms white.
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
      <rect
        x="0.5"
        y="0.5"
        width="35"
        height="35"
        rx="9"
        className="fill-[#2D6A4F] stroke-white/20 dark:fill-[#52B788]"
      />
      <text x="5" y="24" fontSize="16" fontWeight="800" fill="white">
        V
      </text>
      <text x="18" y="24" fontSize="16" fontWeight="800" fill="white">
        F
      </text>
    </svg>
  );
}
