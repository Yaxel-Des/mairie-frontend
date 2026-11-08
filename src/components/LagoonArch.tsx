export default function LagoonArch({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 540"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <clipPath id="lagoon-arch">
          <path d="M16 540V210a204 204 0 0 1 408 0v330z" />
        </clipPath>
      </defs>

      <path d="M6 540V210a214 214 0 0 1 428 0v330" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />

      <g clipPath="url(#lagoon-arch)">
        <rect width="440" height="540" fill="#F5E6BC" />
        <circle cx="300" cy="256" r="98" fill="#EBD288" opacity="0.55" />
        <circle cx="300" cy="256" r="64" fill="#D4AF37" />

        <path d="M0 332C58 300 112 304 176 324V332z" fill="#0B5F3C" />
        <path d="M336 332c34-18 70-20 104-8v8z" fill="#0B5F3C" />

        <g fill="none" stroke="#2A1B18" strokeLinecap="round">
          <path d="M80 332C82 282 94 244 114 206" strokeWidth="7" />
          <path d="M148 332c2-28 8-50 16-70" strokeWidth="5" />
        </g>
        <g fill="none" stroke="#0B5F3C" strokeLinecap="round" strokeWidth="5">
          <path d="M114 206C94 197 76 205 62 223" />
          <path d="M114 206C102 187 84 181 66 185" />
          <path d="M114 206c6-21 22-31 44-29" />
          <path d="M114 206c18-7 40-3 54 13" />
          <path d="M114 206c0-15 2-29 12-41" />
          <path d="M164 262c-14-6-28-1-38 12" strokeWidth="4" />
          <path d="M164 262c-2-16 6-28 22-34" strokeWidth="4" />
          <path d="M164 262c14-8 30-4 40 8" strokeWidth="4" />
        </g>

        <rect y="332" width="440" height="208" fill="#0B5A8C" />
        <rect y="452" width="440" height="88" fill="#0A3C5C" />

        <g fill="#D4AF37" opacity="0.85">
          <rect x="262" y="342" width="76" height="5" rx="2.5" />
          <rect x="272" y="356" width="56" height="5" rx="2.5" />
          <rect x="283" y="370" width="34" height="5" rx="2.5" />
        </g>

        <g fill="none" stroke="#8DBFDD" strokeLinecap="round" strokeWidth="2" opacity="0.8">
          <path d="M30 352q14-6 28 0t28 0" />
          <path d="M360 348q14-6 28 0t28 0" />
          <path d="M60 470q18-7 36 0t36 0t36 0" />
          <path d="M250 488q18-7 36 0t36 0t36 0" />
          <path d="M20 510q18-7 36 0t36 0" />
        </g>

        <g fill="#2A1B18">
          <path d="M92 404c54 22 186 22 242-6l-10 14c-56 28-174 28-224 6z" />
          <path d="M334 398l14-17-4 19z" />
          <path d="M92 404l-10-14 20 11z" />
          <circle cx="212" cy="371" r="9" />
          <path d="M199 399c0-14 6-19 13-19s13 5 13 19z" />
          <path d="M268 420l12 14-9 4-11-12z" />
        </g>
        <path d="M232 380l40 42" stroke="#2A1B18" strokeLinecap="round" strokeWidth="4" fill="none" />
        <g fill="none" stroke="#8DBFDD" strokeLinecap="round" strokeWidth="2" opacity="0.7">
          <path d="M130 438q20-5 40 0t40 0" />
          <path d="M240 444q16-5 32 0t32 0" />
        </g>
      </g>

      <path d="M16 540V210a204 204 0 0 1 408 0v330" fill="none" stroke="#D4AF37" strokeWidth="3" />
    </svg>
  );
}
