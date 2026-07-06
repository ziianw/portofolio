import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Bell, X, ArrowRight } from "lucide-react";
import IntroAnimation from "@/components/IntroAnimation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Testimonials from "@/components/Testimonials";
import Certifications from "@/components/Certifications";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import CustomCursor from "@/components/CustomCursor";

const Scene3D = lazy(() => import("@/components/Scene3D"));

export const Route = createFileRoute("/")({
  component: Index,
});

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left bg-gradient-to-r from-primary via-secondary to-accent"
      style={{ scaleX: scaleY }}
    />
  );
}

function IntroNotification() {
  const [dismissed, setDismissed] = useState(false);

  // Smooth dismiss when user scrolls — interval polling because
  // ScrollTrigger pin suppresses native scroll & RAF events
  useEffect(() => {
    let active = true;
    const id = setInterval(() => {
      if (active && window.scrollY > 50) {
        active = false;
        setDismissed(true);
        clearInterval(id);
      }
    }, 100);
    return () => { active = false; clearInterval(id); };
  }, []);

  return (
    <div className={`intro-notif-overlay ${dismissed ? "dismissed" : "show"}`}>
      <div className="glass rounded-2xl p-6 md:p-8 w-[280px] md:w-[360px] relative text-center border-amber-500/40">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="inline-flex justify-center mb-4 w-full">
          <div className="relative inline-flex">
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-amber-400/20 border-2 border-amber-400/50 shadow-lg shadow-amber-400/20">
              <Bell className="h-6 w-6 text-amber-300" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white ring-2 ring-background">
              1
            </span>
          </div>
        </div>

        <h4 className="text-lg md:text-xl font-bold text-white mb-2 font-display">
          1 New Notification
        </h4>

        <p className="text-sm md:text-base text-white/70 leading-relaxed mb-5 text-balance">
          Something captivating is hiding just below. Scroll to find out.
        </p>

        <button
          onClick={() => setDismissed(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition hover:scale-105 hover:shadow-amber-500/50 cursor-pointer mx-auto"
        >
          Discover Now
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Index() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <ScrollProgress />
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>
      <CustomCursor />
      <div className="relative">
        <IntroAnimation onIntroComplete={() => setIntroDone(true)} />
        <IntroNotification />
      </div>
      <Navbar hidden={!introDone} />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Testimonials />
        <Certifications />
        {/* <Gallery /> */}
        <Contact />
      </main>
    </div>
  );
}
