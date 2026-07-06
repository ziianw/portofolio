import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = Record<string, any> & {
  children: ReactNode;
  className?: string;
  strength?: number;
  tilt?: number;
  as?: "div" | "a" | "button";
};

export default function Magnetic({
  children,
  className,
  strength = 0.35,
  tilt = 8,
  as = "div",
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = as as any;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const outerRX = gsap.quickTo(el, "rotationX", { ease: "power3" });
    const outerRY = gsap.quickTo(el, "rotationY", { ease: "power3" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
      gsap.to(el, { x, y, duration: 0.5, ease: "power3.out" });

      outerRX(
        gsap.utils.interpolate(tilt, -tilt, e.clientY / window.innerHeight),
      );
      outerRY(
        gsap.utils.interpolate(-tilt, tilt, e.clientX / window.innerWidth),
      );
    };

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.4)",
      });
      outerRX(0);
      outerRY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength, tilt]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      style={{ transformStyle: "preserve-3d", perspective: "500px" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
