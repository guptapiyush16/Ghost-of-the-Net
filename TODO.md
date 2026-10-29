# GHOST.NET MVP Delivery Outcomes (Hacktoberfest 2026 · Week 4)

- [x] **Feature 1: Lost Worlds Portal** — Landing portal featuring 3 distinct, explorable curated historical worlds:
  - *The Nexus 2003* (Classic gaming forum, Diablo II, 56k dial-up tweaks, fading activity).
  - *Pixel Witch's Cyber Attic* (GeoCities personal homepage, blinkies, visitor hit counter, guestbook, fallen Sorceress shrine).
  - *Starlight Anime Webring* (Early fan community, Bebop & Lain episodic discussions, webmaster final broadcast).
- [x] **Feature 2: Retro Browser Shell** — Authentic early-2000s browser chrome complete with:
  - Title bar with minimize/maximize/close buttons.
  - Functional Back, Forward, Reload, and Home toolbar with active history stack.
  - Editable/synced simulated address bar.
  - Wayback snapshot datestamp ribbon (`SNAPSHOT: 14-AUG-2003`).
  - Status bar with simulated network progress bar (`Connecting... Transferring 34.2 KB... Done`).
- [x] **Feature 3: Grounded "Ask the Ghost" (RAG)** — Grounded conversational guide powered by in-memory BM25 lexical search over verified archive passages:
  - Dual response modes: **Historian** (strictly factual with citations) and **Community Echo** (evocative nostalgic summary).
  - Explicit epistemic uncertainty: The model admits silence and marks boundaries when asked questions beyond surviving records.
  - Inline evidence citation pills attached to every response.
- [x] **Feature 4: The Last Online & Activity Fade Map** — Interactive monthly post volume fade charts, genesis vs. last recorded post milestones, and the "Final Traces" closing narrative reflecting on what the archive preserved and what it lost.
- [x] **Feature 5: Evidence Mode & Provenance Inspector** — Dedicated side-by-side inspection drawer revealing exact verbatim quotations, snapshot date, author, collection ID, extraction confidence score, and deep-link jump back to the browser.
- [x] **Atmosphere & Accessibility** — Procedural Web Audio API retro sound synthesizer (clicks & modem chirps), CRT phosphor scanline toggle, full keyboard navigation, and WCAG-compliant `prefers-reduced-motion` overrides.
- [x] **Automated Build & Zero-Dependency Server** — Node.js ESM server (`server.js`) serving static production bundle with sub-second launch and offline capability.
