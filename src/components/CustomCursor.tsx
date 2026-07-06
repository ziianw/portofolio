import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let rx = mx,
      ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
    };

    const isInteractive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false;
      return !!el.closest(
        "a, button, [role='button'], input, textarea, [data-cursor='hover']",
      );
    };

    const onOver = (e: MouseEvent) => {
      if (!ring.current) return;
      ring.current.classList.toggle("cursor-hover", isInteractive(e.target));
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[999] h-2 w-2 rounded-full bg-primary hidden md:block"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[998] h-9 w-9 rounded-full border border-primary/60 transition-[width,height,background] duration-300 hidden md:block cursor-ring"
      />
      <style>{`
        .cursor-ring.cursor-hover {
          width: 60px;
          height: 60px;
          background: rgba(126, 232, 250, 0.15);
          border-color: rgba(238, 192, 255, 0.8);
        }
      `}</style>
    </>
  );
}
