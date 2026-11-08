type IconDef = { d?: string[]; circles?: Array<[number, number, number]> };

const icons: Record<string, IconDef> = {
  document: { d: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 13h6', 'M10 17h6'] },
  rings: { circles: [[9, 14, 5], [15, 14, 5]], d: ['M12 3.5l-2 3h4z'] },
  leaf: { d: ['M5 19c0-8 5-14 14-14 0 9-6 14-14 14z', 'M5 19l8-8'] },
  building: { d: ['M4 21V8l8-5 8 5v13', 'M9 21v-6h6v6', 'M4 21h16'] },
  stamp: { d: ['M8 4h8v5a3 3 0 0 0 1.5 2.6V14h-11v-2.4A3 3 0 0 0 8 9z', 'M5 18h14', 'M7 21h10'] },
  message: { d: ['M4 5h16v11H9l-5 4z', 'M8 9h8', 'M8 12h5'] },
  arrow: { d: ['M5 12h14', 'M13 6l6 6-6 6'] },
  download: { d: ['M12 4v11', 'M7 11l5 5 5-5', 'M5 20h14'] },
  phone: {
    d: ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z'],
  },
  pin: { d: ['M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z'], circles: [[12, 10, 2.5]] },
  clock: { circles: [[12, 12, 9]], d: ['M12 7v5l3 2'] },
  coin: {
    circles: [[12, 12, 9]],
    d: ['M12 7v10', 'M15 9.5c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.3 0-2.4-.5-3-1.5'],
  },
  check: { d: ['M5 12l4 4 10-10'] },
  mail: { d: ['M4 6h16v12H4z', 'M4 7l8 6 8-6'] },
  menu: { d: ['M4 7h16', 'M4 12h16', 'M4 17h16'] },
  close: { d: ['M6 6l12 12', 'M18 6L6 18'] },
  book: { d: ['M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1z', 'M12 6v13'] },
  leafy: { d: ['M12 21V9', 'M12 13c-4 0-6-2-6-6 4 0 6 2 6 6z', 'M12 15c4 0 6-2 6-6-4 0-6 2-6 6z'] },
  columns: { d: ['M3 9l9-5 9 5', 'M5 9v9', 'M10 9v9', 'M14 9v9', 'M19 9v9', 'M3 21h18'] },
};

export type IconName = keyof typeof icons;

export default function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  const def = icons[name];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {def.d?.map((path) => <path key={path} d={path} />)}
      {def.circles?.map(([cx, cy, r]) => <circle key={`${cx}-${cy}-${r}`} cx={cx} cy={cy} r={r} />)}
    </svg>
  );
}
