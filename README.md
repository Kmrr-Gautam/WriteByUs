# WriteByUs — a text humanizer

[![GitHub Repository](https://img.shields.io/badge/GitHub-Kmrr--Gautam%2FWriteByUs-181717?style=flat&logo=github)](https://github.com/Kmrr-Gautam/WriteByUs)
[![Author](https://img.shields.io/badge/Author-Gautam%20Kumar-emerald?style=flat)](https://github.com/Kmrr-Gautam)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue?style=flat&logo=pwa)](https://github.com/Kmrr-Gautam/WriteByUs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **WriteByUs** is a Progressive Web App (PWA) that strips mechanical AI writing patterns, checks genuine AI plagiarism, and restores authentic human cadence to text without modifying your factual claims.

Developed and created by **[Gautam Kumar](https://github.com/Kmrr-Gautam)**.

---

## Live Demo & Repository
- **Repository URL:** [https://github.com/Kmrr-Gautam/WriteByUs](https://github.com/Kmrr-Gautam/WriteByUs)
- **Author Profile:** [https://github.com/Kmrr-Gautam](https://github.com/Kmrr-Gautam)

---

## Key Features

### 1. WriteByUs 26-Tell Humanizer Engine
Targets and eliminates Wikipedia's documented **Signs of AI Writing**:
- **Staging tells:** Staged run-ups (*"Let's dive in"*, *"Here's what you need to know"*, *"Honestly?"*), formulaic contrasts (*"not just X, it's Y"*), and empty one-line closers (*"Let that sink in"*, *"That is the real win"*).
- **Rhythm by rule:** Forced triads, repeated sentence openings, stacked qualifiers, and connective em-dashes (`—`).
- **Inflation & borrowed authority:** AI-favored vocabulary (*delve, tapestry, vibrant, crucial, testament, pivotal, intricate, interplay, landscape, robust*) and vague prestige attributions.
- **Formatting by rule:** Excessive bold bullet labeling and decorative emojis.
- **Chatbot residue:** Unintentional assistant chatter (*"Great question!", "I hope this helps!", "Let me know..."*).

### 2. Genuine AI & Plagiarism Scanner
- **Genuine Human Authenticity Score:** Percentage probability rating of human vs. synthetic AI authorship.
- **Originality & Web Cliché Detection:** Identifies over-indexed LLM training phrases and repetitive cliches.
- **Sentence-by-Sentence Risk Heatmap:** Interactive diagnostic highlighting specific risk points line-by-line.
- **Lexical Diversity (Type-Token Ratio):** Analyzes vocabulary variation and richness.

### 3. Author Voice Matching
- Paste a 2–3 paragraph writing sample.
- WriteByUs calibrates sentence variance, dash usage rates, and cadence to match your authentic voice.

### 4. Minimalist Aesthetic UI
- Obsidian theme with distraction-free layout.
- Side-by-side & unified word-level diff viewer.
- 100% responsive across mobile, tablet, and desktop displays.

### 5. Progressive Web App (PWA)
- Fully installable on iOS, Android, macOS, and Windows.
- Offline-capable Service Worker caching.

---

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, Diff, Canvas Confetti.
- **Backend:** Node.js, Express, CORS, Dotenv.
- **PWA:** Web App Manifest, Service Worker (`sw.js`).

---

## Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Kmrr-Gautam/WriteByUs.git
cd WriteByUs
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Run Locally (Concurrent Backend & Frontend)
From the project root:
```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3001](http://localhost:3001)

### 4. Build for Production
```bash
npm run build
```

---

## Deployment Guide

### Deploying Frontend (Vercel / Netlify / Cloudflare Pages)
1. Push this repository to GitHub.
2. Import the project into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Set the Root Directory to `frontend`.
4. Build command: `npm run build`, Output directory: `dist`.

### Deploying Backend (Render / Railway)
1. Connect the repository to [Render](https://render.com) or [Railway](https://railway.app).
2. Set Root Directory to `backend`.
3. Start command: `npm start`.

---

## Credits & Author

Created and maintained by **[Gautam Kumar](https://github.com/Kmrr-Gautam)**.

- **GitHub:** [@Kmrr-Gautam](https://github.com/Kmrr-Gautam)
- **Project Repository:** [Kmrr-Gautam/WriteByUs](https://github.com/Kmrr-Gautam/WriteByUs)

Special attribution to Wikipedia's *Signs of AI Writing* editorial guidelines for the core stylistic de-slopping ruleset.

---

## License
This project is open source and available under the [MIT License](LICENSE).
