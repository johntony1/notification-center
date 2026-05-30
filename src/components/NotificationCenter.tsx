import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { inbox as inboxSeed, type Notification } from "./data";
import { BellIcon, ChevronIcon } from "./icons";
import NotificationRow from "./NotificationRow";
import FilePreview from "./FilePreview";
import "./NotificationCenter.css";

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>(inboxSeed);
  const [resolved, setResolved] = useState<
    Record<string, "accepted" | "declined">
  >({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [removing, setRemoving] = useState<Map<string, "delete" | "archive">>(
    new Map(),
  );
  const [hint, setHint] = useState(false);

  // Once the panel finishes expanding, nudge the top row so people
  // discover swipe-to-delete. Skip for reduced-motion / empty list.
  useEffect(() => {
    if (!open) {
      setHint(false);
      return;
    }
    if (items.length === 0) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setHint(true), 620);
    return () => window.clearTimeout(t);
  }, [open, items.length]);

  // Decline → show the red "Declined" state, then slide the row away.
  const declineItem = (id: string) => {
    setResolved((r) => ({ ...r, [id]: "declined" }));
    window.setTimeout(() => dismiss(id, "delete"), 900);
  };

  const dismiss = (id: string, dir: "delete" | "archive") => {
    setOpenId((cur) => (cur === id ? null : cur));
    setRemoving((m) => new Map(m).set(id, dir));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((n) => n.id !== id));
      setRemoving((m) => {
        const next = new Map(m);
        next.delete(id);
        return next;
      });
    }, 320);
  };
  const deleteItem = (id: string) => dismiss(id, "delete");
  const archiveItem = (id: string) => dismiss(id, "archive");

  const collapsedRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const [h, setH] = useState({ c: 88, e: 88 });

  // Keep both natural heights measured so the .t-resize card always
  // tweens between accurate targets (fonts, avatars, action resolves).
  useLayoutEffect(() => {
    const measure = () =>
      setH({
        c: collapsedRef.current?.offsetHeight ?? 88,
        e: expandedRef.current?.offsetHeight ?? 88,
      });
    measure();
    const ro = new ResizeObserver(measure);
    if (collapsedRef.current) ro.observe(collapsedRef.current);
    if (expandedRef.current) ro.observe(expandedRef.current);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [items, resolved, open, removing]);

  const unreadCount = items.filter((n) => n.unread).length;
  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <div
      className="nc t-resize"
      data-open={open}
      style={{ height: open ? h.e : h.c }}
    >
      <div className="nc-stack">
        {/* ---------- Collapsed ---------- */}
        <div className="nc-layer" data-role="collapsed" data-active={!open}>
          <div ref={collapsedRef} className="nc-collapsed">
            <div className="nc-bell" aria-hidden="true">
              <BellIcon />
            </div>
            <div className="nc-collapsed-text">
              <div className="nc-collapsed-title">
                <span>{items.length} New Activities</span>
                {unreadCount > 0 && (
                  <span className="nc-pill">{unreadCount}</span>
                )}
              </div>
              <div className="nc-collapsed-sub">
                What&rsquo;s happening around you
              </div>
            </div>
            <button
              type="button"
              className="nc-toggle"
              aria-expanded={open}
              aria-controls="nc-panel"
              aria-label="Expand notifications"
              onClick={() => setOpen(true)}
            >
              <span className="t-icon-swap" data-state="a">
                <span className="t-icon" data-icon="a">
                  <ChevronIcon dir="down" />
                </span>
                <span className="t-icon" data-icon="b">
                  <ChevronIcon dir="up" />
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* ---------- Expanded ---------- */}
        <div
          className="nc-layer"
          data-role="expanded"
          data-active={open}
          id="nc-panel"
        >
          <div ref={expandedRef}>
            <header className="nc-header">
              <h2>Notifications</h2>
              <button
                type="button"
                className="nc-markread"
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
              <button
                type="button"
                className="nc-toggle"
                aria-expanded={open}
                aria-controls="nc-panel"
                aria-label="Collapse notifications"
                onClick={() => setOpen(false)}
              >
                <span className="t-icon-swap" data-state="b">
                  <span className="t-icon" data-icon="a">
                    <ChevronIcon dir="down" />
                  </span>
                  <span className="t-icon" data-icon="b">
                    <ChevronIcon dir="up" />
                  </span>
                </span>
              </button>
            </header>

            <div className="nc-list">
              {items.map((n, i) => (
                <NotificationRow
                  key={n.id}
                  open={openId === n.id}
                  removing={removing.has(n.id)}
                  dir={removing.get(n.id)}
                  hint={i === 0 && hint}
                  onOpen={() => setOpenId(n.id)}
                  onClose={() =>
                    setOpenId((c) => (c === n.id ? null : c))
                  }
                  onDelete={() => deleteItem(n.id)}
                  onArchive={() => archiveItem(n.id)}
                >
                  <div
                    className="nc-item"
                    data-unread={!!n.unread}
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    <div className="nc-avatar">
                    {n.avatar ? (
                      <img
                        src={n.avatar}
                        alt=""
                        style={{ background: n.avatarBg }}
                      />
                    ) : (
                      <div
                        className="nc-avatar-initials"
                        style={{ background: n.avatarBg }}
                      >
                        {n.initials}
                      </div>
                    )}
                    {n.online && (
                      <span className="nc-online" aria-hidden="true" />
                    )}
                  </div>

                  <div className="nc-content">
                    <p className="nc-text">
                      {n.parts.map((p, j) =>
                        p.strong ? (
                          <b key={j}>{p.text}</b>
                        ) : (
                          <span key={j}>{p.text}</span>
                        ),
                      )}
                    </p>
                    <p className="nc-meta">
                      <time>{n.time}</time>
                      <span className="nc-dotsep">•</span>
                      <span>{n.source}</span>
                    </p>

                    {n.body?.type === "actions" &&
                      (resolved[n.id] ? (
                        <span
                          className="nc-resolved"
                          data-kind={resolved[n.id]}
                        >
                          {resolved[n.id] === "accepted"
                            ? "Accepted"
                            : "Declined"}
                        </span>
                      ) : (
                        <div className="nc-actions">
                          <button
                            type="button"
                            className="nc-btn nc-btn-secondary"
                            onClick={() => declineItem(n.id)}
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            className="nc-btn nc-btn-primary"
                            onClick={() =>
                              setResolved((r) => ({
                                ...r,
                                [n.id]: "accepted",
                              }))
                            }
                          >
                            Accept
                          </button>
                        </div>
                      ))}

                    {n.body?.type === "file" && (
                      <FilePreview name={n.body.name} />
                    )}
                  </div>

                    {n.unread && (
                      <span className="nc-unread-dot" aria-hidden="true" />
                    )}
                  </div>
                </NotificationRow>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
