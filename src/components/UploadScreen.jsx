import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: "desktop", label: "🖥️ Desktop" },
  { id: "ios",     label: "🍎 iPhone"  },
  { id: "android", label: "🤖 Android" },
];

const TAB_CONTENT = {
  desktop: [
    <>Open <code>Messenger.com</code> on your desktop browser.</>,
    <>Click your <strong>Profile Picture</strong> (bottom-left) → <strong>Privacy &amp; safety</strong>.</>,
    <>Go to <strong>End-to-end encrypted chats</strong> → <strong>Message storage</strong>.</>,
    <>Click <code>Download secure storage data</code>, enter your PIN, and request the file.</>,
    <>Extract the downloaded <code>.zip</code> file and drop the specific JSON file here.</>,
  ],
  ios: [
    <>Open the Messenger app, tap the <strong>top-left menu</strong>, then the <strong>Settings ⚙️</strong> icon.</>,
    <>Go to <strong>Privacy &amp; safety</strong> → <strong>End-to-end encrypted chats</strong> → <strong>Message storage</strong>.</>,
    <>Tap <code>Download secure storage data</code> and request the file.</>,
    <>When you get the email, download the file. Open your iPhone's <strong>Files</strong> app and tap the <code>.zip</code> once to extract a blue folder.</>,
    <>Tap the upload box above, select <strong>"Choose File"</strong>, and navigate into that folder to find your JSON file.</>,
  ],
  android: [
    <>Open the Messenger app, tap the <strong>top-left menu</strong>, then the <strong>Settings ⚙️</strong> icon.</>,
    <>Go to <strong>Privacy &amp; safety</strong> → <strong>End-to-end encrypted chats</strong> → <strong>Message storage</strong>.</>,
    <>Tap <code>Download secure storage data</code> and request the file.</>,
    <>When downloaded, open your <strong>My Files</strong> or <strong>Files by Google</strong> app, tap the <code>.zip</code> file, and press <strong>Extract</strong>.</>,
    <>Tap the upload box above, navigate to the extracted folder, and select your JSON file.</>,
  ],
};

// ─── Slide animation variants ─────────────────────────────────────────────────
const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
};

export function UploadScreen({ onData, onError }) {
  const inputRef  = useRef(null);
  const [dragging,  setDragging]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [activeTab, setActiveTab] = useState("desktop");
  const [tabDir, setTabDir] = useState(1);

  const processFile = useCallback(
    (file) => {
      if (!file) return;
      if (!file.name.endsWith(".json")) {
        onError("Please upload a .json file (your Messenger export).");
        return;
      }
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const raw = JSON.parse(e.target.result);
          onData(raw);
        } catch {
          onError("Couldn't parse JSON. Make sure it's a valid Messenger export.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(file, "utf-8");
    },
    [onData, onError]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const switchTab = (id) => {
    if (id === activeTab) return;
    const currentIdx = TABS.findIndex((t) => t.id === activeTab);
    const nextIdx    = TABS.findIndex((t) => t.id === id);
    setTabDir(nextIdx > currentIdx ? 1 : -1);
    setActiveTab(id);
  };

  return (
    <div className="upload-screen">
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
      <motion.div
        className="orb orb-1"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-2"
        animate={{ x: [0, -25, 0], y: [0, 35, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="upload-content"
      >
        <div className="upload-logo">💬</div>
        <h1 className="upload-title">Messenger Wrapped</h1>
        <p className="upload-sub">
          Turn your Messenger export into a Spotify-style story.
        </p>

        <motion.div
          className={`dropzone ${dragging ? "dropzone-active" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={dragging ? { scale: 1.04, borderColor: "var(--accent-1)" } : {}}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".json"
            className="hidden"
            style={{ display: "none" }}
            onChange={(e) => processFile(e.target.files[0])}
          />
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="dz-loading"
              >
                <motion.div
                  className="spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                />
                <span>Parsing your messages…</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="dz-idle"
              >
                <div className="dz-icon">{dragging ? "⬇️" : "📂"}</div>
                <div className="dz-primary">
                  {dragging ? "Drop it!" : "Tap or drop your JSON file here"}
                </div>
                <div className="dz-secondary">or click to browse</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="upload-instructions">
          <div className="tab-bar" role="tablist">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => switchTab(tab.id)}
                  className={`tab-btn ${isActive ? "tab-btn-active" : "tab-btn-inactive"}`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.span
                      layoutId="tab-underline"
                      className="tab-underline"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="tab-content-wrap" role="tabpanel">
            <AnimatePresence mode="wait" custom={tabDir}>
              <motion.ol
                key={activeTab}
                custom={tabDir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="instructions-list"
              >
                {TAB_CONTENT[activeTab].map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.055, duration: 0.2 }}
                  >
                    {step}
                  </motion.li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>
        </div>

        <p className="privacy-note" style={{ lineHeight: "1.5" }}>
          🔒 <strong>100% Private:</strong> All processing happens locally in your browser. This website will <strong>never</strong> store, save, or upload any of your information. Your JSON file is strictly used to calculate your message counts and generate your Wrapped stats.
        </p>
      </motion.div>
    </div>
  );
}