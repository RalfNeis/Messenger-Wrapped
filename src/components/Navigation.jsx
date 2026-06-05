import { motion } from "framer-motion";

export function NavDots({ total, current, onGoTo }) {
  return (
    <div className="nav-dots">
      {Array.from({ length: total }).map((_, i) => (
        <motion.button
          key={i}
          className={`nav-dot ${i === current ? "nav-dot-active" : ""}`}
          onClick={() => onGoTo(i)}
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

export function NavArrows({ onPrev, onNext, canPrev, canNext }) {
  return (
    <div className="nav-arrows">
      <motion.button
        className={`nav-arrow ${!canPrev ? "nav-arrow-disabled" : ""}`}
        onClick={onPrev}
        disabled={!canPrev}
        whileHover={canPrev ? { scale: 1.1 } : {}}
        whileTap={canPrev ? { scale: 0.92 } : {}}
        aria-label="Previous slide"
      >
        ↑
      </motion.button>
      <motion.button
        className={`nav-arrow ${!canNext ? "nav-arrow-disabled" : ""}`}
        onClick={onNext}
        disabled={!canNext}
        whileHover={canNext ? { scale: 1.1 } : {}}
        whileTap={canNext ? { scale: 0.92 } : {}}
        aria-label="Next slide"
      >
        ↓
      </motion.button>
    </div>
  );
}