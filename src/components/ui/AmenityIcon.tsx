import React from 'react';

interface AmenityIconProps {
  name: string;
  size?: number;
  className?: string;
}

const icons: Record<string, React.ReactElement<React.SVGProps<SVGSVGElement>>> = {
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9.5a11 11 0 0 1 14 0" />
      <path d="M8 12.5a7 7 0 0 1 8 0" />
      <path d="M10.8 15.5a3.5 3.5 0 0 1 2.4 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  pool: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6v8" />
      <path d="M8 4v10" />
      <path d="M2 15c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" />
      <path d="M2 19c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" />
    </svg>
  ),
  kitchen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v16H4z" />
      <path d="M4 10h16" />
      <path d="M9 7h2" />
      <circle cx="8" cy="15" r="1.2" />
      <circle cx="12" cy="15" r="1.2" />
      <path d="M16 13v4" />
    </svg>
  ),
  airConditioning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <path d="M8 14v2" />
      <path d="M12 14v4" />
      <path d="M16 14v2" />
      <path d="M10 18c0 1-1 1.5-1 2.5" />
      <path d="M14 18c0 1-1 1.5-1 2.5" />
    </svg>
  ),
  jacuzzi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16" />
      <path d="M4 16c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 4 1.5" />
      <path d="M8 12l4-4" />
      <path d="M9.5 6.5A3.5 3.5 0 0 1 14 11" />
    </svg>
  ),
  parking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 17V7h5a3 3 0 0 1 0 6H9" />
    </svg>
  ),
  smartTv: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M8 9l2.2 1.3v2.4L8 14" />
      <path d="M12 14V9l3.5 5V9" />
    </svg>
  ),
  security: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4.5-2.8 7.7-7 10-4.2-2.3-7-5.5-7-10V6l7-3z" />
      <path d="M9.5 12.5l1.7 1.7 3.3-3.3" />
    </svg>
  ),
  hotWater: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4c3 3 5 5.4 5 8a5 5 0 0 1-10 0c0-2.6 2-5 5-8z" />
      <path d="M12 18v2" />
      <path d="M9 20h6" />
    </svg>
  ),
};

export function AmenityIcon({ name, size = 20, className = '' }: AmenityIconProps) {
  const icon = icons[name];

  if (!icon) {
    return null; // O un icono de placeholder si no se encuentra
  }

  return React.cloneElement(icon, { width: size, height: size, className });
}
