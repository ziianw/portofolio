import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Instagram, Linkedin, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import Tilt3D from "./Tilt3D";
import AnimatedCounter from "./AnimatedCounter";

const roles = [
  "Web Developer",
  "IT Support",
  "Frontend Developer",
  "Front of House Engineer",
  "Event Technician",
];

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setRoleIdx((i) => (i + 1) % roles.length),
      4500,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center px-4 pt-20 pb-10 md:pt-28 md:pb-16"
    >
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6 md:mb-8"
          data-cursor="hover"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Available for new opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-4 md:mb-6"
        >
          Hi, I'm <span className="text-gradient">Zian Wahidi</span>
          <br />
          <span className="block mt-2 md:mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-muted-foreground">
            {["a", "e", "i", "o", "u"].includes(roles[roleIdx].charAt(0).toLowerCase()) ? "an" : "a"}{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIdx}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-foreground inline-block"
              >
                {roles[roleIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mx-auto max-w-xl md:max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-10"
        >
          I craft responsive corporate sites, dashboards & event pages while
          keeping cloud infrastructure and internal networks running smoothly.
          Informatics Engineering student at Universitas Paramadina.
        </motion.p> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#experience"
            className="group inline-flex items-center gap-2 rounded-full bg-hero-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_rgba(58,138,154,0.4)] transition hover:scale-105"
          >
            Explore My Work
            <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
          </a>
          <a
            href="mailto:zianwhd@gmail.com"
            className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold hover:bg-white/10 transition hover:scale-105"
          >
            <Mail className="h-4 w-4" /> Contact Me
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-6 md:mt-10 flex items-center justify-center gap-4 text-muted-foreground"
        >
          <a
            href="https://www.linkedin.com/in/zianwhd"
            target="_blank"
            rel="noreferrer"
            className="glass grid h-11 w-11 place-items-center rounded-full transition hover:scale-110 hover:text-foreground"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://instagram.com/zianwhd"
            target="_blank"
            rel="noreferrer"
            className="glass grid h-11 w-11 place-items-center rounded-full transition hover:scale-110 hover:text-foreground"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="mailto:zianwhd@gmail.com"
            className="glass grid h-11 w-11 place-items-center rounded-full transition hover:scale-110 hover:text-foreground"
          >
            <Mail className="h-5 w-5" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {[
            { to: 3, suffix: "+", label: "Years Exp." },
            { to: 15, suffix: "+", label: "Projects" },
            { to: 50, suffix: "+", label: "Live Events" },
            { to: 99, suffix: "%", label: "Uptime" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.7 + i * 0.12,
                ease: "backOut",
              }}
            >
              <Tilt3D
                rotate={12}
                shift={20}
                className="glass rounded-2xl p-3 md:p-5 cursor-default hover-glow transition-all duration-300 hover:scale-[1.04]"
                data-cursor="hover"
              >
                <AnimatedCounter
                  to={s.to}
                  suffix={s.suffix || ""}
                  duration={1.8}
                  decimals={s.to % 1 !== 0 ? 2 : 0}
                  className="text-xl md:text-3xl font-bold text-gradient inline-block"
                />
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </Tilt3D>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
