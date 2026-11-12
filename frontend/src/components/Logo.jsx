// Logo.jsx — the Green Field Hospital mark: a clean medical cross whose
// upper-right arm cradles a fresh mint leaf. Original geometric
// construction used at every size — navbar, footer, favicon, assistant.

export function LogoMark({ size = 44, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Green Field Hospital logo"
    >
      <rect width="64" height="64" rx="14" fill="#145C45" />
      <rect x="28" y="13" width="9" height="38" rx="3.5" fill="#FFFFFF" />
      <rect x="13.5" y="27.5" width="38" height="9" rx="3.5" fill="#FFFFFF" />
      <path
        d="M45.5 10.5c7.2 0 11.6 4.4 11.6 10.4 0 6.9-6.4 11.3-13.5 10.9-.6-7 1-15.5 1.9-21.3z"
        fill="#B9E8D5"
      />
      <path
        d="M46.5 12.5c4.4 1.1 7.6 4.4 7.6 8.3 0 3.6-2.4 6.5-5.9 7.9"
        fill="none"
        stroke="#16866A"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AssistantMark({ size = 30, className = "" }) {
  // GreenCare AI glyph: the leaf-plus-signal mark that reads at tiny sizes.
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="GreenCare AI"
    >
      <rect x="8" y="8" width="32" height="32" rx="9" fill="#B9E8D5" />
      <path d="M24 34c0-7 4.2-11.6 10-12.4C33.6 27 30.6 31.4 24 34z" fill="#145C45" />
      <path d="M20 16.5c-4.6.5-7 3.5-7.2 7.5 2.1.2 4.9-.8 6-2.6-2 .8-3.4 1-4.6.7.7-2.3 2.4-4 5.8-4.4z" fill="#145C45" opacity="0.55" />
      <circle cx="17" cy="33" r="2.4" fill="#16866A" />
      <circle cx="24.5" cy="33.6" r="1.6" fill="#16866A" opacity="0.7" />
    </svg>
  );
}
