import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

const testimonials = [
  {
    name: "Mrs. Wahyuningdiah Trisari Harsanti Putri, M.T.I",
    role: "Motivator and Lecturer",
    company: "Paramadina University",
    quote:
      "Zian is a responsible student, eager to learn, shows motivation and capable leader. Bright future ahead for Zian!",
    initials: "WT",
    photo: "/assets/testimonials/wahyuningdiah.jpg",
  },
  {
    name: "Mr. Muhammad Darwis, S.Kom., M. Kom",
    role: "HR Manager at GNOTA Foundation & Lecturer",
    company: "Paramadina University",
    quote:
      "Zian memiliki jiwa kepempinan yang baik. Bertanggung jawab, bersahaja dan selalu merangkul teman-teman yang lain. Zian sangat berpotensi dimasa depan. Tetap semangat!",
    initials: "MD",
    photo: "/assets/testimonials/darwis.jpg",
  },
  {
    name: "Mrs. Manda Ramadhani",
    role: "Project Manager",
    company: "PT. Jovenindo Inti Solusi",
    quote:
      "Sebagai rekan kerja, bagi saya Zian Wahidi adalah seorang yang sangat tekun, memiliki jiwa integritas yang tinggi dan selalu mencari pengetahuan mengenai teknologi yang berkembang pada saat ini. Dalam hal ini tentunya beliau banyak mendapatkan ilmu yang dapat dikembangkan untuk masa depannya, Dalam hal kolaborasi beliau selalu aktif baik dengan pimpinan, sesama rekan kerja dan juga pihak external seperti client, vendor maupun customer. Beliau sangat sering berdiskusi, berbagi ilmu dan juga pengalaman dalam hal pembelajaran. Semangat terus untuk Zian, semoga selalu menjadi inspirasi bagi semua orang",
    initials: "MR",
    photo: "/assets/testimonials/ramadhani.jpg",
  },
  {
    name: "Karunia Sekar Dwi Meylany, A.m.d Ak, CTT",
    role: "Chief HR Officer",
    company: "PT. Dutaraya Dinametro",
    quote:
      "Selama satu tahun masa magangnya di PT Dutaraya Dinametro, Zian telah memberikan kontribusi yang luar biasa. Zian telah menunjukkan dedikasi dan kinerja yang sangat baik dalam berbagai bidang, mulai dari membuat website perusahaan, membantu proses administrasi keuangan, hingga memberikan dukungan teknis terkait kebutuhan karyawan. Selain itu, Zian juga terlibat secara aktif dalam proses tender untuk mendapatkan proyek pemerintah dan berhasil mempelajari proses bisnis perusahaan dengan cepat dan mendalam. Keberhasilan ini tidak hanya mencerminkan kemampuan teknisnya tetapi juga etos kerjanya yang luar biasa. Terima kasih, Zian, atas semua kontribusi dan kerja keras yang telah diberikan. Kami mendoakan kesuksesanmu di masa depan!",
    initials: "KS",
    photo: "/assets/testimonials/karunia.jpg",
  },
  // {
  //   name: "Event Manager",
  //   role: "Metrodata Solution Day 2024",
  //   company: "PT. Metrodata Electronics",
  //   quote:
  //     "Zian was our go-to for the microsite and technical direction on stage. Sharp execution end-to-end.",
  //   initials: "MS",
  // },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const total = testimonials.length;

  // Animate cards on index change
  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const offset = i - index;
      const abs = Math.abs(offset);
      gsap.to(card, {
        xPercent: offset * 50,
        scale: abs === 0 ? 1 : 0.82 - abs * 0.06,
        opacity: abs > 2 ? 0 : 1 - abs * 0.28,
        rotationY: offset * -14,
        zIndex: 100 - abs,
        filter: `blur(${abs === 0 ? 0 : abs * 2}px)`,
        duration: 0.8,
        ease: "power3.out",
      });
    });
  }, [index]);

  // Autoplay
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total]);

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);

  return (
    <section id="testimonials" className="relative py-24 px-4 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <Reveal y={30} margin="-100px">
          <div className="mb-14 text-center">
            <p className="text-sm font-medium text-primary uppercase tracking-widest">
              Testimonials
            </p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold">
              <span className="text-gradient">Kind Words</span> from Collaborators
            </h2>
          </div>
        </Reveal>

        <div
          ref={trackRef}
          className="relative h-[480px] sm:h-[420px] flex items-center justify-center"
          style={{ perspective: "1600px" }}
        >
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`absolute glass-strong rounded-3xl p-8 md:p-10 ${
                t.quote.length > 300
                  ? "w-[95%] sm:w-[720px] md:w-[800px]"
                  : t.quote.length > 200
                    ? "w-[93%] sm:w-[660px] md:w-[740px]"
                    : "w-[90%] sm:w-[600px]"
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Quote className="h-10 w-10 text-primary/70 mb-4" />
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="mt-6 flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-hero-gradient overflow-hidden">
                  {t.photo ? (
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <span className={`text-primary-foreground font-bold text-sm ${t.photo ? "hidden" : ""}`}>
                    {t.initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            className="glass grid h-11 w-11 place-items-center rounded-full transition hover:scale-110 hover:bg-white/10"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-8 bg-hero-gradient"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            className="glass grid h-11 w-11 place-items-center rounded-full transition hover:scale-110 hover:bg-white/10"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
