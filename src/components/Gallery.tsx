import { useRef, useEffect } from "react";
import {
  Code2,
  Cloud,
  Network,
  Clapperboard,
  Smartphone,
  Database,
  BarChart3,
  Shield,
  Palette,
} from "lucide-react";
import Reveal from "./Reveal";

const galleryItems = [
  { title: "Web Development", desc: "Responsive sites, dashboards & landing pages", gradient: "from-cyan-600 to-blue-700", icon: Code2 },
  { title: "Cloud Infrastructure", desc: "AWS EC2, Route 53, cPanel deployment", gradient: "from-emerald-600 to-teal-700", icon: Cloud },
  { title: "Networking", desc: "Access point setup & network maintenance", gradient: "from-violet-600 to-purple-700", icon: Network },
  { title: "Multimedia", desc: "OBS Studio, vMix, live event production", gradient: "from-rose-600 to-pink-700", icon: Clapperboard },
  { title: "Mobile Ready", desc: "Responsive design across all devices", gradient: "from-sky-600 to-cyan-700", icon: Smartphone },
  { title: "Database", desc: "MySQL, backup & recovery management", gradient: "from-amber-600 to-orange-700", icon: Database },
  { title: "Analytics", desc: "Data-driven insights & reporting", gradient: "from-lime-600 to-green-700", icon: BarChart3 },
  { title: "Security", desc: "System hardening & data protection", gradient: "from-indigo-600 to-blue-700", icon: Shield },
  { title: "UI/UX Design", desc: "Clean, modern interfaces with Figma", gradient: "from-fuchsia-600 to-purple-700", icon: Palette },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const strip = stripRef.current;
    const cardsContainer = cardsRef.current;
    if (!section || !strip || !cardsContainer) return;

    // ── Dimensions ──
    const getSd = () => {
      const cardsWidth = cardsContainer.scrollWidth;
      const vw = window.innerWidth;
      const stripStyle = getComputedStyle(strip);
      const paddingLeft = parseFloat(stripStyle.paddingLeft) || 0;
      return Math.max(cardsWidth + paddingLeft - vw, 0);
    };

    let sd = getSd();
    let targetX = 0;

    section.style.height = "100vh";
    // CSS transition handles smoothness (GPU-accelerated, no JS rAF needed)
    strip.style.transition = "transform 0.12s linear";

    const apply = (x: number) => {
      targetX = Math.max(0, Math.min(x, sd));
      strip.style.transform = `translateX(${-targetX}px)`;
    };

    // ── Active: gallery overlaps the central 40%+ of viewport ──
    const isActive = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      return rect.top < vh * 0.3 && rect.bottom > vh * 0.7;
    };

    // ── Wheel ──
    const handleWheel = (e: WheelEvent) => {
      if (!isActive()) return;
      if ((e.deltaY > 0 && targetX < sd) || (e.deltaY < 0 && targetX > 0)) {
        e.preventDefault();
        apply(targetX + e.deltaY);
      }
    };

    // ── Touch ──
    let ty = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (!isActive()) return;
      ty = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isActive()) return;
      const dy = ty - e.touches[0].clientY;
      if ((dy > 0 && targetX < sd) || (dy < 0 && targetX > 0)) {
        e.preventDefault();
        apply(targetX + dy);
      }
      ty = e.touches[0].clientY;
    };

    // ── Keyboard ──
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive()) return;
      const step = e.key === "PageDown" || e.key === "PageUp" ? 300 : 80;
      if ((e.key === "ArrowDown" || e.key === "PageDown" || e.key === "ArrowRight") && targetX < sd) {
        e.preventDefault();
        apply(targetX + step);
      } else if ((e.key === "ArrowUp" || e.key === "PageUp" || e.key === "ArrowLeft") && targetX > 0) {
        e.preventDefault();
        apply(targetX - step);
      }
    };

    // ── Resize ──
    const onResize = () => {
      sd = getSd();
      if (targetX > sd) apply(sd);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => {
      sd = getSd();
      if (targetX > sd) apply(sd);
    });
    ro.observe(cardsContainer);

    return () => {
      ro.disconnect();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="relative">
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="pt-12 md:pt-16 pb-4 md:pb-6 text-center shrink-0">
          <Reveal y={20}>
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Gallery
            </p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">
              <span className="text-gradient">What I Do</span>
            </h2>
          </Reveal>
        </div>

        <div className="flex-1 flex items-center">
          <div
            ref={stripRef}
            className="flex flex-nowrap pl-[5vw] md:pl-[10vw]"
          >
            <div ref={cardsRef} className="flex flex-nowrap">
              {galleryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="gallery-card group">
                    <div
                      className={`relative h-full w-full rounded-3xl p-8 flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-br ${item.gradient} shadow-2xl`}
                    >
                      <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                      <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                          <Icon className="h-9 w-9 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-white/80 max-w-[200px] mt-1.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full border-[1.5px] border-white/10 pointer-events-none" />
                      <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full border-[1.5px] border-white/10 pointer-events-none" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full rounded-full border-[1px] border-white/5 pointer-events-none" />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-[10vw] shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
