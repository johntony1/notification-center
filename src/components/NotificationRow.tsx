import { useRef, useState, type ReactNode, type PointerEvent } from "react";
import { TrashIcon } from "./icons";

const ACTION_W = 84; // resting reveal width
const DELETE_RATIO = 0.45; // drag past 45% of the row → delete on release
const AXIS_LOCK = 8; // px before we commit to an axis

type Props = {
  open: boolean;
  removing: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDelete: () => void;
  children: ReactNode;
};

export default function NotificationRow({
  open,
  removing,
  onOpen,
  onClose,
  onDelete,
  children,
}: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const start = useRef({ x: 0, y: 0 });
  const axis = useRef<"none" | "h" | "v">("none");
  const didDrag = useRef(false);
  const down = useRef(false);
  const [drag, setDrag] = useState<number | null>(null); // px while dragging

  const restX = open ? -ACTION_W : 0;
  const x = drag ?? restX;
  // reveal progress drives the icon scale/opacity for that tactile feel
  const progress = Math.min(1, Math.max(0, -x / ACTION_W));
  const armed = rowRef.current
    ? -x > rowRef.current.clientWidth * DELETE_RATIO
    : false;

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || removing) return;
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

    let next = restX + dx;
    if (next > 0) next *= 0.35; // rubber-band the closed edge
    setDrag(next);
  }

  function onPointerUp() {
    down.current = false;
    if (axis.current !== "h") {
      axis.current = "none";
      return;
    }
    const dragged = -(drag ?? restX);
    const w = rowRef.current?.clientWidth ?? 320;
    axis.current = "none";
    setDrag(null);

    if (dragged > w * DELETE_RATIO) onDelete();
    else if (dragged > ACTION_W / 2) onOpen();
    else onClose();
  }

  return (
    <div
      ref={rowRef}
      className="nc-row"
      data-open={open}
      data-removing={removing}
      data-armed={armed}
    >
      <button
        type="button"
        className="nc-row-delete"
        aria-label="Delete notification"
        tabIndex={open ? 0 : -1}
        onClick={onDelete}
      >
        <span
          className="nc-row-delete-icon"
          style={
            drag !== null
              ? {
                  transform: `scale(${0.55 + 0.45 * progress})`,
                  opacity: 0.4 + 0.6 * progress,
                }
              : undefined
          }
        >
          <TrashIcon />
        </span>
      </button>

      <div
        className="nc-row-fg"
        data-dragging={drag !== null}
        style={{ transform: `translate3d(${x}px,0,0)` }}
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
