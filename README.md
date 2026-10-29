# 🌐 Ghost of the Internet
### *An interactive time machine for the forgotten web, where archived websites become explorable worlds and AI brings their history back to life.*

**Hacktoberfest 2026 · Week 4 MVP Submission**

[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2026-orange.svg)](https://hacktoberfest.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg)](#)
[![Local-First](https://img.shields.io/badge/Architecture-Local--First-purple.svg)](#)
[![Grounded RAG](https://img.shields.io/badge/AI-Grounded%20RAG%20(BM25)-teal.svg)](#)

---

## 1. The Idea in Simple Words

The early internet was full of personal websites, gaming forums, fan pages, guestbooks, and communities built by ordinary people. Most of those websites disappeared. Others survive only in web archives like the Wayback Machine.

**Ghost of the Internet** lets people explore that forgotten internet and talk to AI-generated "ghosts" grounded strictly in surviving web archive evidence.

Imagine three experiences combined into one:
1. **The Internet Archive**: Preserved historical web pages from 1999–2003.
2. **A Retro Browser**: The tactile look and feel of browsing the early web inside a simulated early-2000s browser window.
3. **An AI Time Traveler**: A conversational guide that helps you understand what you are seeing without hallucinating or fabricating history.

> **Crucial Distinction**: We are **not** claiming to resurrect real people or authentic historical personas. We are using archived material to create clearly labeled, AI-generated interpretations of past communities that cite their sources and openly admit when the archive is silent.

---

## 2. Core MVP Features

```
                                  GHOST OF THE INTERNET
 ┌───────────────────────────────────────────────────────────────────────────────────┐
 │ [🌐 Retro Navigator 4.0]  Location: http://www.nexus-gaming.net/forums/thread_47 │
 ├───────────────────────────────────────────────────────────────────────────────────┤
 │  [◀ Back] [▶ Forward] [↺ Reload] [⌂ Home] [📜 Source]                             │
 │  WAYBACK RECORD: 14 AUG 2003 · 23:04:15 UTC · [Evidence Mode ↗]                   │
 ├──────────────────────────────────────────────────────┬────────────────────────────┤
 │  FEATURE 1: LOST WORLDS                              │  FEATURE 3: ASK THE GHOST  │
 │  • The Nexus 2003 (Gaming forum & 56k dial-up)       │  • Historian Mode          │
 │  • Pixel Witch's Cyber Attic (GeoCities homepage)    │  • Community Echo Mode     │
 │  • Starlight Anime Webring (Fan club farewell)       │  • Cites exact passages    │
 ├──────────────────────────────────────────────────────┴────────────────────────────┤
 │  FEATURE 4: THE LAST ONLINE (Activity Fade Map) & FEATURE 5: EVIDENCE MODE        │
 └───────────────────────────────────────────────────────────────────────────────────┘
```

### Feature 1: Lost Worlds
A curated portal featuring 3 distinct explorable digital ruins:
- **The Nexus 2003**: A forgotten gaming forum discussing Diablo II, 56k dial-up tweaks, and `ghost_user_97`'s poignant final post before their internet was cancelled.
- **Pixel Witch's Cyber Attic**: A GeoCities Area51 personal homepage complete with animated marquees, visitor hit counter, guestbook signatures, and a fallen Sorceress memorial shrine.
- **Starlight Anime Webring**: An early anime fan hub with episodic discussions of *Serial Experiments Lain* and *Cowboy Bebop*, concluding with the webmaster's farewell broadcast before hosting expired.

### Feature 2: Retro Browser Shell
A period-authentic early-2000s browser window (Netscape Navigator / IE 5.5 aesthetic):
- Title bar with minimize/maximize/close bevels.
- Functional navigation toolbar: **Back**, **Forward**, **Reload**, and **Home** connected to an active browser history stack.
- Simulated address bar updating with historical URLs (`http://...`).
- Wayback snapshot datestamp ribbon (`SNAPSHOT: 14-AUG-2003`).
- Simulated network transfer progress bar (`Connecting... Transferring 34.2 KB... Done`).

### Feature 3: Grounded "Ask the Ghost" (RAG)
A conversational guide powered by a client-side **BM25 lexical search ranking engine** over verified archive passages:
- **Historian Mode**: Answers factual questions objectively with quotes, author attributions, and snapshot dates.
- **Community Echo Mode**: Captures the emotional voice and ambient subculture of the era without impersonating individuals.
- **Epistemic Honesty**: If asked a question that cannot be answered from the archive (e.g. *"What happened to them after the forum died?"*), the Ghost openly admits silence rather than inventing stories.
- **Inline Citation Pills**: Every AI response includes clickable badges linking directly to raw evidence.

### Feature 4: The Last Online & Activity Fade Map
A timeline visualization mapping monthly preserved post density from the site's genesis to its quiet end:
- Measures the activity decay curve over months and years.
- Side-by-side comparison of the **Genesis Capture** vs. the **Last Recorded Post**.
- The *"Final Traces"* narrative reflecting on what the archive preserved—and what it lost.
- Ethical seal: `EVIDENCE != OMNISCIENCE`.

### Feature 5: Evidence Mode & Provenance Inspector
Clicking any citation badge or *"Show Source"* button opens a dedicated side-by-side drawer displaying:
- The exact verbatim archived quote highlighted.
- Provenance metadata: Original URL, author handle, snapshot date, collection ID, and extraction confidence score (0.98).
- A 1-click *"Open Page in Retro Browser"* deep-link.

### Atmosphere & Accessibility
- **Procedural Audio Synthesizer**: Pure Web Audio API oscillators synthesize tactile clicks and nostalgic dial-up chirps (zero external MP3 files needed; muted by default).
- **CRT Phosphor Scanlines**: Toggleable vintage CRT curvature and phosphor line overlays.
- **Accessibility**: Full keyboard navigation, ARIA live regions, and `@media (prefers-reduced-motion: reduce)` overrides.

---

## 3. Production Ingestion Pipeline: Extracting Real Websites

Beyond the curated demo worlds, this project includes a complete production ingestion engine ([ingest.js](file:///c:/PeassBeReasonable/Hacktoberfest/Ghostofthenet/ingest.js)) that extracts **real websites directly from the Internet Archive Wayback Machine**:

```bash
# Ingest any historical website from the Wayback Machine
node ingest.js --url "info.cern.ch/*" --from 1997 --to 2003 --limit 5 --name "CERN Historical Web"
```

### How Ingestion Works:
1. **Wayback Machine CDX API**: Queries the official capture index with `collapse=timestamp:6` to pull 1 snapshot per month across years, capturing the true activity decay curve.
2. **Raw HTML via `id_` Modifier**: Downloads unmodified historical HTML via `https://web.archive.org/web/{timestamp}id_/{url}`, stripping out modern Wayback toolbar wrappers and analytics.
3. **Archaeology Parser & PII Filter**: Unwraps archaic nested `<table>` layouts, strips dead scripts, and automatically redacts personal contact information (emails and phone numbers).
4. **Chunking & Timeline**: Splits content into searchable 150-word passages and groups capture dates into the activity fade map.
5. **REST API**: Production servers can trigger ingestion programmatically via `POST /api/ingest`.

---

## 4. Quickstart Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended).
- No external databases, Python packages, or API keys required.

### 1. Clone & Start
```bash
git clone https://github.com/your-username/Ghostofthenet.git
cd Ghostofthenet
npm start
```

### 2. Open the Retro Browser
Navigate to **`http://localhost:3000/`** in any modern web browser.

### 3. Build Static Assets (Optional)
```bash
npm run build
```
Creates a bundled production package in the `dist/` folder.

---

## 5. 🚀 Cloud Deployment (Vercel & Render)

### Option A: Deploy to Vercel (Recommended)
This repository is pre-configured with [`vercel.json`](vercel.json) and native serverless handlers in [`api/`](api/):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/guptapiyush16/Ghost-of-the-Net)

**Quick Steps on Vercel Dashboard:**
1. Go to [vercel.com/new](https://vercel.com/new) and import `guptapiyush16/Ghost-of-the-Net`.
2. Vercel automatically reads `vercel.json` (Build Command: `node build.js`, Output: `dist`).
3. Click **Deploy**! Your site is live on Vercel Edge Network in ~30 seconds with automatic SSL.

---

### Option B: Deploy to Render (Web Service)
This repository also includes a [`render.yaml`](render.yaml) blueprint specification for [Render](https://render.com/):

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/guptapiyush16/Ghost-of-the-Net)

**Steps on Render Dashboard:**
1. Sign in to [Render Dashboard](https://dashboard.render.com/) → **New +** → **Blueprint**.
2. Connect `https://github.com/guptapiyush16/Ghost-of-the-Net`.
3. Click **Apply**! Render deploys the Node web service on the free tier.

---

## 6. Project Architecture & Directory Structure

```
Ghostofthenet/
├── index.html          # Semantic HTML5 retro browser shell & experience views
├── styles.css          # Early-2000s desktop chrome, scanlines, and GeoCities styling
├── ghost-client.js     # Virtual browser state machine, BM25 retrieval, Web Audio synth
├── archiveData.js      # Curated historical corpus (3 worlds, multi-page, passages)
├── ingest.js           # Production Wayback Machine CDX ingestion pipeline
├── local-server.js     # Lightweight local/Render Node server with /api/ingest
├── build.js            # Automated build script bundling static assets into dist/
├── Decisions.mc        # Log of architectural decisions & design rationales
├── Flow.md             # Function-by-function execution diagrams and traces
├── tech.md             # Technical interview Q&A on RAG, search, and state machines
└── TODO.md             # Hacktoberfest Week 4 delivery outcomes checklist
```

---

## 6. Project Tracking & Decision Records

In accordance with strict agentic development standards, all major engineering decisions, execution flows, and technical discussions are continuously logged in the repository:
- **[Decisions.mc](file:///c:/PeassBeReasonable/Hacktoberfest/Ghostofthenet/Decisions.mc)**: Chronological log of 7 core architectural decisions (spec alignment, zero-dependency search, state machines, audio synthesis, CDX extraction).
- **[Flow.md](file:///c:/PeassBeReasonable/Hacktoberfest/Ghostofthenet/Flow.md)**: Runtime flowcharts tracing client bootstrap, virtual browser navigation, BM25 search ranking, and CDX ingestion.
- **[tech.md](file:///c:/PeassBeReasonable/Hacktoberfest/Ghostofthenet/tech.md)**: Technical interview-style deep-dives covering epistemic uncertainty in RAG, BM25 vs. vector search, CRT shader accessibility, and temporal index lookups.

---

## 7. Archivist Ethics

*Evidence ≠ Omniscience.* 

Ghost of the Internet is designed as a respectful historical time capsule. The absence of surviving posts does not prove when real people left or why a community dissolved; it merely marks the boundary of what was indexed by web crawlers. The AI ghost never fabricates facts, impersonates historical individuals, or pretends to know what happened beyond the edge of the archive.
