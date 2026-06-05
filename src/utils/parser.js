// ─── Schema Detection ─────────────────────────────────────────────────────────
// Supports two Meta export formats:
//   LEGACY : participants is [{name: "..."}, ...]  |  msg.sender_name  |  msg.timestamp_ms  |  msg.type === "Generic"
//   E2EE   : participants is ["Name", ...]         |  msg.senderName   |  msg.timestamp     |  msg.type === "text"

function detectSchema(raw) {
  const firstParticipant = (raw.participants || [])[0];
  if (typeof firstParticipant === "string") return "e2ee";
  if (firstParticipant && typeof firstParticipant === "object") return "legacy";
  return "e2ee"; // safe default
}

// ─── Mojibake Fix (legacy exports only) ──────────────────────────────────────
// Meta's legacy export encodes UTF-8 bytes as Latin-1 codepoints, this reverses it.
// E2EE exports are clean native UTF-8 and do NOT need this treatment.
function fixEncoding(str) {
  if (typeof str !== "string") return str;
  try {
    return decodeURIComponent(
      str
        .split("")
        .map((c) => {
          const code = c.charCodeAt(0);
          return code > 127 ? "%" + code.toString(16).padStart(2, "0") : c;
        })
        .join("")
    );
  } catch {
    return str;
  }
}

// ─── Stop Words ───────────────────────────────────────────────────────────────
// Includes common Filipino/Tagalog filler words alongside English stop words
const STOP_WORDS = new Set([
  // English
  "a","about","above","after","again","against","all","am","an","and","any",
  "are","aren't","as","at","be","because","been","before","being","below",
  "between","both","but","by","can","can't","cannot","could","couldn't","did",
  "didn't","do","does","doesn't","doing","don't","down","during","each","few",
  "for","from","further","get","got","had","hadn't","has","hasn't","have",
  "haven't","having","he","he'd","he'll","he's","her","here","here's","hers",
  "herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've",
  "if","in","into","is","isn't","it","it's","its","itself","just","know",
  "let's","like","me","more","most","mustn't","my","myself","no","nor","not",
  "of","off","on","once","only","or","other","ought","our","ours","ourselves",
  "out","over","own","same","shan't","she","she'd","she'll","she's","should",
  "shouldn't","so","some","such","than","that","that's","the","their","theirs",
  "them","themselves","then","there","there's","these","they","they'd","they'll",
  "they're","they've","this","those","through","to","too","under","until","up",
  "very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't",
  "what","what's","when","when's","where","where's","which","while","who",
  "who's","whom","why","why's","will","with","won't","would","wouldn't","you",
  "you'd","you'll","you're","you've","your","yours","yourself","yourselves",
  "ok","okay","oh","yeah","yes","yep","nope","lol","haha","hehe","ah","uh",
  "um","hmm","hey","hi","hello","bye","hm","wow","omg","lmao","lmfao",
  // Filipino / Tagalog common fillers
  "na","nga","naman","lang","po","opo","yung","ang","mga","din","rin","dito",
  "diyan","doon","ito","iyan","iyon","ako","ikaw","siya","kami","kayo","sila",
  "mo","ko","niya","namin","ninyo","nila","may","mayroon","wala","hindi","oo",
  "eh","kasi","pero","at","kung","para","dahil","tas","tayo","yun","yan","yon",
  "ha","huh","ate","kuya","daw","raw","pala","ba","nag","mag","mag","nang",
  "si","ni","kay","sa","ng","mga","ga","pa","pag","tapos","kaya","nay","hay",
]);

// ─── Emoji Regex ──────────────────────────────────────────────────────────────
const EMOJI_REGEX =
  /(\p{Emoji_Presentation}|\p{Extended_Pictographic})(\u200D(\p{Emoji_Presentation}|\p{Extended_Pictographic}))*/gu;

function extractEmojis(text) {
  return (typeof text === "string" ? text.match(EMOJI_REGEX) : null) || [];
}

