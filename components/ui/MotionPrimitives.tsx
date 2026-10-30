'use client';

import { type ReactNode } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, useIsPresent, useReducedMotion, useScroll, useSpring } from 'framer-motion';

export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation} strict><MotionConfig reducedMotion="user">{children}<ScrollProgress /></MotionConfig></LazyMotion>;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 32, restDelta: 0.001 });
  const reduceMotion = useReducedMotion();
  return <m.div className="reading-progress" aria-hidden="true" style={{ scaleX: reduceMotion ? scrollYProgress : smoothProgress }} />;
}

/** Hover/tap belongs to this shell; GSAP reveals the content inside it. */
export function InteractiveSurface({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return <m.div className={`interactive-surface ${className}`} initial={false} whileHover={reduceMotion ? undefined : { y: -5 }} whileTap={reduceMotion ? undefined : { scale: 0.985 }} transition={{ type: 'spring', stiffness: 360, damping: 28 }}>{children}</m.div>;
}

interface AnimatedPanelProps { open: boolean; id: string; className?: string; children: ReactNode; }
export function AnimatedPanel({ open, id, className, children }: AnimatedPanelProps) {
  return <AnimatePresence initial={false}>{open && <PanelContents key={id} id={id} className={className}>{children}</PanelContents>}</AnimatePresence>;
}

function PanelContents({ id, className, children }: Omit<AnimatedPanelProps, 'open'>) {
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();
  return <m.div id={id} inert={!isPresent} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}><div className={className}>{children}</div></m.div>;
}
