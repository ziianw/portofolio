import { Suspense, lazy } from "react";
import { TooltipProvider } from "./components/ui/tooltip";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Testimonials from "./components/Testimonials";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import CustomCursor from "./components/CustomCursor";

const Scene3D = lazy(() => import("./components/Scene3D"));

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
        <CustomCursor />
        <Navbar />
        <main className="relative z-10">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Testimonials />
          <Certifications />
          <Contact />
        </main>
      </div>
    </TooltipProvider>
  );
}
