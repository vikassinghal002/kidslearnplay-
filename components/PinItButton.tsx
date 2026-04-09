"use client";

// Small "Pin It" button that opens the Pinterest share dialog.
//
// This component is intentionally dumb — it just builds the share URL from
// the props the server passes in. The server already knows the page URL,
// the pin image URL and the description, so the client never computes them.

type Props = {
  /** Fully qualified URL of the page being shared, e.g. https://www.jiggyjoy.com/games/snake */
  pageUrl: string;
  /** Fully qualified URL of the 1000x1500 pin image */
  mediaUrl: string;
  /** Pinterest description / default comment */
  description: string;
  /** Optional className override (merged onto the default pill look) */
  className?: string;
};

export default function PinItButton({ pageUrl, mediaUrl, description, className }: Props) {
  const shareUrl =
    "https://pinterest.com/pin/create/button/" +
    `?url=${encodeURIComponent(pageUrl)}` +
    `&media=${encodeURIComponent(mediaUrl)}` +
    `&description=${encodeURIComponent(description)}`;

  const defaultClass =
    "flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors text-sm shadow-sm";

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? defaultClass}
      aria-label="Pin this to Pinterest"
      title="Pin this to Pinterest"
    >
      📌 Pin It
    </a>
  );
}
