import type { ReactNode } from "react";
export function Scene({ id, index, eyebrow, title, children, className = "" }: { id: string; index: string; eyebrow: string; title?: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`scene ${className}`} aria-labelledby={`${id}-title`}><div className="scene-meta"><span>{index} / 07</span><span>{eyebrow}</span></div>{title && <h2 id={`${id}-title`} className="scene-title">{title}</h2>}{children}</section>;
}
