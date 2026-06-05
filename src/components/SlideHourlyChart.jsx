import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { SlideWrapper, stagger, fadeUp } from "./SlideWrapper";

const HOUR_LABELS = [
  "12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a",
  "12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p",
];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="tooltip-time">{payload[0]?.payload?.label}</div>
        <div className="tooltip-count">{payload[0]?.value} msgs</div>
      </div>
    );
  }
  return null;
}

export function SlideHourlyChart({ data }) {
  const { hourlyData, peakHourLabel } = data;
  const maxVal = Math.max(...hourlyData.map((d) => d.count));

  return (
    <SlideWrapper className="slide-hourly">
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
      <motion.div
        className="orb orb-3"
        animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 px-4 w-full max-w-sm mx-auto"
      >
        <motion.p variants={fadeUp} className="eyebrow text-center">
          Activity by Hour
        </motion.p>
        <motion.h2 variants={fadeUp} className="slide-heading text-center">
          Peak time: {peakHourLabel} 🌙
        </motion.h2>

        <motion.div
          variants={fadeUp}
          className="chart-container"
          style={{ width: "100%", height: 200 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={hourlyData}
              margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
              barCategoryGap="15%"
            >
              <XAxis
                dataKey="hour"
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(h) => HOUR_LABELS[h]}
                interval={5}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {hourlyData.map((entry) => (
                  <Cell
                    key={entry.hour}
                    fill={
                      entry.count === maxVal
                        ? "var(--accent-1)"
                        : "rgba(255,255,255,0.18)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.p variants={fadeUp} className="chart-caption">
          That's when you two are most chaotic 💬
        </motion.p>
      </motion.div>
    </SlideWrapper>
  );
}