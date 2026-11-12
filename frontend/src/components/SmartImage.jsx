// SmartImage.jsx — <img> that degrades gracefully: if a photo file is
// missing or fails to load, the card shows its gradient + icon fallback
// instead of a broken-image glyph.

import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function SmartImage({ src, alt, className = "", fallbackIcon: Icon = null, ...rest }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`img-fallback ${className}`}
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, var(--forest) 0%, var(--emerald) 55%, var(--mint) 130%)",
          display: "grid",
          placeItems: "center",
          color: "var(--mint)",
        }}
        role="img"
        aria-label={alt}
      >
        {Icon ? <Icon size={44} strokeWidth={1.6} opacity={0.85} /> : <ImageOff size={36} opacity={0.7} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={rest.loading ?? "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
