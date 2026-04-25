/* eslint-disable react-refresh/only-export-components */
import type { SVGProps } from 'react';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "d"> {
  d?: React.ReactNode;
  size?: number;
  sw?: number;
}

function Icon({ d, size = 16, fill = 'none', stroke = 'currentColor', sw = 1.5, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
  );
}

export const Icons = {
  home: <Icon d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V11z" />,
  file: <Icon d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5" />,
  grid: (
    <Icon
      d={
        <>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </>
      }
    />
  ),
  report: <Icon d="M4 19V5a1 1 0 0 1 1-1h10l5 5v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM15 4v5h5M8 13h8M8 17h5" />,
  settings: (
    <Icon
      d={
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </>
      }
    />
  ),
  play: <Icon d="M5 3l14 9-14 9V3z" fill="currentColor" stroke="none" />,
  search: (
    <Icon
      d={
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </>
      }
    />
  ),
  plus: <Icon d="M12 5v14M5 12h14" />,
  chevron: <Icon d="M9 6l6 6-6 6" />,
  chevronDown: <Icon d="M6 9l6 6 6-6" />,
  x: <Icon d="M6 6l12 12M18 6L6 18" />,
  download: <Icon d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />,
  filter: <Icon d="M4 5h16M7 12h10M10 19h4" />,
  sparkle: <Icon d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z" />,
  git: (
    <Icon
      d={
        <>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="12" r="2.5" />
          <path d="M6 8.5v7M8.5 6h2a5 5 0 0 1 5 5v0.5" />
        </>
      }
    />
  ),
  history: (
    <Icon
      d={
        <>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 2" />
        </>
      }
    />
  ),
  check: <Icon d="M5 12l5 5L20 7" />,
  alert: (
    <Icon
      d={
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6M12 17h.01" />
        </>
      }
    />
  ),
  edit: <Icon d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4" />,
  sliders: <Icon d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h14M18 18h2" />,
};
