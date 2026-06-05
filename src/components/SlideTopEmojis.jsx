import { motion } from "framer-motion";
import { SlideWrapper, stagger, fadeUp, fadeIn } from "./SlideWrapper";

function EmojiCard({ person, delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      className="emoji-card"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="emoji-card-name">{person.name.split(" ")[0]}</div>
      <div className="emoji-list">
        {person.topEmojis.length > 0 ? (
          person.topEmojis.map((e, i) => (
            <motion.div
              key={e.value}
              className="emoji-item"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                delay: 0.4 + delay / 1000 + i * 0.08,
              }}
            >
              <span className="emoji-glyph">{e.value}</span>
              <span className="emoji-count">×{e.count}</span>
            </motion.div>
          ))
        ) : (
          <div className="no-emoji">No emojis found</div>
        )}
      </div>
    </motion.div>
  );
}

export function SlideTopEmojis({ data }) {
  const { person1, person2 } = data;

  return (
    <SlideWrapper className="slide-emojis">
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
      <motion.div
        className="orb orb-1"
        animate={{ x: [0, 20, 0], y: [0, -40, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 w-full max-w-sm mx-auto"
      >
        <motion.p variants={fadeUp} className="eyebrow">
          Favourite Emojis
        </motion.p>
        <motion.h2 variants={fadeUp} className="slide-heading">
          Your emotional range 🎭
        </motion.h2>

        <motion.div variants={fadeUp} className="emoji-cards-row">
          <EmojiCard person={person1} delay={0} />
          <EmojiCard person={person2} delay={150} />
        </motion.div>
      </motion.div>
    </SlideWrapper>
  );
}