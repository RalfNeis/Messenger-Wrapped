import { useEffect, useRef, useState } from "react";

export function useCountUp(target, duration = 1800, delay = 200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let start = null;
    const timeout = setTimeout(() => {
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setValue(target);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return value;
}