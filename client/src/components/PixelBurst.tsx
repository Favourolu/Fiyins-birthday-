import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#d946c8", "#7c3aed", "#f5d68a", "#ffffff"];

export default function PixelBurst({ active, count = 14 }: { active: boolean; count?: number }) {
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const pixels = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 28 + Math.random() * 34;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: 3 + Math.random() * 4,
          color: COLORS[i % COLORS.length],
          delay: Math.random() * 0.06,
        };
      }),
    [count]
  );

  if (reduced) return null;

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
          {pixels.map((p) => (
            <motion.span
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.55, delay: p.delay, ease: "easeOut" }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
