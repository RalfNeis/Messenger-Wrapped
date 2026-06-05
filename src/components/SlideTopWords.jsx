import { motion } from "framer-motion";
import { SlideWrapper, stagger, fadeUp } from "./SlideWrapper";

function WordList({ person, accent, delay = 0 }) {
  return (
    <div className="word-list-col">
      <div className="word-list-name" style={{ color: accent }}>
        {person.name.split(" ")[0]}
      </div>
      {person.topWords.length > 0 ? (
        person.topWords.map((w, i) => (
          <motion.div
            key={w.value}
            className="word-item"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.35 + delay + i * 0.1,
              ease: "easeOut",
            }}
          >
            <span className="word-rank" style={{ color: accent }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="word-text">{w.value}</span>
            <span className="word-count">×{w.count}</span>
          </motion.div>
        ))
      ) : (
        <div className="no-words">Not enough data</div>
      )}
    </div>
  );
}

export function SlideTopWords({ data }) {
  const { person1, person2 } = data;

  return (
    <SlideWrapper className="slide-words">
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
      <motion.div
        className="orb orb-4"
        animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 px-6 w-full max-w-sm mx-auto"
      >
        <motion.p variants={fadeUp} className="eyebrow text-center">
          Most Used Words
        </motion.p>
        <motion.h2 variants={fadeUp} className="slide-heading text-center">
          Your vocabulary 📖
        </motion.h2>

        <motion.div variants={fadeUp} className="word-lists-row">
          <WordList person={person1} accent="var(--accent-1)" delay={0} />
          <div className="word-divider" />
          <WordList person={person2} accent="var(--accent-2)" delay={0.15} />
        </motion.div>
      </motion.div>
    </SlideWrapper>
  );
}