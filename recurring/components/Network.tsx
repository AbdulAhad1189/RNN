"use client";
import { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "./useReducedMotion";

export function Network({ compact = false }: { compact?: boolean }) {
  const ref = useRef<SVGSVGElement>(null); const reduced = useReducedMotion(); const id = useId().replace(/:/g, "");
  useEffect(() => {
    if (!ref.current || reduced) return;
    const ctx = gsap.context(() => { gsap.to(".pulse", { strokeDashoffset: -36, duration: 1.8, repeat: -1, ease: "none", stagger: 0.23 }); gsap.to(".memory-node", { opacity: 0.45, duration: 1.3, yoyo: true, repeat: -1, stagger: 0.16, ease: "sine.inOut" }); }, ref);
    return () => ctx.revert();
  }, [reduced]);
  const y = [110, 210, 310];
  return <svg ref={ref} className={compact ? "network network-compact" : "network"} viewBox="0 0 720 420" role="img" aria-labelledby={`net-title-${id} net-desc-${id}`}><title id={`net-title-${id}`}>A recurrent network unfolded across three moments</title><desc id={`net-desc-${id}`}>Inputs and hidden states progress through time. A curved loop carries the previous state into the next computation.</desc>
    <defs><marker id={`arrow-${id}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="currentColor" strokeWidth="1.3"/></marker></defs>
    {[0,1,2].map((t) => <g key={t} transform={`translate(${80+t*235},0)`}><text x="70" y="32" className="svg-time">t{t===0?"−1":t===1?"":"+1"}</text><circle cx="70" cy="210" r="25" className="node hidden memory-node"/><text x="70" y="215" className="svg-label">h</text><circle cx="70" cy="350" r="17" className="node input"/><text x="70" y="355" className="svg-label">x</text><path d="M70 328V240" className="wire pulse" markerEnd={`url(#arrow-${id})`}/><circle cx="155" cy="210" r="16" className="node output"/><text x="155" y="215" className="svg-label">y</text><path d="M95 210H138" className="wire" markerEnd={`url(#arrow-${id})`}/>{t<2 && <path d="M95 194 C150 130 250 130 305 190" className="wire recurrent pulse" markerEnd={`url(#arrow-${id})`}/>}</g>)}
    <text x="210" y="400" className="svg-note">THE SAME UPDATE, AGAIN</text>
  </svg>;
}
