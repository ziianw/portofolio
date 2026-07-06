import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  /** Target number to count to */
  to: number;
  /** Optional prefix (e.g. "2+", the "+" part) */
  suffix?: string;
  /** Optional prefix (e.g. "$") */
  prefix?: string;
  /** Duration in seconds */
  duration?: number;
  /** Decimal places */
  decimals?: number;
  className?: string;
}

/**
 * Animated counter that counts up when it enters the viewport.
 * Uses requestAnimationFrame for smooth 60fps counting.
 */
export default function AnimatedCounter({
  to,
  suffix = "",
  prefix = "",
  duration = 1.5,
  decimals = to % 1 !== 0 ? 2 : 0,
  className,
}: Props) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();
    const end = start + duration * 1000;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = to * eased;

      setCount(current);

      if (now < end) {
        requestAnimationFrame(tick);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(tick);
  }, [inView, to, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toString();

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "backOut" }}
    >
      {prefix}
      {formatted}
      {suffix}
    </motion.span>
  );
}
