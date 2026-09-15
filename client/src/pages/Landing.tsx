import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import SceneErrorBoundary from "../components/SceneErrorBoundary";

const BirthdayScene = lazy(() => import("../components/BirthdayScene"));

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-birthday-void">
      <SceneErrorBoundary
        fallback={
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(124,58,237,0.4),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(217,70,200,0.25),transparent_50%)]" />
        }
      >
        <Suspense fallback={null}>
          <BirthdayScene />
        </Suspense>
      </SceneErrorBoundary>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-birthday-void/10 via-birthday-void/30 to-birthday-void" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-birthday-gold/90"
        >
          The Aptitude Challenge
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-[var(--font-display)] text-4xl font-semibold tracking-tight text-birthday-blush drop-shadow-[0_4px_30px_rgba(217,70,200,0.35)] sm:text-6xl md:text-7xl"
        >
          Happy Birthday Fiyin 🎂
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-6 max-w-xl text-balance text-lg text-birthday-blush/80 sm:text-xl"
        >
          Are you ready for your aptitude test?
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(217,70,200,0.55)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/login")}
          className="mt-10 rounded-full bg-gradient-to-r from-birthday-magenta to-birthday-violet px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_10px_40px_rgba(124,58,237,0.45)] transition focus-visible:outline-birthday-gold"
        >
          Start the Test
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-8 text-xs uppercase tracking-[0.3em] text-birthday-blush/40"
        >
          17 questions · 4 sections · one shot
        </motion.p>
      </div>
    </div>
  );
}