function topN(map, n = 5) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([value, count]) => ({ value, count }));
}

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function formatHour(hour) {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

// ─── Normalise a single message into a common shape ───────────────────────────
// Output: { sender: string, text: string, timestamp: number } | null
function normaliseMessage(msg, schema) {
  if (!msg || typeof msg !== "object") return null;

  if (schema === "e2ee") {
    // Skip unsent messages and non-text types
    if (msg.isUnsent === true) return null;
    if (msg.type !== "text") return null;
    const text = typeof msg.text === "string" ? msg.text : null;
    if (!text) return null;
    const sender = typeof msg.senderName === "string" ? msg.senderName : null;
    if (!sender) return null;
    const timestamp = typeof msg.timestamp === "number" ? msg.timestamp : null;
    if (!timestamp) return null;
    return { sender, text, timestamp };
  }

  // Legacy schema
  if (msg.type !== "Generic") return null;
  const text = typeof msg.content === "string" ? msg.content : null;
  if (!text) return null;
  const sender = typeof msg.sender_name === "string"
    ? fixEncoding(msg.sender_name)
    : null;
  if (!sender) return null;
  const timestamp = typeof msg.timestamp_ms === "number" ? msg.timestamp_ms : null;
  if (!timestamp) return null;
  return { sender, text: fixEncoding(text), timestamp };
}

// ─── Main Parser ──────────────────────────────────────────────────────────────
export function parseMessengerData(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid file: could not read JSON data.");
  }

  const schema = detectSchema(raw);

  // ── Extract participant names ─────────────────────────────────────────────
  const rawParticipants = Array.isArray(raw.participants) ? raw.participants : [];

  const participants = rawParticipants
    .map((p) => {
      if (schema === "e2ee") {
        return typeof p === "string" ? p.trim() : null;
      }
      // Legacy: [{name: "..."}]
      return p && typeof p.name === "string" ? fixEncoding(p.name.trim()) : null;
    })
    .filter(Boolean);

  if (participants.length < 2) {
    throw new Error(
      `Expected at least 2 participants but found ${participants.length}. ` +
      `Make sure you're uploading a 1-on-1 chat export.`
    );
  }

  // Use first two — 1-on-1 chat
  const [p1, p2] = participants;

  // ── Per-person accumulators ───────────────────────────────────────────────
  const makeBucket = (name) => ({
    name,
    messageCount: 0,
    wordCount: 0,
    emojiMap: new Map(),
    wordMap: new Map(),
  });

  const stats = { [p1]: makeBucket(p1), [p2]: makeBucket(p2) };

  // Hour frequency 0–23
  const hourMap = new Map(Array.from({ length: 24 }, (_, i) => [i, 0]));
  const dayMap  = new Map(); // "YYYY-MM-DD" → count
  const monthMap = new Map(); // "YYYY-MM"   → count

  let totalMessages  = 0;
  let firstTimestamp = Infinity;
  let lastTimestamp  = -Infinity;

  const rawMessages = Array.isArray(raw.messages) ? raw.messages : [];

  for (const rawMsg of rawMessages) {
    const msg = normaliseMessage(rawMsg, schema);
    if (!msg) continue; // skip unsent, media-only, malformed

    const { sender, text, timestamp } = msg;

    // Track time range
    if (timestamp < firstTimestamp) firstTimestamp = timestamp;
    if (timestamp > lastTimestamp)  lastTimestamp  = timestamp;

    // Time buckets
    const date     = new Date(timestamp);
    const hour     = date.getHours();
    const dayKey   = date.toISOString().slice(0, 10);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    dayMap.set(dayKey,   (dayMap.get(dayKey)   || 0) + 1);
    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);

    totalMessages++;

    // Match sender to a known participant (case-insensitive trim fallback)
    const bucket =
      stats[sender] ??
      stats[Object.keys(stats).find(
        (k) => k.toLowerCase().trim() === sender.toLowerCase().trim()
      )];

    if (!bucket) continue; // unknown sender — count in totals but skip per-person

    bucket.messageCount++;

    // Word frequency (strip non-alpha, remove stop words, min length 2)
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9'\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

    bucket.wordCount += words.length;
    for (const word of words) increment(bucket.wordMap, word);

    // Emoji frequency
    const emojis = extractEmojis(text);
    for (const emoji of emojis) increment(bucket.emojiMap, emoji);
  }

  // ── Derive final output (identical shape to old parser) ───────────────────
  const buildPersonStats = (name) => {
    const s = stats[name] || makeBucket(name); // safe fallback
    return {
      name,
      messageCount: s.messageCount,
      wordCount:    s.wordCount,
      topEmojis:    topN(s.emojiMap, 5),
      topWords:     topN(s.wordMap,  5),
      messageShare: totalMessages > 0 ? (s.messageCount / totalMessages) * 100 : 0,
    };
  };

  // Peak hour — default to 0 if no messages at all
  const peakHour = totalMessages > 0
    ? [...hourMap.entries()].sort((a, b) => b[1] - a[1])[0][0]
    : 0;

  // Longest consecutive-day streak
  const sortedDays = [...dayMap.keys()].sort();
  let maxStreak = 0, currentStreak = 0;
  let prevDay = null;
  for (const dayStr of sortedDays) {
    const day = new Date(dayStr);
    if (prevDay) {
      const diff = (day - prevDay) / 86_400_000;
      currentStreak = diff === 1 ? currentStreak + 1 : 1;
    } else {
      currentStreak = 1;
    }
    if (currentStreak > maxStreak) maxStreak = currentStreak;
    prevDay = day;
  }

  // Most active single day
  const mostActiveDayEntry = [...dayMap.entries()].sort((a, b) => b[1] - a[1])[0];

  return {
    // ── Identity ──
    participants: [p1, p2],
    person1: buildPersonStats(p1),
    person2: buildPersonStats(p2),

    // ── Totals ──
    totalMessages,
    daysActive: dayMap.size,
    longestStreak: maxStreak,

    // ── Time data ──
    hourlyData: [...hourMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([hour, count]) => ({ hour, count, label: formatHour(hour) })),

    monthlyData: [...monthMap.entries()]
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([month, count]) => ({ month, count })),

    peakHour,
    peakHourLabel: formatHour(peakHour),

    mostActiveDay: mostActiveDayEntry
      ? { date: mostActiveDayEntry[0], count: mostActiveDayEntry[1] }
      : null,

    dateRange: {
      first: firstTimestamp === Infinity  ? null : new Date(firstTimestamp),
      last:  lastTimestamp  === -Infinity ? null : new Date(lastTimestamp),
    },

    // ── Meta ──
    schemaVersion: schema, // "e2ee" | "legacy" — useful for debugging
  };
}