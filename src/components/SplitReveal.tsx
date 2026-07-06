import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function SplitReveal({
  children,
  className,
  delay = 0,
  stagger = 0.03,
  as = "h2",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      try {
        split = new SplitText(el, { type: "chars,words" });
        gsap.from(split.chars, {
          y: 60,
          opacity: 0,
          rotationX: -60,
          stagger,
          duration: 0.8,
          ease: "back.out(1.6)",
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      } catch {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay,
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      }
    }, el);
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [delay, stagger]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = as as any;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
