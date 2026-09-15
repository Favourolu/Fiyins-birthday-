import { useMemo } from "react";

const COLORS = ["#d946c8", "#7c3aed", "#f5d68a"];

export default function FloatingPixels({ count = 10 }: { count?: number }) {
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const pixels = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        color: COLORS[i % COLORS.length],
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 6,
        driftX: (Math.random() - 0.5) * 60,
        driftY: (Math.random() - 0.5) * 60,
      })),
    [count]
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {pixels.map((p) => (
        <span
          key={p.id}
          style={
            {
              position: "absolute",
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: 1,
              "--drift-x": `${p.driftX}px`,
              "--drift-y": `${p.driftY}px`,
              animation: `pixel-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
