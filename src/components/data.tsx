export type Body =
  | { type: "actions" }
  | { type: "file"; name: string };

export type Notification = {
  id: string;
  avatar: string | null;
  initials?: string;
  avatarBg: string;
  online?: boolean;
  unread?: boolean;
  /** parts: strong = black, plain = gray connective copy */
  parts: { text: string; strong?: boolean }[];
  time: string;
  source: string;
  body?: Body;
};

export const inbox: Notification[] = [
  {
    id: "i1",
    avatar: "/assets/avatar-1.png",
    avatarBg: "#dfe7ff",
    online: true,
    unread: true,
    parts: [
      { text: "Polly ", strong: true },
      { text: "edited " },
      { text: "Contact page", strong: true },
    ],
    time: "36 mins ago",
    source: "Craftwork Design",
  },
  {
    id: "i2",
    avatar: "/assets/avatar-2.png",
    avatarBg: "#f3e2cf",
    unread: true,
    parts: [
      { text: "James ", strong: true },
      { text: "left a comment on " },
      { text: "ACME 2.1", strong: true },
    ],
    time: "2 hours ago",
    source: "ACME",
  },
  {
    id: "i3",
    avatar: "/assets/avatar-3.png",
    avatarBg: "#e7defb",
    online: true,
    parts: [
      { text: "Mary ", strong: true },
      { text: "shared the file " },
      { text: "Isometric 2.0", strong: true },
      { text: " with you" },
    ],
    time: "3 hours ago",
    source: "Craftwork Design",
    body: { type: "actions" },
  },
  {
    id: "i4",
    avatar: "/assets/avatar-4.png",
    avatarBg: "#fde7c8",
    parts: [
      { text: "Dima Phizeg ", strong: true },
      { text: "edited " },
      { text: "ACME 2.1", strong: true },
    ],
    time: "3 hours ago",
    source: "ACME",
    body: { type: "file", name: "ACME_guideline.pdf" },
  },
  {
    id: "i5",
    avatar: "/assets/avatar-2.png",
    avatarBg: "#f3e2cf",
    parts: [
      { text: "James ", strong: true },
      { text: "created " },
      { text: "Changelog page", strong: true },
      { text: " for " },
      { text: "Blank", strong: true },
    ],
    time: "1 day ago",
    source: "Blank",
  },
];

export const general: Notification[] = [
  {
    id: "g1",
    avatar: "/assets/avatar-3.png",
    avatarBg: "#e7defb",
    parts: [
      { text: "Mary ", strong: true },
      { text: "invited you to " },
      { text: "Design Weekly", strong: true },
    ],
    time: "5 hours ago",
    source: "Craftwork Design",
  },
  {
    id: "g2",
    avatar: null,
    initials: "RT",
    avatarBg: "#d9f3e4",
    parts: [
      { text: "Robert Tylor ", strong: true },
      { text: "assigned you a task in " },
      { text: "Sprint 24", strong: true },
    ],
    time: "Yesterday",
    source: "ACME",
  },
  {
    id: "g3",
    avatar: "/assets/avatar-1.png",
    avatarBg: "#dfe7ff",
    parts: [
      { text: "Polly ", strong: true },
      { text: "approved your request for " },
      { text: "Brand Assets", strong: true },
    ],
    time: "2 days ago",
    source: "Craftwork Design",
  },
];
