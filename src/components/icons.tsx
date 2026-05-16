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
