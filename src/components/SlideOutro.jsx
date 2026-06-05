import { motion } from "framer-motion";
import { SlideWrapper, stagger, fadeUp } from "./SlideWrapper";
import { useCountUp } from "../hooks/useCountUp";

export function SlideOutro({ data, onRestart }) {
  const { person1, person2, totalMessages, daysActive } = data;
  const msgs = useCountUp(totalMessages, 1600, 300);

  return (
    <SlideWrapper className="slide-outro">
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Confetti orbs */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`orb orb-${i}`}
          animate={{
            x: [0, (i % 2 === 0 ? 1 : -1) * 40, 0],
            y: [0, (i < 3 ? -1 : 1) * 30, 0],
          }}
          transition={{ duration: 7 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        />
      ))}

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 max-w-sm mx-auto"
      >
        <motion.div
          variants={fadeUp}
          className="outro-emoji"
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          💌
        </motion.div>

        <motion.h2 variants={fadeUp} className="outro-title">
          That's a Wrap!
        </motion.h2>

        <motion.p variants={fadeUp} className="outro-body">
          {msgs.toLocaleString()} messages, {daysActive} days, and counting.
          <br />
          <strong>{person1.name.split(" ")[0]}</strong> &{" "}
          <strong>{person2.name.split(" ")[0]}</strong> — quite the duo. 🫶
        </motion.p>

        <motion.div variants={fadeUp} className="outro-stats">
          <div className="outro-stat">
            <div className="outro-stat-num">{person1.messageCount.toLocaleString()}</div>
            <div className="outro-stat-label">{person1.name.split(" ")[0]}</div>
          </div>
          <div className="outro-stat-heart">♥</div>
          <div className="outro-stat">
            <div className="outro-stat-num">{person2.messageCount.toLocaleString()}</div>
            <div className="outro-stat-label">{person2.name.split(" ")[0]}</div>
          </div>
        </motion.div>

        <motion.button
          variants={fadeUp}
          onClick={onRestart}
          className="restart-btn"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Upload another chat
        </motion.button>
      </motion.div>
    </SlideWrapper>
  );
}