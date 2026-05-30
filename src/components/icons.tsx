/** All icons are MingCute (line set), used 1:1 from the official glyph data.
 *  https://www.mingcute.com — viewBox 0 0 24 24, currentColor fill. */

type IconProps = { className?: string; size?: number };

function Mingcute({
  size = 20,
  className,
  d,
  flip,
}: IconProps & { d: string; flip?: boolean }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={flip ? { transform: "rotate(180deg)" } : undefined}
    >
      <path fill="currentColor" d={d} />
    </svg>
  );
}

/* mingcute:notification-line */
export function BellIcon({ className, size = 20 }: IconProps) {
  return (
    <Mingcute
      className={className}
      size={size}
      d="M5 9a7 7 0 0 1 14 0v3.764l1.822 3.644A1.1 1.1 0 0 1 19.838 18h-3.964a4.002 4.002 0 0 1-7.748 0H4.162a1.1 1.1 0 0 1-.984-1.592L5 12.764zm5.268 9a2 2 0 0 0 3.464 0zM12 4a5 5 0 0 0-5 5v3.764a2 2 0 0 1-.211.894L5.619 16h12.763l-1.17-2.342a2 2 0 0 1-.212-.894V9a5 5 0 0 0-5-5"
    />
  );
}

/* mingcute:up-line / down-line */
export function ChevronIcon({
  dir = "down",
  className,
  size = 16,
}: IconProps & { dir?: "up" | "down" }) {
  return dir === "down" ? (
    <Mingcute
      className={className}
      size={size}
      d="M12.707 15.707a1 1 0 0 1-1.414 0L5.636 10.05A1 1 0 1 1 7.05 8.636l4.95 4.95l4.95-4.95a1 1 0 0 1 1.414 1.414z"
    />
  ) : (
    <Mingcute
      className={className}
      size={size}
      d="M11.293 8.293a1 1 0 0 1 1.414 0l5.657 5.657a1 1 0 0 1-1.414 1.414L12 10.414l-4.95 4.95a1 1 0 0 1-1.414-1.414z"
    />
  );
}

/* mingcute:delete-2-line */
export function TrashIcon({ className, size = 22 }: IconProps) {
  return (
    <Mingcute
      className={className}
      size={size}
      d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
    />
  );
}

/* archive box (line) — matches the line-icon aesthetic */
export function ArchiveIcon({ className, size = 22 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.75" y="3.75" width="18.5" height="4.5" rx="1.25" />
      <path d="M4.5 8.25V18a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8.25" />
      <path d="M9.75 12h4.5" />
    </svg>
  );
}

/* mingcute:attachment-2-line */
export function PaperclipIcon({ className, size = 18 }: IconProps) {
  return (
    <Mingcute
      className={className}
      size={size}
      d="M5.636 10.586a3.5 3.5 0 1 1 4.95-4.95l7.778 7.778a3.5 3.5 0 0 1-4.95 4.95l-4.066-4.066a1.25 1.25 0 1 1 1.768-1.768l3.712 3.713a1 1 0 0 0 1.415-1.415l-3.713-3.712a3.25 3.25 0 0 0-4.596 4.596L12 19.778A5.5 5.5 0 1 0 19.778 12L12 4.222A5.5 5.5 0 1 0 4.222 12l.353.353A1 1 0 1 0 5.99 10.94z"
    />
  );
}
