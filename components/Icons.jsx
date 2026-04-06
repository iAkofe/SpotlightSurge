"use client";

function IconBase({ children, className, size = "1em", stroke = "currentColor", fill = "none", ...props }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill={fill}
      height={size}
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {children}
    </svg>
  );
}

function FeatherIcon(props) {
  return <IconBase {...props} />;
}

export function FaApple(props) {
  return (
    <IconBase {...props}>
      <path d="M14.4 7.1c.8-1 1.2-2.1 1.1-3.1-1.1.1-2.3.8-3.1 1.8-.7.8-1.3 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.8Z" fill="currentColor" stroke="none" />
      <path d="M16.8 12.3c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.7 1.2 8.9.8 1 1.7 2.2 2.9 2.1 1.1 0 1.6-.7 3-.7 1.5 0 1.9.7 3 .7 1.2 0 2-.9 2.8-2 .9-1.2 1.2-2.4 1.2-2.5-.1 0-2.7-1-2.7-3.6Z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function FaChevronLeft(props) {
  return <IconBase {...props}><path d="m15 18-6-6 6-6" /></IconBase>;
}

export function FaCircle(props) {
  return <IconBase {...props} fill="currentColor" stroke="none"><circle cx="12" cy="12" r="6" /></IconBase>;
}

export function FaFacebookF(props) {
  return (
    <IconBase {...props}>
      <path d="M14 8h2V5h-2.2C11.8 5 11 6.2 11 8v2H9v3h2v6h3v-6h2.3l.7-3H14V8c0-.6.2-1 .9-1Z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function FaGoogle(props) {
  return (
    <IconBase {...props}>
      <path d="M20.3 12.2c0-.6-.1-1.1-.2-1.6H12v3.1h4.6a4 4 0 0 1-1.7 2.6v2.2h2.8c1.7-1.6 2.6-3.8 2.6-6.3Z" fill="currentColor" stroke="none" />
      <path d="M12 20.5c2.3 0 4.2-.8 5.6-2.1l-2.8-2.2c-.8.5-1.8.9-2.8.9-2.2 0-4-1.5-4.6-3.5H4.5v2.3c1.4 2.8 4.3 4.6 7.5 4.6Z" fill="currentColor" stroke="none" />
      <path d="M7.4 13.6A4.9 4.9 0 0 1 7.1 12c0-.6.1-1.1.3-1.6V8.1H4.5a8.3 8.3 0 0 0 0 7.7l2.9-2.2Z" fill="currentColor" stroke="none" />
      <path d="M12 6.9c1.2 0 2.4.4 3.3 1.3l2.5-2.5C16.2 4.2 14.2 3.5 12 3.5 8.8 3.5 5.9 5.3 4.5 8.1l2.9 2.3C8 8.4 9.8 6.9 12 6.9Z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function FaLocationDot(props) {
  return (
    <IconBase {...props}>
      <path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  );
}

export function FaRegEye(props) {
  return (
    <IconBase {...props}>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </IconBase>
  );
}

export function FaRegEyeSlash(props) {
  return (
    <IconBase {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A10.5 10.5 0 0 1 12 6c6 0 9.5 6 9.5 6a18.2 18.2 0 0 1-3 3.6" />
      <path d="M6.2 6.3A18.7 18.7 0 0 0 2.5 12S6 18 12 18c1.5 0 2.8-.3 4-.8" />
      <path d="M9.9 9.9A3 3 0 0 0 14.1 14.1" />
    </IconBase>
  );
}

export function BsStars(props) {
  return (
    <IconBase {...props}>
      <path d="m12 3 1.2 3.3L16.5 7l-3.3 1.2L12 11.5l-1.2-3.3L7.5 7l3.3-.7L12 3Z" fill="currentColor" stroke="none" />
      <path d="m18 13 .8 2.1 2.2.5-2.2.8-.8 2.1-.8-2.1-2.2-.8 2.2-.5.8-2.1Z" fill="currentColor" stroke="none" />
      <path d="m6 14 .9 2.4 2.6.6-2.6 1-.9 2.4-.9-2.4-2.6-1 2.6-.6.9-2.4Z" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function HiMiniSquares2X2(props) {
  return (
    <IconBase {...props} fill="currentColor" stroke="none">
      <rect x="5" y="5" width="5" height="5" rx="1" />
      <rect x="14" y="5" width="5" height="5" rx="1" />
      <rect x="5" y="14" width="5" height="5" rx="1" />
      <rect x="14" y="14" width="5" height="5" rx="1" />
    </IconBase>
  );
}

export function IoCarSportOutline(props) {
  return (
    <IconBase {...props}>
      <path d="M5 16h14l-1.5-5a2 2 0 0 0-1.9-1.4H8.4A2 2 0 0 0 6.5 11L5 16Z" />
      <path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20H6" />
      <path d="M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H18" />
      <circle cx="7.5" cy="16.5" r="1.5" />
      <circle cx="16.5" cy="16.5" r="1.5" />
    </IconBase>
  );
}

export function FiBarChart2(props) {
  return <FeatherIcon {...props}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></FeatherIcon>;
}

export function FiArrowLeft(props) {
  return <FeatherIcon {...props}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></FeatherIcon>;
}

export function FiBookOpen(props) {
  return <FeatherIcon {...props}><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4H11v16H4.5A2.5 2.5 0 0 0 2 22V6.5Z" /><path d="M22 6.5A2.5 2.5 0 0 0 19.5 4H13v16h6.5A2.5 2.5 0 0 1 22 22V6.5Z" /></FeatherIcon>;
}

export function FiCalendar(props) {
  return <FeatherIcon {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></FeatherIcon>;
}

export function FiDatabase(props) {
  return <FeatherIcon {...props}><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" /></FeatherIcon>;
}

export function FiEdit2(props) {
  return <FeatherIcon {...props}><path d="M17 3a2.8 2.8 0 1 1 4 4L8 20l-5 1 1-5L17 3Z" /></FeatherIcon>;
}

export function FiEdit3(props) {
  return <FeatherIcon {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></FeatherIcon>;
}

export function FiFilter(props) {
  return <FeatherIcon {...props}><polygon points="3 5 21 5 14 13 14 19 10 21 10 13 3 5" /></FeatherIcon>;
}

export function FiGlobe(props) {
  return <FeatherIcon {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18" /><path d="M12 3a15 15 0 0 0 0 18" /></FeatherIcon>;
}

export function FiGrid(props) {
  return <FeatherIcon {...props}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></FeatherIcon>;
}

export function FiLogOut(props) {
  return <FeatherIcon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></FeatherIcon>;
}

export function FiMail(props) {
  return <FeatherIcon {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></FeatherIcon>;
}

export function FiMapPin(props) {
  return <FeatherIcon {...props}><path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0Z" /><circle cx="12" cy="10" r="3" /></FeatherIcon>;
}

export function FiMenu(props) {
  return <FeatherIcon {...props}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></FeatherIcon>;
}

export function FiMessageCircle(props) {
  return <FeatherIcon {...props}><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5A8.4 8.4 0 0 1 8 18.7L3 20l1.3-5A8.4 8.4 0 0 1 3 11.5 8.5 8.5 0 1 1 21 11.5Z" /></FeatherIcon>;
}

export function FiMoreVertical(props) {
  return <FeatherIcon {...props}><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" /></FeatherIcon>;
}

export function FiPlus(props) {
  return <FeatherIcon {...props}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></FeatherIcon>;
}

export function FiSearch(props) {
  return <FeatherIcon {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></FeatherIcon>;
}

export function FiSettings(props) {
  return <FeatherIcon {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c0 .7.4 1.4 1 1.6.2.1.4.1.6.1h.2a2 2 0 1 1 0 4H21c-.2 0-.4 0-.6.1-.7.2-1.1.8-1 1.6v.1Z" /></FeatherIcon>;
}

export function FiShare2(props) {
  return <FeatherIcon {...props}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5 15.4 17.5" /><path d="M15.4 6.5 8.6 10.5" /></FeatherIcon>;
}

export function FiTrendingUp(props) {
  return <FeatherIcon {...props}><polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" /></FeatherIcon>;
}

export function FiUpload(props) {
  return <FeatherIcon {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 5 17 10" /><line x1="12" y1="5" x2="12" y2="16" /></FeatherIcon>;
}

export function FiUser(props) {
  return <FeatherIcon {...props}><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></FeatherIcon>;
}

export function FiUsers(props) {
  return <FeatherIcon {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 3.1a4 4 0 0 1 0 7.8" /></FeatherIcon>;
}
