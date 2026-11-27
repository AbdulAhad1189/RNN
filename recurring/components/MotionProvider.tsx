"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>(".scene-title, .pullquote, .experiment, .research-row");
      reveals.forEach((element) => gsap.fromTo(element, { y: 24, opacity: 0.25 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      }));
    });
    let frame = 0;
    const tick = (time: number) => { lenis.raf(time); ScrollTrigger.update(); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); ctx.revert(); lenis.destroy(); };
  }, []);
  return children;
}
