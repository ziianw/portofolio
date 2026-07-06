import { useRef, useCallback, type ReactNode, type PointerEvent } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees (default: 12) */
  rotate?: number;
  /** Max inner shift in px (default: 16) */
  shift?: number;
};

export default function Tilt3D({
  children,
  className,
  rotate = 12,
  shift = 16,
  ...rest
}: Props & Record<string, unknown>) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rx = rotate - y * rotate * 2;
      const ry = -rotate + x * rotate * 2;
      el.style.transform = `perspective(650px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    },
    [rotate],
  );

  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", transition: "transform 0.2s ease-out" }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      <div style={{ transition: "transform 0.2s ease-out" }}>{children}</div>
    </div>
  );
}
