import { motion } from "framer-motion";
import { Code2, Cloud, Network, Clapperboard } from "lucide-react";
import Reveal from "./Reveal";

const groups = [
  {
    icon: Code2,
    title: "Programming & Web",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "React JS",
      "PHP",
      "Laravel",
      "MySQL",
      "Bootstrap",
      "Framer Motion",
      "Three.js",
      "Tailwind CSS",
    ],
  },
  {
    icon: Cloud,
    title: "DevOps & Cloud",
    items: [
      "Git",
      "Amazon EC2",
      "cPanel",
      "PuTTY",
      "Docker",
      "Filezilla",
      "Google Workspace",
      "Google Cloud",
    ],
  },
  {
    icon: Network,
    title: "Networking & Hardware",
    items: [
      "PC Assembly",
      "OS Install & Troubleshoot",
      "Access Point Configuration",
      "Printer Setup",
      "Backup & Recovery",
    ],
  },
  {
    icon: Clapperboard,
    title: "Multimedia & Software",
    items: [
      "OBS Studio",
      "vMix",
      "AutoCAD 2022",
      "Adobe Premiere Pro",
      "Canva",
      "SAP Build Apps",
      "MS Office",
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <Reveal y={30} margin="-100px">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Toolbox
            </p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">
              <span className="text-gradient">Technical Skills</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {groups.map((g, i) => {
            const Icon = g.icon;
            return (
              <Reveal key={g.title} y={25} delay={i * 0.1} margin="-80px">
              <motion.div
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="glass-strong group rounded-3xl p-6 relative overflow-hidden cursor-default hover-glow"
              >
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-hero-gradient opacity-10 blur-3xl transition duration-500 group-hover:opacity-30 group-hover:scale-150" />
                <div className="relative flex items-center gap-3 mb-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-hero-gradient text-primary-foreground shadow-[0_0_24px_rgba(58,138,154,0.35)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">{g.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2 relative">
                  {g.items.map((it, j) => (
                    <motion.span
                      key={it}
                      initial={{ opacity: 0, y: 12, scale: 0.8 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.1 + j * 0.05,
                        ease: "backOut",
                      }}
                      whileHover={{
                        scale: 1.12,
                        y: -3,
                        transition: { duration: 0.2, ease: "easeOut" },
                      }}
                      className="text-xs rounded-full glass px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-default"
                    >
                      {it}
                    </motion.span>
                  ))}
                </div>
              </motion.div></Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
