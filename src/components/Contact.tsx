import { motion } from "framer-motion";
import { Mail, MapPin, Download, Linkedin, Instagram } from "lucide-react";
import Magnetic from "./Magnetic";
import Tilt3D from "./Tilt3D";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <Reveal y={40} margin="-100px">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-10 md:p-14 text-center hover-gradient-border"
        >
          <div className="absolute inset-0 bg-hero-gradient opacity-10 pointer-events-none" />
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-secondary/30 blur-3xl pointer-events-none" />

          <Tilt3D
            rotate={10}
            shift={20}
            className="relative"
            data-cursor="hover"
          >
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Get in Touch
            </p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">
              Let's <span className="text-gradient">build something</span>{" "}
              together
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              I'm open to freelance work, full-time roles, and interesting
              collaborations. Drop me a line and I'll get back to you as soon as
              possible.
            </p>

            <Magnetic
              as="a"
              href="/assets/Curriculum Vitae Zian Wahidi.pdf"
              download
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-hero-gradient px-7 py-3.5 font-semibold text-primary-foreground shadow-[0_0_50px_rgba(58,138,154,0.5)] animate-glow-pulse"
            >
              <Download className="h-5 w-5" /> Download CV
            </Magnetic>

            <div className="mt-10 grid sm:grid-cols-3 gap-4 text-left">
              <a
                href="mailto:zianwhd@gmail.com"
                className="block"
              >
                <Tilt3D
                  rotate={8}
                  shift={12}
                  className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition cursor-default hover-glow"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-semibold">zianwhd@gmail.com</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                </Tilt3D>
              </a>
              <a
                href="https://www.linkedin.com/in/zianwhd"
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Tilt3D
                  rotate={8}
                  shift={12}
                  className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition cursor-default hover-glow"
                >
                  <Linkedin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">LinkedIn</p>
                    <p className="text-sm font-semibold">/in/zianwhd</p>
                  </div>
                </Tilt3D>
              </a>
              <a
                href="https://instagram.com/zianwhd"
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Tilt3D
                  rotate={8}
                  shift={12}
                  className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/10 transition cursor-default hover-glow"
                >
                  <Instagram className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Instagram</p>
                    <p className="text-sm font-semibold">@zianwhd</p>
                  </div>
                </Tilt3D>
              </a>
            </div>
          </Tilt3D>
        </div></Reveal>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Zian Wahidi · Crafted with React, Framer
          Motion &amp; Three.js
        </p>
      </div>
    </section>
  );
}
