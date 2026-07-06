import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Building2,
  FileText,
  BookOpen,
  ExternalLink,
  FolderKanban,
} from "lucide-react";
import Tilt3D from "./Tilt3D";
import Reveal from "./Reveal";

const projects = [
  {
    title: "Sowatrace Dashboard",
    year: 2026,
    category: "Dashboard",
    icon: FolderKanban,
    gradient: "from-cyan-600 to-blue-700",
    photo: "/assets/projects/dbrd-3.png",
    desc: "Digital logistics monitoring dashboard focused on ESG transparency and real-time operational data tracking.",
    url: "",
  },
    {
    title: "Pusat Hiperkes K3 DKI Jakarta",
    year: 2026,
    category: "Web",
    icon: Globe,
    gradient: "from-cyan-600 to-blue-700",
    photo: "/assets/projects/wbst-6.png",
    desc: "Official public service site for occupational health & safety. Integrated training & seminar scheduling with 3rd-party APIs.",
    url: "https://pusatk3-hiperkesdkijakarta.id",
  },
  {
    title: "SAP Connect Day for Finance & Spend",
    year: 2026,
    category: "Web",
    icon: FileText,
    gradient: "from-sky-500 to-blue-700",
    photo: "/assets/projects/sap-connect.png",
    desc: "A corporate event portal detailing session tracks on agile finance, resilient procurement, and business AI advancements powered by SAP solutions.",
    url: "https://indomarketservices.com/event/SAP-Connect-Day-for-Finance-and-Spend-Management/",
  },
  {
    title: "Metrodata & Google Cloud Gemini Enterprise",
    year: 2026,
    category: "Web",
    icon: FileText,
    gradient: "from-blue-500 to-cyan-600",
    photo: "/assets/projects/metrodata-gemini.png",
    desc: "An executive event microsite highlighting how to leverage Google Cloud's Gemini Enterprise to build and orchestrate smart AI agents for enterprise competitive edge.",
    url: "https://indomarketservices.com/event/Metrodata-Google-Cloud-Turning-Gemini-Enterprise-into-Your-Competitive-Edge/",
  },
  {
    title: "Anaplan Connect Jakarta 2026",
    year: 2026,
    category: "Web",
    icon: FileText,
    gradient: "from-blue-600 to-indigo-800",
    photo: "/assets/projects/anaplan-2026.png",
    desc: "An elegant event registration web page for Anaplan Connect Jakarta, focusing on AI-driven scenario planning for supply chain and finance leaders.",
    url: "https://indomarketservices.com/event/Anaplan-Connect-Jakarta-2026/",
  },
  {
    title: "Portfolio Zian Wahidi 2025",
    year: 2025,
    category: "Web",
    icon: Globe,
    gradient: "from-cyan-600 to-blue-700",
    photo: "/assets/projects/wbst-5.png",
    desc: "My 2025 portfolio website that summarizes my full-stack web development skills, certifications, and completed projects.",
    url: "https://ziianw.github.io/portofolio-zianwahidi/",
  },
  {
    title: "AWS Dataiku Enterprise AI Seminar",
    year: 2026,
    category: "Web",
    icon: FileText,
    gradient: "from-orange-500 to-yellow-600",
    photo: "/assets/projects/aws-dataiku.png",
    desc: "An exclusive roundtable seminar page about optimizing SAP and transforming ERP data into AI-driven insights using AWS and Dataiku solutions.",
    url: "https://indomarketservices.com/event/AWS-Dataiku-MII-Soltius-Transform-ERP-Data-Into-an-Enterprise-Al-Driven-Insights-with-AWS-and-Dataiku/",
  },
    {
    title: "Sintetis Academy",
    year: 2025,
    category: "Web",
    icon: Globe,
    gradient: "from-cyan-600 to-blue-700",
    photo: "/assets/projects/wbst-3.png",
    desc: "Interactive, bilingual educational platform supporting learning ecosystems, focusing on collaboration and skills development.",
    url: "",
  },
  {
    title: "Netpoleon Solution Day 2025",
    year: 2025,
    category: "Web",
    icon: FileText,
    gradient: "from-purple-600 to-indigo-700",
    photo: "/assets/projects/netpoleon-2025.png",
    desc: "A conference page built for security leaders, discussing automated defense strategies against cyber threats and safe AI data innovation.",
    url: "https://indomarketservices.com/event/Netpoleon-Solution-Day-2025/",
  },
  {
    title: "Google Cloud Jakarta Golf Tournament",
    year: 2025,
    category: "Web",
    icon: FileText,
    gradient: "from-green-600 to-emerald-700",
    photo: "/assets/projects/google-golf.png",
    desc: "A clean and sporty tournament registration landing page built for the Google Cloud Jakarta executive networking event at Pondok Indah Golf Course.",
    url: "https://indomarketservices.com/event/Google-Cloud-Jakarta-Golf-Tournament/",
  },
    {
    title: "PT. Srikandi Katiga",
    year: 2025,
    category: "Web",
    icon: Globe,
    gradient: "from-cyan-600 to-blue-700",
    photo: "/assets/projects/wbst-2.png",
    desc: "Official company profile for K3 services, providing easy access to service information, certifications, and training schedules.",
    url: "",
  },
    {
    title: "E-Arsip Dashboard",
    year: 2025,
    category: "Dashboard",
    icon: FolderKanban,
    gradient: "from-cyan-600 to-blue-700",
    photo: "/assets/projects/dbrd-2.png",
    desc: "Digital correspondence management system for Firma Hukum Seduluran Tanpa Batas, designed to organize incoming and outgoing mail.",
    url: "",
  },
      {
    title: "Firma Hukum Seduluran Tanpa Batas",
    year: 2025,
    category: "Web",
    icon: Globe,
    gradient: "from-cyan-600 to-blue-700",
    photo: "/assets/projects/wbst-4.png",
    desc: "Official company profile for Firma Hukum STB & Partners, showcasing legal advocacy services and partner credentials.",
    url: "",
  },
    {
    title: "Accelerate Surabaya 2024",
    year: 2024,
    category: "Web",
    icon: FileText,
    gradient: "from-red-600 to-amber-700",
    photo: "/assets/projects/fortinet-surabaya.png",
    desc: "An event microsite for Fortinet Accelerate Asia 2024 in Surabaya, highlighting cybersecurity strategies, technical tracks, and AI platform security.",
    url: "https://indomarketservices.com/event/Accelerate-Surabaya-2024/",
  },  
  {
    title: "Kong API Summit 2024",
    year: 2024,
    category: "Web",
    icon: FileText,
    gradient: "from-cyan-600 to-blue-700",
    photo: "/assets/projects/kong-api.png",
    desc: "A public landing page for Kong's in-person summit in Jakarta, focused on API management, security, and AI-driven technology integration.",
    url: "https://indomarketservices.com/event/Kong-api-summit-2024/",
  },
    {
    title: "E-Legalitas Dashboard",
    year: 2024,
    category: "Dashboard",
    icon: FolderKanban,
    gradient: "from-cyan-600 to-blue-700",
    photo: "/assets/projects/dbrd-1.png",
    desc: "Corporate legal document management system for PT. Dutaraya Dinametro and its subsidiaries, simplifying document tracking and digital archiving.",
    url: "",
  },
    {
    title: "PT. Selvi Bahagia Utama",
    year: 2024,
    category: "Web",
    icon: Globe,
    gradient: "from-cyan-600 to-blue-700",
    photo: "/assets/projects/wbst-1.png",
    desc: "Official corporate site for PT. Dutaraya Dinametro's property subsidiary, featuring project portfolios and development progress.",
    url: "https://ziianw.github.io/selvibahagiautama/",
  },
    {
    title: "Shoot & Edit Video Drone Graha Karangsari Karawang",
    year: 2024,
    category: "Videographer",
    icon: FileText,
    gradient: "from-cyan-600 to-blue-700",
    photo: "/assets/projects/vdgr-1.png",
    desc: "Commercial multimedia project featuring aerial drone photography and professional video editing for property marketing.",
    url: "https://www.youtube.com/watch?v=_jijrgVq7GU",
  },
];

