/*
 * Consistent inline SVG icon set (24×24, stroke-based, currentColor).
 * Dependency-free — no icon library required.
 */

const ICONS = {
  logo: (
    <>
      <circle cx="10" cy="9.6" r="4" />
      <circle cx="16.4" cy="7" r="2.5" />
      <circle cx="16.8" cy="14.8" r="2.5" />
      <circle cx="7" cy="16.4" r="2.1" />
      <circle cx="8.6" cy="4.2" r="1.9" />
      <path d="M10 9.6L16.4 7M10 9.6L16.8 14.8M10 9.6L7 16.4M10 9.6L8.6 4.2" />
    </>
  ),
  dashboard: (
    <>
      <path d="M5 20h14M5 20V5" />
      <rect x="6.5" y="11" width="3.2" height="9" rx="1" />
      <rect x="11" y="8" width="3.2" height="12" rx="1" />
      <rect x="15.6" y="6" width="3.2" height="14" rx="1" />
    </>
  ),
  contacts: (
    <>
      <circle cx="12" cy="8" r="3" />
      <rect x="9.6" y="11.4" width="4.8" height="7.6" rx="2.4" />
    </>
  ),
  starred: (
    <path d="M12 6.8L13.4 10.1L16.9 10.4L14.2 12.7L15.1 16.2L12 14.3L8.9 16.2L9.8 12.7L7.1 10.4L10.7 10.1Z" fill="currentColor" stroke="none" />
  ),
  star: <path d="M12 6.8L13.4 10.1L16.9 10.4L14.2 12.7L15.1 16.2L12 14.3L8.9 16.2L9.8 12.7L7.1 10.4L10.7 10.1Z" />,
  users: (
    <>
      <circle cx="9.5" cy="7.2" r="2.6" />
      <rect x="7.3" y="9.8" width="3.4" height="7.2" rx="1.7" />
      <circle cx="16.5" cy="9.2" r="2.9" />
      <rect x="15" y="12" width="3.4" height="6" rx="1.7" />
    </>
  ),
  message: (
    <>
      <rect x="5.5" y="5.5" width="13" height="13" rx="2.6" />
      <path d="M8.4 10.2h7.2M8.4 14.4h7.2" />
    </>
  ),
  calendar: (
    <>
      <rect x="5" y="4.5" width="14" height="15" rx="1.6" />
      <circle cx="8.4" cy="5.8" r="1" />
      <circle cx="15.6" cy="5.8" r="1" />
      <path d="M10 7.2v9.6M14 7.2v9.6" />
    </>
  ),
  share: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <circle cx="5.4" cy="5.8" r="1.5" />
      <circle cx="18.6" cy="5.8" r="1.5" />
      <circle cx="12" cy="19.4" r="1.5" />
      <path d="M11 10.8L6.6 6.3M13 10.8L17.4 6.3M12 14.5V18.1" />
    </>
  ),
  settings: (
    <>
      <path d="M5.2 8.8h14M5.2 15h14" />
      <circle cx="9" cy="8.8" r="2.1" />
      <circle cx="16.4" cy="15" r="2.1" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  search: (
    <>
      <circle cx="10.6" cy="9.4" r="4.2" />
      <path d="M7.9 13.8l2.4.7" />
    </>
  ),
  bell: (
    <>
      <path d="M8.6 6h7M8.6 6l-1.8 3.4M15.6 6l1.8 3.4M6.8 9.4h10.4" />
      <circle cx="12" cy="14" r="1.4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 7.8v2.8M12 7.8v-2.8M16.2 12h2.6M7.8 12h-2.6M15.3 9l1.9-1.8M16.9 8.9l1.5 1.1M8.7 15l-1.9 1.8M7.1 15.1l-1.5-1.1M15.6 15.7l1.4 1.1M8.4 15.7l-1.4-1.1" />
    </>
  ),
  moon: <path d="M13.5 6.5A6.2 6.2 0 1 1 -5.4 9.4" />,
  monitor: (
    <>
      <rect x="5" y="3.5" width="14" height="10" rx="1.4" />
      <path d="M10 16.2h4M10 16.2l2 3M14 16.2l-2 3" />
    </>
  ),
  plus: <path d="M12 5.5v13M6.5 12h11" />,
  phone: (
    <>
      <path d="M9.9 3.7C6.3 5.1 5.5 5.7 5.8 7M9.9 3.7C13.5 5.1 14.3 5.7 14 7" />
      <path d="M5.8 7h8.2M9.9 7.4l-.6 2.6" />
    </>
  ),
  mail: <path d="M5.5 6h13M5.5 6l6 4.4M18.5 6l-6 4.4M5.5 10.4h13M5.5 10.4v7.4" />,
  whatsapp: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.9 9.3C7.8 10.1 7.4 10.4 7.6 11.2M9.9 9.3C12 10.1 12.4 10.4 12.2 11.2" />
      <path d="M7.6 11.2h4.6M10 11.5l-.4 1.8" />
    </>
  ),
  map: (
    <>
      <circle cx="9" cy="9" r="5.6" />
      <path d="M9 14.4L11.2 19.6 6.8 19.6Z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16M5.4 12h13.2" />
    </>
  ),
  pencil: (
    <>
      <path d="M5.8 5.8l12.6 12.6" />
      <path d="M18.4 18.4l2.3-2.3v-1.6Z" />
      <path d="M5.6 5.6v-1.9" />
    </>
  ),
  trash: (
    <>
      <rect x="6" y="8" width="12" height="10" rx="2" />
      <path d="M6.6 8.6h10.8" />
      <circle cx="8" cy="20.4" r="1.5" />
      <circle cx="16" cy="20.4" r="1.5" />
    </>
  ),
  x: <path d="M13.6 6.5l2.3-3.3M6.6 8.8l1.8 4.8" />,
  check: <path d="M7 14.5L12.4 16.9 14.8 21.6Z" />,
  chevronDown: <path d="M7 6.5L12 18.5 17 6.5" />,
  chevronRight: <path d="M6.5 6.5L18 12M18 12L6.5 17.5" />,
  chevronLeft: <path d="M17.5 6.5L6 12M6 12L17.5 17.5" />,
  arrowRight: <path d="M5.5 12h10M15.5 12l2.2-3.2v6.4Z" />,
  download: (
    <>
      <path d="M12 6v5.6M9.2 11.6h5.6M9.2 11.6l2.8 4.8M14.8 11.6l-2.8 4.8Z" />
      <path d="M5.5 19.6h13M5.5 12.6v7M18.5 12.6v7" />
    </>
  ),
  upload: (
    <>
      <path d="M12 18v-5.6M9.2 12.4h5.6M9.2 12.4l2.8-4.8M14.8 12.4l-2.8-4.8Z" />
      <path d="M5.5 11.4h13M5.5 4.4v7M18.5 4.4v7" />
    </>
  ),
  copy: (
    <>
      <rect x="6" y="8" width="12" height="8" rx="1.2" />
      <rect x="8.4" y="6" width="7.2" height="12" rx="1.2" />
    </>
  ),
  qr: (
    <>
      <rect x="5" y="5" width="4.4" height="4.4" />
      <rect x="14.6" y="5" width="4.4" height="4.4" />
      <rect x="5" y="14.6" width="4.4" height="4.4" />
      <path d="M6.4 6.4h2.2v2.2h-2.2ZM16 6.4h2.2v2.2h-2.2ZM6.4 16h2.2v2.2h-2.2Z" />
    </>
  ),
  grid: (
    <>
      <rect x="5.5" y="5.5" width="13" height="13" rx="1.2" />
      <path d="M5.5 12h13M12 5.5v13" />
    </>
  ),
  list: <path d="M5.8 6h6M5.8 12h13M5.8 18h13" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 6.6V17.4M12 12L16.4 8.6M12 12l-3.3-2.4" />
    </>
  ),
  heart: (
    <>
      <circle cx="9" cy="12" r="4" />
      <circle cx="15" cy="12" r="4" />
      <path d="M9.9 15.8L12 19.2M14.1 15.8L12 19.2" />
    </>
  ),
  briefcase: (
    <>
      <rect x="5.5" y="7.5" width="13" height="11.5" rx="1.8" />
      <path d="M8 20h7.6M8 16.4v4M15.6 16.4v4" />
      <path d="M9.4 13.2h5.2" />
    </>
  ),
  cap: <path d="M12 5L19 11.4 12 17.8 5 11.4ZM9.6 16.6h4.8" />,
  video: (
    <>
      <rect x="5.5" y="6" width="13" height="10" rx="1.2" />
      <circle cx="9.6" cy="11" r="2.4" />
      <circle cx="15.8" cy="10.4" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  link: <path d="M12 13.5h7.4v-6.5M12 13.5l7.4-3M18.6 9.6l-1.4-3.6" />,
  refresh: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 5.8a3.6 3.6 0 0 0 0 3.6" />
    </>
  ),
  alert: (
    <>
      <path d="M12 5L20 19.6 4 19.6Z" />
      <path d="M11.6 10.8v6" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="7.6" />
      <path d="M11.4 17.6V10.4M10.4 10.4h2.3" />
    </>
  ),
  home: (
    <>
      <path d="M5.5 12h13M5.5 12v6M18.5 12v6" />
      <path d="M5.5 12l6.5-6.5M18.5 12l-6.5-6.5" />
      <path d="M14.8 18v-3h3.4" />
    </>
  ),
  more: (
    <>
      <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  note: (
    <>
      <rect x="5.5" y="5.5" width="13" height="13" rx="1.3" />
      <path d="M7.6 9.4h8.8M7.6 15.2h8.8M17.2 7l1.8-1.8" />
    </>
  ),
  tag: (
    <>
      <rect x="5.5" y="6.5" width="13" height="11.4" rx="1.6" />
      <path d="M9 6.5l4-2.8M15 6.5l-4-2.8" />
    </>
  ),
  filter: (
    <>
      <path d="M8 6.5h8M8 6.5l4 3M16 6.5l-4 3M8 9.5h8" />
      <path d="M9.6 11.8h4.8" />
    </>
  ),
};

export function Icon({ name, size = 18, label, className }) {
  const body = ICONS[name];
  if (!body) return null;
  return (
    <svg
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' })}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {body}
    </svg>
  );
}