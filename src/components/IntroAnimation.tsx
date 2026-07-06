import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface Props {
  onIntroComplete?: () => void;
}

export default function IntroAnimation({ onIntroComplete }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const text = textRef.current;
    if (!wrapper || !text) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(text, {
        type: "chars,words",
        charsClass: "intro-char",
      });

      const scrollTween = gsap.to(text, {
        xPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          start: "top top",
          // Quick snap: intro completes right after text finishes revealing
          end: "+=600px",
          scrub: 1,
          onLeave: () => onIntroComplete?.(),
          onEnterBack: () => onIntroComplete?.(),
        },
      });

      split.chars.forEach((char) => {
        gsap.from(char, {
          yPercent: () => gsap.utils.random(-200, 200),
          rotation: () => gsap.utils.random(-20, 20),
          scale: 0.3,
          opacity: 0,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: char,
            containerAnimation: scrollTween,
            start: "left 100%",
            end: "left 30%",
            scrub: 1.2,
          },
        });
      });
    }, wrapper);

    return () => ctx.revert();
  }, [onIntroComplete]);

  return (
    <section ref={wrapperRef} className="intro-horizontal">
      <div className="intro-container">
        <h3 ref={textRef} className="intro-text">
        Hello
          <span className="intro-icon inline-flex items-center mx-[0.5vw]">
            <span className="inline-block text-[0.85em] leading-none">
              🌎 !
            </span>
          </span>{" "}
        You have entered the digital canvas of .....
          <span className="text-gradient">Zian Wahidi</span>
        </h3>
      </div>
    </section>
  );
}