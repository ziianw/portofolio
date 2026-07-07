import { motion } from "framer-motion";
import { GraduationCap, MapPin, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="relative py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <Reveal y={30} margin="-100px">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              About
            </p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">
              <span className="text-gradient">Behind the Code</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-12 gap-6">
          <Reveal
            y={30}
            delay={0.1}
            margin="-80px"
            className="md:col-span-7"
          >
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="glass-strong rounded-3xl p-8 h-full"
            >
              <p className="text-lg leading-relaxed text-muted-foreground" style={{textAlign: "justify"}}>
                Bridging the gap between clean code and reliable infrastructure is what drives me. From crafting responsive corporate sites & event and system dashboards to optimizing cloud environments, the focus is always on building digital solutions that just work.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed" style={{textAlign: "justify"}}>
                Balancing work while pursuing an Informatics Engineering degree at Paramadina University has shaped me into a disciplined, highly adaptable professional and a fast learner who is always keen to absorb new knowledge. I’m all about prioritizing effectively and taking full ownership of my tasks whether that means writing sharp system documentation, running live event multimedia, or automating workflows.
              </p>
            </motion.div>
          </Reveal>

          <Reveal
            y={30}
            delay={0.2}
            margin="-80px"
            className="md:col-span-5"
          >
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.03, x: 4, transition: { duration: 0.3 } }}
                className="glass rounded-2xl p-5 flex items-center gap-4 cursor-default hover-glow transition-all duration-300"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-hero-gradient text-primary-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Based in
                  </p>
                  <p className="font-semibold">East Jakarta, DKI Jakarta</p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, x: 4, transition: { duration: 0.3 } }}
                className="glass rounded-2xl p-5 flex items-center gap-4 cursor-default hover-glow transition-all duration-300"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-hero-gradient text-primary-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Education
                  </p>
                  <p className="font-semibold">Paramadina University</p>
                  <p className="text-xs text-muted-foreground">
                    Informatics Engineering
                  </p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03, x: 4, transition: { duration: 0.3 } }}
                className="glass rounded-2xl p-5 flex items-center gap-4 cursor-default hover-glow transition-all duration-300"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-hero-gradient text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Focus
                  </p>
                  <p className="font-semibold">Web · Dashboard · Networking · Problemsolving</p>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