const categories = ["All", "Web", "Dashboard", "Videographer"];

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [contactPopup, setContactPopup] = useState<string | null>(null);

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-24 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <Reveal y={30} margin="-100px">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Portfolio
            </p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">
              <span className="text-gradient">Featured Projects</span>
            </h2>
          </div>
        </Reveal>

        {/* Filter pills */}
        <Reveal y={16} delay={0.15} margin="-80px">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                filter === cat
                  ? "bg-hero-gradient text-primary-foreground shadow-[0_0_24px_rgba(58,138,154,0.4)]"
                  : "glass text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div></Reveal>

        {/* Project cards grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const Icon = p.icon;
              const isHovered = hoveredId === p.title;

              return (
                <motion.div
                  key={p.title}
                  layout
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{
                    duration: 0.45,
                    delay: i * 0.06,
                    ease: "easeOut",
                  }}
                  onMouseEnter={() => setHoveredId(p.title)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Tilt3D
                    rotate={8}
                    shift={10}
                    className="glass-strong rounded-2xl overflow-hidden cursor-default group h-full flex flex-col"
                  >
                    {/* Thumbnail area — supports photo or gradient fallback */}
                    <div
                      className={`relative h-40 flex items-center justify-center overflow-hidden ${
                        p.photo ? "" : `bg-gradient-to-br ${p.gradient}`
                      }`}
                    >
                      {p.photo ? (
                        <img
                          src={p.photo}
                          alt={p.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <>
                          {/* Decorative circles */}
                          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
                          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

                          {/* Icon */}
                          <Icon className="h-14 w-14 text-white/60 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:text-white/80" />
                        </>
                      )}

                      {/* Year badge */}
                      <span className="absolute top-3 right-3 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-white/90">
                        {p.year}
                      </span>

                      {/* Category badge */}
                      <span className="absolute top-3 left-3 rounded-full bg-white/15 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white/80">
                        {p.category}
                      </span>

                      {/* Hover overlay */}
                      <motion.div
                        className="absolute inset-0 bg-black/60 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {p.url ? (
                          <motion.a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white hover:bg-white/30 transition"
                            initial={{ y: 12, opacity: 0 }}
                            animate={{
                              y: isHovered ? 0 : 12,
                              opacity: isHovered ? 1 : 0,
                            }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View Project
                          </motion.a>
                        ) : (
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              setContactPopup(p.title);
                            }}
                            className="inline-flex items-center gap-2 rounded-full bg-hero-gradient backdrop-blur-md px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg hover:scale-105 transition"
                            initial={{ y: 12, opacity: 0 }}
                            animate={{
                              y: isHovered ? 0 : 12,
                              opacity: isHovered ? 1 : 0,
                            }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Contact Me
                          </motion.button>
                        )}
                      </motion.div>
                    </div>

                    {/* Card body */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                        {p.desc}
                      </p>

                      {/* Read more link */}
                      {p.url ? (
                        <motion.a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors mt-auto"
                          whileHover={{ x: 4 }}
                        >
                          Read more
                          <motion.span
                            animate={{ x: isHovered ? 3 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            →
                          </motion.span>
                        </motion.a>
                      ) : (
                        <motion.button
                          onClick={() => setContactPopup(p.title)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors mt-auto cursor-pointer"
                          whileHover={{ x: 4 }}
                        >
                          Contact Me
                          <motion.span
                            animate={{ x: isHovered ? 3 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            →
                          </motion.span>
                        </motion.button>
                      )}
                    </div>
                  </Tilt3D>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Contact Me popup */}
      <AnimatePresence>
        {contactPopup && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setContactPopup(null)}
            />

            {/* Popup card */}
            <motion.div
              className="relative glass-strong rounded-2xl p-8 md:p-10 max-w-md w-full text-center"
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <button
                onClick={() => setContactPopup(null)}
                className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>

              <div className="inline-flex justify-center mb-5 w-full">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-hero-gradient shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Interested in this Project?
              </h3>

              <p className="text-sm text-white/70 leading-relaxed mb-6 text-balance">
                This project is not publicly available. Reach out to me directly to learn more about it.
              </p>

              <a
                href={`mailto:zianwhd@gmail.com?subject=Project Inquiry: ${encodeURIComponent(contactPopup || "")}`}
                onClick={() => setContactPopup(null)}
                className="inline-flex items-center gap-2 rounded-lg bg-hero-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:scale-105 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Contact Me
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
