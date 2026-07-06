import { motion } from "framer-motion";
import { Award, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Reveal from "./Reveal";

const certs = [
{
    name: "Prompt Design in Vertex AI",
    org: "Google Cloud",
    date: "Jan 2025",
    url: "https://www.skills.google/public_profiles/9a28321e-3de2-4c2e-ae5c-b0b343a4fe36/badges/13777986",
  },
  {
    name: "Code Generation and Optimization Using IBM Granite",
    org: "IBM SkillsBuild",
    date: "Jul 2025",
    url: "https://www.credly.com/badges/8caa8f43-decc-4538-add2-60e2b759feab",
  },
  {
    name: "Training Data Science Explore (SAP Analytics & Build Apps)",
    org: "ASEAN Foundation",
    date: "May 2024",
    url: "/certificates/asean-data-science.pdf",
  },
  {
    name: "Kompetensi Level II Jaringan dan Komputer",
    org: "Lembaga Sertifikasi Profesi (LSP)", // Silakan ganti nama lembaga/org yang sesuai
    date: "Dec 2024", // Silakan ganti dengan bulan dan tahun penerbitan yang sesuai
    url: "/certificates/kompetensi-jaringan-level2.pdf",
  },
  {
    name: "Training Fullstack Web Developer",
    org: "Harisenin.com",
    date: "Jan 2024",
    url: "/certificates/harisenin-fullstack.pdf",
  },
  {
    name: "JavaScript Algorithms and Data Structures",
    org: "FreeCodeCamp",
    date: "Dec 2023",
    url: "/certificates/fcc-js-algorithms.pdf",
  },
  {
    name: "Safety Leadership",
    org: "WSO Indonesia",
    date: "Dec 2023",
    url: "/certificates/wso-safety-leadership.pdf",
  },
  {
    name: "Fundamental Front-End & Laravel",
    org: "Coding Studio",
    date: "Sep 2023",
    url: "/certificates/coding-studio-laravel.pdf",
  },
  {
    name: "Holistic Safety Coaching Introduction",
    org: "Prosyd Academy", // Silakan ganti nama lembaga/org yang sesuai
    date: "Feb 2023", // Silakan ganti dengan bulan dan tahun penerbitan yang sesuai
    url: "/certificates/holistic-safety-coaching.pdf",
  },
  {
    name: "TOEFL Institutional Testing (Score: 447)",
    org: "Brighten English",
    date: "Feb 2023",
    url: "/certificates/toefl-447.pdf",
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <Reveal y={30} margin="-100px">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Credentials
            </p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">
              <span className="text-gradient">Certifications</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.slice(0, -1).map((c, i) => (
            <Reveal key={c.name} y={12} scale={0.95} delay={i * 0.05} margin="-80px">
            <motion.div
              whileHover={{
                y: -6,
                scale: 1.03,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="glass rounded-2xl p-5 flex gap-4 cursor-default hover-glow transition-all duration-300 relative group"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-hero-gradient text-primary-foreground">
                <Award className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1 pr-10">
                <p className="font-semibold text-sm leading-snug">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {c.org} · {c.date}
                </p>
              </div>

              {/* Cute round button with tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-hero-gradient text-primary-foreground shadow-[0_0_16px_rgba(58,138,154,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 hover:shadow-[0_0_28px_rgba(58,138,154,0.6)]"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="h-4 w-4" />
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>View Certificate</p>
                </TooltipContent>
              </Tooltip>
            </motion.div></Reveal>
          ))}
        </div>

        {/* Last certification centered below */}
        <div className="mt-4 flex justify-center">
          <Reveal y={12} scale={0.95} delay={0.5} margin="-80px" className="w-full sm:w-auto">
            <motion.div
              whileHover={{
                y: -6,
                scale: 1.03,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="glass rounded-2xl p-5 flex gap-4 cursor-default hover-glow transition-all duration-300 relative group sm:w-[400px] w-full"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-hero-gradient text-primary-foreground">
                <Award className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1 pr-10">
                <p className="font-semibold text-sm leading-snug">{certs[certs.length - 1].name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {certs[certs.length - 1].org} · {certs[certs.length - 1].date}
                </p>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.a
                    href={certs[certs.length - 1].url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-hero-gradient text-primary-foreground shadow-[0_0_16px_rgba(58,138,154,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 hover:shadow-[0_0_28px_rgba(58,138,154,0.6)]"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye className="h-4 w-4" />
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>View Certificate</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
