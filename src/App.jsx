import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { parseMessengerData } from "./utils/parser";
import { UploadScreen } from "./components/UploadScreen";
import { NavDots, NavArrows } from "./components/Navigation";
import { SlideIntro } from "./components/SlideIntro";
import { SlideTotalMessages } from "./components/SlideTotalMessages";
import { SlideWhoTextsMore } from "./components/SlideWhoTextsMore";
import { SlideTopEmojis } from "./components/SlideTopEmojis";
import { SlideTopWords } from "./components/SlideTopWords";
import { SlideHourlyChart } from "./components/SlideHourlyChart";
import { SlideOutro } from "./components/SlideOutro";

// Slide registry — each entry maps to a component
const SLIDE_COMPONENTS = [
  SlideIntro,
  SlideTotalMessages,
  SlideWhoTextsMore,
  SlideTopEmojis,
  SlideTopWords,
  SlideHourlyChart,
  SlideOutro,
];

// Vibrant gradient per slide index
const SLIDE_GRADIENTS = [
  "linear-gradient(145deg, #0f0c29, #302b63, #24243e)",   // deep space
  "linear-gradient(145deg, #1a1a2e, #16213e, #0f3460)",   // midnight blue
  "linear-gradient(145deg, #200122, #6f0000, #200122)",   // dark crimson
  "linear-gradient(145deg, #0d0d0d, #1a0533, #3d0066)",   // deep purple
  "linear-gradient(145deg, #003333, #00554b, #007a5e)",   // dark teal
  "linear-gradient(145deg, #1c1c1c, #2d1b00, #4a2e00)",   // warm night
  "linear-gradient(145deg, #0a0a0a, #1a0a2e, #2d1b4e)",   // finale dark
];

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Touch / swipe support
  const touchStartY = useRef(null);
  const containerRef = useRef(null);

  const totalSlides = SLIDE_COMPONENTS.length;

  const goTo = useCallback(
    (index) => {
      if (index < 0 || index >= totalSlides) return;
      setDirection(index > slideIndex ? 1 : -1);
      setSlideIndex(index);
    },
    [slideIndex, totalSlides]
  );

  const next = useCallback(() => goTo(slideIndex + 1), [goTo, slideIndex]);
  const prev = useCallback(() => goTo(slideIndex - 1), [goTo, slideIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!data) return;
    const handler = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data, next, prev]);

  // Scroll wheel navigation
  useEffect(() => {
    if (!data) return;
    let locked = false;
    const handler = (e) => {
      e.preventDefault();
      if (locked) return;
      locked = true;
      if (e.deltaY > 30) next();
      else if (e.deltaY < -30) prev();
      setTimeout(() => { locked = false; }, 700);
    };
    const el = containerRef.current;
    el?.addEventListener("wheel", handler, { passive: false });
    return () => el?.removeEventListener("wheel", handler);
  }, [data, next, prev]);

  // Touch swipe
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartY.current = null;
  };

  const handleData = useCallback((raw) => {
    try {
      const parsed = parseMessengerData(raw);
      setData(parsed);
      setSlideIndex(0);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleRestart = useCallback(() => {
    setData(null);
    setError(null);
    setSlideIndex(0);
  }, []);

  // ── Upload screen ──────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div className="app-root">
        <UploadScreen onData={handleData} onError={setError} />
        {error && (
          <div className="error-toast">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}
      </div>
    );
  }

  // ── Presentation ────────────────────────────────────────────────────────────
  const CurrentSlide = SLIDE_COMPONENTS[slideIndex];
  const bg = SLIDE_GRADIENTS[slideIndex] ?? SLIDE_GRADIENTS[0];

  return (
    <div
      className="app-root"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ background: bg, transition: "background 0.7s ease" }}
    >
      {/* Progress bar at top */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${((slideIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Slide stage */}
      <div className="slide-stage">
        <AnimatePresence mode="wait" custom={direction}>
          <CurrentSlide
            key={slideIndex}
            data={data}
            direction={direction}
            onRestart={handleRestart}
          />
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <NavDots total={totalSlides} current={slideIndex} onGoTo={goTo} />
      <NavArrows
        onPrev={prev}
        onNext={next}
        canPrev={slideIndex > 0}
        canNext={slideIndex < totalSlides - 1}
      />
    </div>
  );
}