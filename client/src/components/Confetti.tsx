import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#d946c8", "#7c3aed", "#f5d68a", "#f472b6", "#ffffff"];

export default function Confetti({ pieces = 60 }: { pieces?: number }) {
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const items = useMemo(
    () =>
      Array.from({ length: reduced ? 0 : pieces }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 3 + Math.random() * 2.5,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 6,
      })),
    [pieces, reduced]
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {items.map((item) => (
        <motion.span
          key={item.id}
          initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: item.rotate }}
          transition={{ duration: item.duration, delay: item.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            left: `${item.left}%`,
            width: item.size,
            height: item.size * 0.4,
            backgroundColor: item.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}
