import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import Reveal from "./Reveal";

const experiences = [
  {
    company: "PT. Jovenindo Inti Solusi",
    role: "Web Developer & IT Support",
    period: "Jun 2024 – Present",
    type: "Full-time",
    location: "Jakarta, Indonesia",
    highlights: [
      "Built responsive landing pages for AWS, Metrodata, Anaplan, SAP, and Netpoleon event pages.",
      "Deployed and configured web apps on Amazon EC2, cPanel (Hostinger/Niagahoster), and GitHub.",
      "Maintained internal network with 99% uptime and zero data loss across 2 years of weekly backups.",
      "Ran multimedia (OBS Studio / vMix) as FOH operator for 50+ corporate live events.",
      "Authored PDCA-based technical docs used by 15+ internal staff for onboarding.",
    ],
  },
  {
    company: "Pusat Hiperkes & Kesehatan Kerja DKI Jakarta",
    role: "Web Developer (Project)",
    period: "February 2025",
    type: "Project",
    location: "Jakarta, Indonesia",
    highlights: [
      "Designed and built the official site pusatk3-hiperkesdkijakarta.id for public services.",
      "Integrated 3rd-party APIs for real-time training and seminar scheduling.",
      "Managed hosting, performance, security, and delivered user training for 5 internal staff.",
    ],
  },
  {
    company: "PT. Dutaraya Dinametro",
    role: "IT Support (Internship)",
    period: "Jun 2023 – May 2024",
    type: "Internship",
    location: "Jakarta, Indonesia",
    highlights: [
      "Built the company profile & E-Legalitas system for subsidiary PT Selvi Bahagia Utama.",
      "Handled LPSE & E-Catalogue tender administration end-to-end.",
      "Assembled & maintained 3 high-spec PCs for the Drafter team; designed CAD floor plans.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <Reveal y={30} margin="-100px">
          <div className="mb-14 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Journey
            </p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">
              <span className="text-gradient">Work Experience</span>
            </h2>
          </div>
        </Reveal>

        <div className="relative">
          {/* timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-secondary/60 to-accent/60 md:-translate-x-1/2" />

          <div className="space-y-10 md:space-y-16">
            {experiences.map((exp, i) => (
              <Reveal key={exp.company} y={40} delay={i * 0.12} margin="-100px">
                <div className="relative md:grid md:grid-cols-2 md:gap-10">
                  {/* Timeline dot — always centered */}
                  <div className="absolute left-4 md:left-1/2 top-6 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-hero-gradient text-primary-foreground shadow-[0_0_24px_rgba(58,138,154,0.5)] z-10">
                    <Briefcase className="h-4 w-4" />
                  </div>

                  {/* Card — zig-zag: even=left, odd=right */}
                  <motion.div
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                    className={`glass-strong rounded-2xl p-6 ml-14 md:ml-0 ${
                      i % 2 === 0
                        ? "md:col-start-1 md:col-end-2 md:mr-8"
                        : "md:col-start-2 md:col-end-3 md:ml-8"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-semibold rounded-full bg-white/10 px-2.5 py-0.5">
                        {exp.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {exp.period}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{exp.role}</h3>
                    <p className="text-sm text-primary mt-0.5">{exp.company}</p>
                    <p className="text-xs text-muted-foreground">
                      {exp.location}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {exp.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
