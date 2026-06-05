import { motion } from "framer-motion";

const variants = {
  enter: (dir) => ({
    y: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    y: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export function SlideWrapper({ children, direction, className = "" }) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        y: { type: "spring", stiffness: 280, damping: 34 },
        opacity: { duration: 0.25 },
      }}
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation
export const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 28 } },
};

export const fadeIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 240, damping: 24 } },
};