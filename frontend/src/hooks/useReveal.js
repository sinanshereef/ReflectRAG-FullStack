// useReveal.js — tiny IntersectionObserver hook that toggles the `.is-in`
// class for CSS scroll-reveal animations. Delays are controlled per-element
// through the --reveal-delay custom property, so no animation library is
// needed for section reveals.

import { useEffect, useRef } from "react";

export function useReveal({ threshold = 0.16, rootMargin = "0px 0px -40px 0px" } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If the browser has no IntersectionObserver, show content immediately.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
