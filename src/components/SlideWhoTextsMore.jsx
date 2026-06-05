import { motion } from "framer-motion";
import { SlideWrapper, stagger, fadeUp } from "./SlideWrapper";
import { useCountUp } from "../hooks/useCountUp";

function PersonBar({ person, isLeader, delay = 0 }) {
  const count = useCountUp(person.messageCount, 1600, 400 + delay);
  const share = Math.round(person.messageShare);

  return (
    <div className="person-bar-wrap">
      <div className="person-bar-header">
        <span className="person-name">{person.name.split(" ")[0]}</span>
        <span className="person-count">{count.toLocaleString()}</span>
      </div>
      <div className="bar-track">
        <motion.div
          className={`bar-fill ${isLeader ? "bar-leader" : "bar-follower"}`}
          initial={{ width: 0 }}
          animate={{ width: `${person.messageShare}%` }}
          transition={{ duration: 1.4, delay: 0.5 + delay / 1000, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
      <div className="bar-pct">{share}% of all messages</div>
    </div>
  );
}

export function SlideWhoTextsMore({ data }) {
  const { person1, person2 } = data;
  const leader = person1.messageCount >= person2.messageCount ? person1 : person2;

  return (
    <SlideWrapper className="slide-who">
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
      <motion.div
        className="orb orb-2"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 px-6 w-full max-w-sm mx-auto"
      >
        <motion.p variants={fadeUp} className="eyebrow text-center">
          Who texts more?
        </motion.p>

        <motion.div variants={fadeUp} className="leader-badge">
          🏆 {leader.name.split(" ")[0]}
        </motion.div>

        <motion.div variants={fadeUp} className="bars-container">
          <PersonBar person={person1} isLeader={person1.name === leader.name} delay={0} />
          <PersonBar person={person2} isLeader={person2.name === leader.name} delay={200} />
        </motion.div>

        <motion.div variants={fadeUp} className="words-row">
          <div className="words-stat">
            <div className="words-num">{person1.wordCount.toLocaleString()}</div>
            <div className="words-label">{person1.name.split(" ")[0]}'s words</div>
          </div>
          <div className="mini-stat-divider" />
          <div className="words-stat">
            <div className="words-num">{person2.wordCount.toLocaleString()}</div>
            <div className="words-label">{person2.name.split(" ")[0]}'s words</div>
          </div>
        </motion.div>
      </motion.div>
    </SlideWrapper>
  );
}