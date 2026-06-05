import { motion } from "framer-motion";
import { SlideWrapper, stagger, fadeUp } from "./SlideWrapper";
import { useCountUp } from "../hooks/useCountUp";

export function SlideTotalMessages({ data }) {
  const { totalMessages, daysActive, longestStreak } = data;
  const displayTotal = useCountUp(totalMessages, 2000, 300);
  const displayDays = useCountUp(daysActive, 1600, 600);
  const displayStreak = useCountUp(longestStreak, 1400, 900);

  return (
    <SlideWrapper className="slide-messages">
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
      <motion.div
        className="orb orb-3"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 max-w-sm mx-auto w-full"
      >
        <motion.p variants={fadeUp} className="eyebrow">
          Total Messages Sent
        </motion.p>

        <motion.div variants={fadeUp} className="big-number">
          {displayTotal.toLocaleString()}
        </motion.div>

        <motion.p variants={fadeUp} className="big-number-label">
          messages exchanged
        </motion.p>

        <motion.div variants={fadeUp} className="stat-row mt-10">
          <div className="mini-stat">
            <div className="mini-stat-num">{displayDays.toLocaleString()}</div>
            <div className="mini-stat-label">days of chatting</div>
          </div>
          <div className="mini-stat-divider" />
          <div className="mini-stat">
            <div className="mini-stat-num">{displayStreak}</div>
            <div className="mini-stat-label">day longest streak</div>
          </div>
        </motion.div>
      </motion.div>
    </SlideWrapper>
  );
}