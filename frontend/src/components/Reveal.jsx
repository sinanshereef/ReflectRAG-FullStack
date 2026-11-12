// Reveal.jsx — scroll-reveal wrapper driven by the shared useReveal hook.
// `delay` staggers siblings via the --reveal-delay custom property.

import { useReveal } from "../hooks/useReveal.js";

export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
