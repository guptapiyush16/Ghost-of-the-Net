---
title: Ghost of the Internet: Bringing Forgotten Web Communities Back to Life 👻
published: true
tags: devchallenge, hf26challenge, opensource, ai
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)*

## What I Built

**Ghost of the Internet** is an interactive time capsule designed to bring the forgotten web back to life.

The early internet was full of personal websites, gaming forums, fan pages, guestbooks, and small neighborhoods built by people who simply wanted to share something with the world. Over the past two decades, many of these places disappeared completely, while others survive only in fragmented crawls preserved by web archives.

I wanted to explore a central question: **What if we could do more than just view those archived fragments? What if we could talk to the history they preserve?**

For this week's theme, *Ghost in the Machine*, I chose to interpret the "ghost" not as a spooky fictional monster, but as the real digital ghosts of the early web: the forgotten voices, forum discussions, and abandoned websites left behind in copper wires and magnetic tapes twenty-three years ago.

**Ghost of the Internet** combines a nostalgic early-2000s retro browser shell with an in-browser, Retrieval-Augmented Generation (RAG) conversational guide:

1. **Explore the Forgotten Web:** Browse three curated historical worlds through an authentic Windows 98/2000 browser chrome:
   - **The Nexus 2003:** A gaming and dial-up tuning forum discussing Diablo II Baal runs, 900ms lag, and the quiet fade of August 2003.
   - **Pixel Witch's Cyber Attic:** An authentic GeoCities Area51 personal homepage featuring animated visitor counters, glitter dollz, fallen hero shrines, and an untouched guestbook.
   - **Starlight Anime Webring (2003):** An early anime fandom hub with *Serial Experiments Lain* and *Cowboy Bebop* reviews, concluding with the webmaster's farewell server lease broadcast.
2. **Talk to the Ghost:** Interrogate the archive using an in-browser conversational intelligence powered by a mathematical BM25 ranking algorithm ($k_1=1.5, b=0.75$). The Ghost features two response modes:
   - **🏛️ Historian Mode:** Delivers objective, analytical answers strictly citing verbatim quotes, original user handles, and crawl timestamps.
   - **📻 Community Echo Mode:** Captures the atmospheric vernacular and subcultural rhythm of early-2000s forum life.
   - **🛡️ Epistemic Boundary Guardrail:** If asked about events outside the archive (e.g. modern cryptocurrencies or post-2003 history), the Ghost explicitly refuses to hallucinate: *"The surviving archive ends in late 2003 and contains no verifiable mention of this topic. Because this is a grounded historical time capsule, I will not fabricate answers outside surviving evidence."*
3. **Follow the Last Traces & Activity Fade:** Explore dynamically generated monthly post density bar charts across 2001–2003, tracking the exact timeline of when conversations peaked and when crawler sweeps recorded the final post.
4. **Inspect Provenance in Evidence Mode:** Click any citation pill (`↳ [ghost_user_97 · 14 Aug 2003]`) to open an evidence modal showing verbatim raw quotations, confidence scores, and deep-links to jump directly to that page in the retro browser.
5. **Halloween Special — The Digital Graveyard:** In the spirit of Halloween and Día de los Muertos, wander through an interactive graveyard of 3D stone tombstones honoring the departed technologies of our digital childhoods (*Dial-up 56k Modem*, *GeoCities*, *Netscape Navigator*, *Macromedia Flash*, *AIM*, and *The Homepage Guestbook*). Users can click to light memorial candles, accompanied by procedurally synthesized Web Audio bell chimes.

The ghost isn't a resurrected person. It's an AI-generated voice grounded strictly in surviving digital traces. That distinction matters: **Evidence ≠ Omniscience**.

---

## Demo

