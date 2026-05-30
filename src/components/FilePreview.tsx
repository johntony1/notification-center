import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PaperclipIcon } from "./icons";
import "./FilePreview.css";

/* A lightweight hover popover that peeks the document's cover page. */
export default function FilePreview({ name }: { name: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);

  const show = () => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setAnchor({ x: r.left + r.width / 2, y: r.top });
  };
  const hide = () => setAnchor(null);

  return (
    <>
      <button
        ref={ref}
        type="button"
        className="nc-file"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={(e) => e.stopPropagation()}
      >
        <PaperclipIcon />
        {name}
      </button>

      {anchor &&
        createPortal(
          <div
            className="filepop"
            style={{ left: anchor.x, top: anchor.y }}
            role="tooltip"
          >
            <div className="filepop-card">
              <div className="filepop-page">
                <span className="filepop-kicker">Brand Guidelines</span>
                <span className="filepop-mark">ACME</span>
                <span className="filepop-rule" />
                <span className="filepop-lines">
                  <i />
                  <i />
                  <i style={{ width: "55%" }} />
                </span>
              </div>
              <div className="filepop-meta">
                <strong>{name}</strong>
                <span>PDF · 5 pages · 1.2 MB</span>
              </div>
            </div>
            <span className="filepop-arrow" />
          </div>,
          document.body,
        )}
    </>
  );
}
