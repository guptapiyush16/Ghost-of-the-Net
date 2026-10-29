# Decisions Log (Decisions.mc)
Project: Ghost of the Internet (Hacktoberfest 2026 · Week 4)

---

### [2026-10-29] Decision 01: Repository Analysis and Alignment with Hacktoberfest 2026 MVP Spec
- **Context**: The user provided the official MVP Product Specification for "Ghost of the Internet", which outlines 5 core MVP features: (1) Lost Worlds (3 curated collections), (2) Retro Browser Shell, (3) Ask the Ghost (retrieval-grounded conversational agent), (4) The Last Online (archive timeline & activity fade), and (5) Evidence Mode (distinguishing quotations from generated explanations with verifiable citations).
- **Evaluation of Existing Code**:
  - The previous workspace contained a single-page prototype for one forum thread (`GAMER_FORUM_03`, Thread #0047), a regex-based dummy ghost response, and basic styling.
  - Missing elements: Multi-world navigation (3 distinct lost worlds/sections), authentic early-2000s browser chrome (address bar, back/forward/refresh/home, status bar), multi-document archive search/retrieval index, response modes (Historian vs. Community Echo), and rich evidence inspection.
- **Decision**: Evolve the project from a single static thread mockup into a full-featured, zero-dependency interactive Retro Browser and Time Machine matching all 5 MVP specification pillars.
- **Reason**: Delivers the exact user journey described in the Hacktoberfest specification: enter lost internet -> explore digital ruin -> talk to ghost with evidence -> discover final traces.

---

### [2026-10-29] Decision 02: Architecture of the Archive Store & Retrieval Engine
- **Context**: The spec suggests JSON/SQLite archive storage with keyword search (BM25/TF-IDF) or SQLite FTS, and an open-weight model / local inference pipeline.
- **Decision**: 
  1. Build a structured archive dataset (`archiveData.js`) containing 3 distinct lost worlds:
     - World 1: `The Nexus 2003` (Classic gaming forum: Diablo II, hardware, late night off-topic).
     - World 2: `Pixel Witch's Cyber Attic` (Personal GeoCities-style homepage: guestbook, blinkies, webring, shrines).
     - World 3: `Starlight Anime Webring Hub` (Early 2000s fan community: episodic reviews, fanfic exchange, farewell post).
  2. Implement an in-memory TF-IDF / BM25 lexical retrieval engine (`BM25SearchEngine`) with citation scoring that runs client-side with backend server fallback in `server.js`.
- **Reason**: Guarantees zero friction for judges and Hacktoberfest reviewers (instant execution via `node server.js` with no required external API keys or heavy Python runtime), while remaining 100% faithful to the grounding/retrieval architecture required by the spec.

---

### [2026-10-29] Decision 03: Distinct AI Response Modes (Historian vs. Community Echo)
- **Context**: Spec section 5 details:
  - *Historian*: Answers factual questions with precise citations and honest uncertainty when data is missing.
  - *Community Echo*: Summarizes collective sentiments, slang, and cultural tone without pretending to be a real person.
- **Decision**: Add a mode toggle directly in the "Ask the Ghost" interface allowing users to switch between Historian and Community Echo, complete with citation badges and "Evidence Drawer" links.
- **Reason**: Directly implements the spec's requirement that the AI never fabricates history or impersonates individuals deceptively, maintaining strict archive ethics.

---

### [2026-10-29] Decision 04: Retro Browser State Machine & Virtual Navigation
- **Context**: Feature 2 requires navigating preserved pages within a convincing early-2000s browser shell.
- **Decision**: Implemented an internal navigation state machine in `app.js` with a `historyStack`, `historyIndex`, dynamic back/forward toolbar activation, simulated DNS lookup, simulated network progress bar (`Connecting... Transferring 34.2 KB... Done`), and synchronized Wayback snapshot datestamp badges.
- **Reason**: Gives visitors the visceral, tactile feeling of using a Netscape Navigator or Internet Explorer 5.5 browser without leaving the single-page application.

---

### [2026-10-29] Decision 05: Audio Synthesis via Web Audio API (Zero External Files)
- **Context**: Retro atmosphere benefits enormously from tactile feedback (clicks, dial-up chirps), but external MP3s/WAVs can fail to load, suffer CORS issues, or add bloat.
- **Decision**: Implemented a self-contained Web Audio API synthesizer for tactile clicks and dial-up chirps with an explicit user toggle (`🔇 Sound: OFF/ON`) defaulting to muted.
- **Reason**: 100% reliable, zero network overhead, non-intrusive, and accessible.

---

### [2026-10-29] Decision 06: Production Pipeline for Real Website Extraction via Wayback Machine CDX API
- **Context**: Transitioning the system to production so it can extract real website information dynamically rather than relying purely on seed data.
- **Decision**:
  1. Built `ingest.js` leveraging the official Internet Archive Wayback Machine CDX API (`https://web.archive.org/cdx/search/cdx`) with monthly timestamp collapse (`collapse=timestamp:6`) and MIME filtering (`mimetype:text/html`).
  2. Implemented raw snapshot fetching using the Wayback `id_` modifier (`web.archive.org/web/{timestamp}id_/{url}`) to strip archive UI wrappers and analytics.
  3. Built an HTML Archaeology Parser with PII redaction (masking emails and phone numbers) to extract meaningful text passages.
  4. Added `POST /api/ingest` and `GET /api/health` in `server.js` allowing programmatic creation of new explorable Lost Worlds on demand.
- **Reason**: Fulfills the production roadmap by enabling real-world historical archives to be ingested and transformed into explorable digital worlds with zero manual formatting.

---

### [2026-10-29] Decision 07: Why CDX API Pre-Indexing is Required vs. Live On-Demand Crawling
- **Context**: Evaluating whether the system could bypass CDX API pre-indexing and simply fetch the target website directly whenever a user visits a page.
- **Decision**: Retain CDX API index querying and caching rather than doing naive synchronous scraping on user navigation.
- **Reason**:
  1. *Timestamp Discovery*: The Wayback Machine has no static URL for a historical page; content is addressable only by arbitrary 14-digit crawl timestamps (`YYYYMMDDHHMMSS`). CDX is the essential "Table of Contents" that reveals which dates actually exist.
  2. *RAG & Conversational Ghost Search*: The AI Ghost cannot answer questions like "Why did people leave?" by reading a single page. It must search across an entire corpus of 50-200 pages. Fetching 50 pages live from archive.org during a chat request would take 60-120 seconds, exceeding HTTP timeouts. Pre-indexing into BM25/FTS enables sub-10ms search.
  3. *Rate Limiting & Latency*: Live Wayback queries suffer from 2-8 second network latency per request and aggressive HTTP 429 rate limiting.
  4. *Activity Fade Timeline*: To render "The Last Online" decay curve, the full chronological distribution of captures across years must be known in advance.

---

### [2026-10-29] Decision 08: Hacktoberfest Submission Documentation & User Education
- **Context**: The user requested a polished README and intuitive conceptual clarification of "Ingestion" and "The Original Website".
- **Decision**: Created [README.md](file:///c:/PeassBeReasonable/Hacktoberfest/Ghostofthenet/README.md) with comprehensive architecture schematics, Quickstart guide, feature delivery matrix, and ethics statement. Explained ingestion using the archival library restoration analogy.
- **Reason**: Ensures open-source reviewers, judges, and users can immediately understand the project purpose, architecture, and reproducibility.