- **🚀 Live Deployed Website:** [https://ghostofthenet.vercel.app/](https://ghostofthenet.vercel.app/)
- **⚡ Local Server:** `http://localhost:3000/` (via `npm start`)

### Walkthrough Experience
1. Open the live site and step inside **The Nexus 2003** in the retro browser.
2. Click **Thread #0047** to read user `ghost_user_97`'s final message from August 14, 2003. Notice the simulated dial-up progress bar and synchronized Wayback timestamp ribbon.
3. Switch to the **02 Ask the Ghost** tab. Submit the query: *"Why did everyone leave?"*
4. Read the synthesized response and click the citation pill `↳ [ghost_user_97 · 14 Aug 2003]` to open **Evidence Mode**, inspecting the exact verified passage and metadata.
5. Switch to **03 Digital Graveyard & Fade**. Inspect the monthly post decay chart, scroll to the tombstones, and click **"Light a Candle"** on the **DIAL-UP 56K MODEM** or **GEOCITIES** tombstone to hear the memorial chime and increment the respect tally.
6. Toggle the **🎃 Spooky: ON** switch in the top system bar and click the floating ghost and pumpkin companions for retro sound easter eggs.

---

## Code

{% github https://github.com/guptapiyush16/Ghost-of-the-Net %}

- **GitHub Repository:** [https://github.com/guptapiyush16/Ghost-of-the-Net.git](https://github.com/guptapiyush16/Ghost-of-the-Net.git)
- **Automated Test Suite:** Run `npm test` to execute the built-in 45-point end-to-end verification suite (`test-e2e.js`).
- **License:** Open Source (MIT License)

---

## How I Built It

The main challenge was making an AI conversation feel authentic and evocative without allowing the model to invent history.

### The Architecture
```
Ghostofthenet/
├── index.html          # Semantic HTML5 retro browser shell & experience views
├── styles.css          # Early-2000s desktop chrome, scanlines, and GeoCities styling
├── ghost-client.js     # Virtual browser state machine, BM25 retrieval, Web Audio synth
├── archiveData.js      # Curated historical corpus (3 worlds, 8 pages, 10 passages)
├── ingest.js           # Production Wayback Machine CDX API ingestion pipeline
├── local-server.js     # Lightweight local/Render Node server with /api/ingest
├── build.js            # Automated build script bundling static assets into dist/
├── test-e2e.js         # Automated 45-point deterministic verification harness
├── render.yaml         # Render Blueprint Infrastructure-as-Code specification
└── vercel.json         # Vercel Global Edge CDN deployment configuration
```

### 1. Zero-API-Key In-Browser BM25 Retrieval Engine
Instead of relying on remote, closed-source vector database APIs, the search and retrieval pipeline is written in pure ECMAScript and runs 100% in the user's browser. It tokenizes queries, applies stopword filtering, normalizes document lengths, and calculates inverse document frequency (IDF) using standard BM25 ranking parameters ($k_1=1.5, b=0.75$). This gives sub-millisecond retrieval speeds with deterministic repeatability and zero marginal cost.

### 2. Epistemic Uncertainty & Dual Personas
The grounding engine passes the top $K$ passages into a dual-mode synthesis layer. If the highest passage relevance score falls below the confidence threshold ($<0.6$), the engine halts and outputs an explicit statement acknowledging the boundaries of the crawl. When evidence is found, it formats either a rigorous factual citation (Historian Mode) or an evocative subculture reflection (Community Echo Mode).

### 3. Production Archive Ingestion Pipeline (`ingest.js`)
To source real historical web data, I built a command-line pipeline that:
- Queries the Internet Archive’s Capture Index (CDX) API (`web.archive.org/cdx/search/cdx`) with timestamp collapsing (`collapse=timestamp:6`) to capture monthly historical snapshots.
- Retrieves raw payloads using the `id_` modifier (`web.archive.org/web/{timestamp}id_/{url}`) to bypass Wayback banners and rewrite scripts.
- Unwraps archaic nested `<table>` layouts and sanitizes `<script>` and `<style>` blocks.
- Applies regex PII redaction to mask historical emails (`[email-redacted]`) and phone numbers (`[phone-redacted]`) for archival ethics.

### 4. Procedural Web Audio API Synthesizer
Zero audio files (MP3s/WAVs) are downloaded. All sound effects—including mouse clicks, 56k dial-up modem handshakes, theremin warbles, and memorial bell chimes—are synthesized mathematically using Web Audio `OscillatorNode` and `GainNode` frequency envelopes.

### 5. Multi-Cloud Edge Deployment
The application is configured to build cleanly into `dist/` and deploy as an immutable, sub-10ms static site across Vercel’s Global Anycast Edge CDN (`vercel.json`), while also supporting containerized PaaS environments on Render via an Infrastructure-as-Code Blueprint (`render.yaml`).

---

## Why Does Open Innovation Matter?

Digital history is inherently fragile. Websites disappear, hosting services shut down, and online communities lose the context that once made them meaningful. 

Open innovation matters for this project for three fundamental reasons:

1. **Preservation Belongs to Everyone, Not Cloud Providers:** If tools for exploring digital history require paid subscriptions, proprietary vector databases, or closed API tokens, our ability to interact with our own cultural memory becomes paywalled and vulnerable to platform shutdown. By building an open-source, client-side RAG engine, the entire application can run on an offline laptop with the internet turned off.
2. **Eliminating the Compulsion to Hallucinate:** Closed commercial LLMs are trained to always produce a confident answer, even when they lack knowledge. In historical exploration, this is catastrophic—it fabricates quotes and invents fake historical figures. Open innovation allowed us to inspect every step of the retrieval pipeline, enforce strict mathematical score floors, and program the Ghost to honestly admit: *"The archive is silent here."*
3. **Inspectable Provenance & Privacy:** Public web archives contain raw historical traces from real people. An open-source pipeline allows anyone to audit the PII redaction rules, verify extraction ethics, and adapt the codebase to preserve their own family histories, local BBS communities, or school forums.

The goal isn't to manufacture a convincing past. It's to make the past we still have easier to explore.

---

## My Agent Session

This project was built through a collaborative, agentic pair-programming workflow:

- **Automated Verification Harness:** We created a deterministic 45-point test suite ([`test-e2e.js`](file:///c:/PeassBeReasonable/Hacktoberfest/Ghostofthenet/test-e2e.js)) that tests corpus integrity, BM25 scoring math, PII masking, and live edge network responses. Running `npm test` validates all 45 assertions with zero failures.
- **Debugging Cloud Heuristics:** When deploying to Vercel, we diagnosed a subtle platform collision where Vercel's zero-config backend engine (`@vercel/backends`) auto-detected `dist/app.js` as an Express server and wrapped it in a crashing serverless function (`500 FUNCTION_INVOCATION_FAILED`). By renaming the file to `ghost-client.js` and configuring `"framework": null`, we forced Vercel to treat the app as a pure static edge deployment, achieving 100% uptime.
- **Architecture & Decision Logs:** Every meaningful technical tradeoff was recorded in [`Decisions.mc`](file:///c:/PeassBeReasonable/Hacktoberfest/Ghostofthenet/Decisions.mc) (19 decisions logged), execution flows were mapped in [`Flow.md`](file:///c:/PeassBeReasonable/Hacktoberfest/Ghostofthenet/Flow.md), and interview-style technical deep dives were recorded in [`tech.md`](file:///c:/PeassBeReasonable/Hacktoberfest/Ghostofthenet/tech.md).

---

## The Spirit of It

Imagine finding a message board where people discussed their favorite games twenty-three years ago.

You read a post from someone named `ghost_user_97` on August 14, 2003:

> *"anyone still here? my parents say they're cancelling the internet next month lol. i keep getting this weird dial-up noise even when nobody is online. probably nothing. anyway, did anyone else hear it?"*

You scroll through the replies: `dialup_dan` talking about starting high school, another user saying they can only check the board once a week from the public library. Then the posts stop.

When you ask the Ghost: *"What happened to everyone here?"*

The Ghost doesn't pretend to know what college they attended or what careers they chose. It simply shows you the evidence: the sudden drop in posts in late August 2003, the dial-up disconnection notices, and the silence that followed.

That uncertainty is the heart of the experience. The early internet was made of real people, late nights, and glowing CRT monitors. **Ghost of the Internet** helps us listen to the traces they left behind—without pretending those traces tell the whole story.

---

## Prize Categories

### Featured Categories
- **Best Use of Render:** The project includes a production-ready `render.yaml` Infrastructure-as-Code blueprint defining a Node web service with automated builds (`node build.js`), start command (`node local-server.js`), health check probes at `/api/health`, and 1-click deployment instructions in `README.md`.
