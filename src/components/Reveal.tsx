import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  scale?: number;
  duration?: number;
  /** viewpoint margin, makin besar makin cepat trigger */
  margin?: string;
  once?: boolean;
}

const defaultEasing = [0.25, 0.1, 0.25, 1]; // cubic-bezier smooth

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  scale = 0.96,
  duration = 0.7,
  margin = "-60px",
  once = true,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, margin }}
      transition={{
        duration,
        delay,
        ease: defaultEasing,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
