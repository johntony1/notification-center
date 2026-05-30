import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent,
} from "react";
import { ArchiveIcon, TrashIcon } from "./icons";

const ACTION_W = 84; // resting reveal width
const ACT_RATIO = 0.45; // drag past 45% of the row → fire the action on release
const AXIS_LOCK = 8; // px before we commit to an axis

type Props = {
  open: boolean;
  removing: boolean;
  dir?: "delete" | "archive"; // direction of the exit animation
  hint?: boolean; // play a one-shot "you can swipe me" nudge
  onOpen: () => void;
  onClose: () => void;
  onDelete: () => void;
  onArchive: () => void;
  children: ReactNode;
};

export default function NotificationRow({
  open,
  removing,
  dir,
  hint = false,
  onOpen,
  onClose,
  onDelete,
  onArchive,
  children,
}: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const start = useRef({ x: 0, y: 0 });
  const axis = useRef<"none" | "h" | "v">("none");
  const didDrag = useRef(false);
  const down = useRef(false);
  const [drag, setDrag] = useState<number | null>(null); // px while dragging
  const [hinting, setHinting] = useState(false);

  // run the affordance nudge once each time the prop flips on
  useEffect(() => {
    if (hint) setHinting(true);
  }, [hint]);

  const restX = open ? -ACTION_W : 0;
  const x = drag ?? restX;
  const swipe = x < -1 ? "left" : x > 1 ? "right" : "none";
  // reveal progress drives each icon's scale/opacity for that tactile feel
  const pDelete = Math.min(1, Math.max(0, -x / ACTION_W));
  const pArchive = Math.min(1, Math.max(0, x / ACTION_W));
  const w = rowRef.current?.clientWidth ?? 320;
  const armedDelete = -x > w * ACT_RATIO;
  const armedArchive = x > w * ACT_RATIO;

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || removing) return;
    if (hinting) setHinting(false); // user took over — drop the demo
    down.current = true;
    start.current = { x: e.clientX, y: e.clientY };
    axis.current = "none";
    didDrag.current = false;
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!down.current || axis.current === "v") return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;

    if (axis.current === "none") {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      // let vertical gestures scroll the list untouched
      axis.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      if (axis.current === "v") return;
      didDrag.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    setDrag(restX + dx);
  }

  function onPointerUp() {
    down.current = false;
    if (axis.current !== "h") {
      axis.current = "none";
      return;
    }
    const pos = drag ?? restX;
    const width = rowRef.current?.clientWidth ?? 320;
    axis.current = "none";
    setDrag(null);

    if (pos < -width * ACT_RATIO) onDelete();
    else if (pos > width * ACT_RATIO) onArchive();
    else if (pos < -ACTION_W / 2) onOpen();
    else onClose();
  }

  return (
    <div
      ref={rowRef}
      className="nc-row"
      data-open={open}
      data-removing={removing}
      data-remove-dir={dir}
      data-swipe={swipe}
      data-armed-delete={armedDelete}
      data-armed-archive={armedArchive}
      data-hinting={hinting}
    >
      {/* left band — revealed by swiping right */}
      <button
        type="button"
        className="nc-row-archive"
        aria-label="Archive notification"
        tabIndex={-1}
        onClick={onArchive}
      >
        <span
          className="nc-row-action-icon"
          style={
            drag !== null && x > 0
              ? {
                  transform: `scale(${0.55 + 0.45 * pArchive})`,
                  opacity: 0.4 + 0.6 * pArchive,
                }
              : undefined
          }
        >
          <ArchiveIcon />
        </span>
      </button>

      {/* right band — revealed by swiping left */}
      <button
        type="button"
        className="nc-row-delete"
        aria-label="Delete notification"
        tabIndex={open ? 0 : -1}
        onClick={onDelete}
      >
        <span
          className="nc-row-action-icon"
          style={
            drag !== null && x < 0
              ? {
                  transform: `scale(${0.55 + 0.45 * pDelete})`,
                  opacity: 0.4 + 0.6 * pDelete,
                }
              : undefined
          }
        >
          <TrashIcon />
        </span>
      </button>

      <div
        className={`nc-row-fg${hinting ? " nc-hint" : ""}`}
        data-dragging={drag !== null}
        style={{ transform: `translate3d(${x}px,0,0)` }}
        onAnimationEnd={() => setHinting(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          // a click that ends a swipe must not also toggle the row
          if (didDrag.current) {
            e.stopPropagation();
            e.preventDefault();
            didDrag.current = false;
            return;
          }
          if (open) onClose();
        }}
      >
        {children}
      </div>
    </div>
  );
}
