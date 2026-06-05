import { motion } from "framer-motion";
import { SlideWrapper, stagger, fadeUp } from "./SlideWrapper";

export function SlideIntro({ data }) {
  const { person1, person2, dateRange } = data;

  const year = dateRange?.last
    ? dateRange.last.getFullYear()
    : new Date().getFullYear();

  const formatDate = (d) =>
    d
      ? d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "Unknown";

  return (
    <SlideWrapper className="slide-intro">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Floating orbs */}
      <motion.div
        className="orb orb-1"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-2"
        animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 max-w-md mx-auto"
      >
        <motion.div variants={fadeUp} className="eyebrow">
          ✦ Your Chat in Review ✦
        </motion.div>

        <motion.h1 variants={fadeUp} className="intro-title">
          {person1.name}
          <span className="title-amp"> & </span>
          {person2.name}
        </motion.h1>

        <motion.div variants={fadeUp} className="intro-year">
          WRAPPED
        </motion.div>

        <motion.p variants={fadeUp} className="intro-dates">
          {formatDate(dateRange?.first)} → {formatDate(dateRange?.last)}
        </motion.p>

        <motion.div variants={fadeUp} className="intro-cta">
          <span>Swipe up to begin</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="inline-block ml-2"
          >
            ↓
          </motion.span>
        </motion.div>
      </motion.div>
    </SlideWrapper>
  );
}