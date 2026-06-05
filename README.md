# 💬 Messenger Wrapped

A privacy-first, locally-processed React application that turns your Facebook Messenger chat exports into a beautiful, Spotify-style recap. 

Visualize your total messages, top emojis, most used words, and daily chat frequency through an interactive, animated slideshow.

## ✨ Features

* **🔒 100% Private (Local Processing):** All parsing and data calculation happens directly in the browser. No databases, no servers, and your personal chat data never leaves your device.
* **📱 Modern Meta E2EE Support:** Fully compatible with Meta's new End-to-End Encrypted (E2EE) Secure Storage JSON export format, as well as legacy Messenger exports.
* **✨ Smooth Animations:** Fluid, physics-based transitions and data reveals powered by Framer Motion.
* **🎨 Modern UI/UX:** Glassmorphism design, glowing ambient orbs, and fully responsive layouts for both Desktop and Mobile viewing.

## 🛠️ Tech Stack

* **Frontend Framework:** React
* **Build Tool:** Vite
* **Styling:** Tailwind CSS (v4)
* **Animations:** Framer Motion
* **Deployment:** Netlify 

## 🚀 Getting Started (Local Development)

To run this project locally on your machine, copy and paste this command into your terminal:

```bash
git clone [https://github.com/yourusername/Messenger-Wrapped.git](https://github.com/yourusername/Messenger-Wrapped.git) && cd Messenger-Wrapped && npm install && npm run dev
```

## 📂 How to Export Your Messenger Data

Meta recently updated Messenger to use End-to-End Encryption (E2EE), changing how data is exported. To use this app, you will need to request your Secure Storage data.

### Desktop
1. Open `Messenger.com` on your desktop browser.
2. Click your **Profile Picture** (bottom-left) → **Privacy & safety**.
3. Go to **End-to-end encrypted chats** → **Message storage**.
4. Click `Download secure storage data`, enter your PIN, and request the file.
5. Extract the downloaded `.zip` file and upload the specific `message_1.json` file to the app.

### Mobile (iOS / Android)
1. Open the Messenger app, tap the top-left menu, then the **Settings ⚙️** icon.
2. Go to **Privacy & safety** → **End-to-end encrypted chats** → **Message storage**.
3. Tap `Download secure storage data` and request the file.
4. Once downloaded, use your phone's native file manager (Files on iOS, My Files on Android) to extract the `.zip` file.
5. Upload the JSON file to the web app.

## 👨‍💻 Author

**Ralf Neis**
* GitHub: [@RalfNeis](https://github.com/RalfNeis)

---
*Note: This project is not affiliated with, authorized, maintained, sponsored, or endorsed by Meta Platforms, Inc. or Facebook.*