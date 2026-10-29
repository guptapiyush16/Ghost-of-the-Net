# Technical Interview Q&A (tech.md)
Project: Ghost of the Internet (Hacktoberfest 2026 · Week 4)

This file contains technical interview style questions, deep-dive answers, and architectural discussions reflecting every major design decision and feature implemented in the project.

---

### Question 1: Retrieval-Augmented Generation (RAG) & Epistemic Uncertainty
**Q: How do you design an AI conversational interface over historical web archives to prevent hallucinations and clearly communicate the boundaries of surviving data?**

**Answer:**
Building a trustworthy conversational agent over historical archives requires strict grounding and deliberate calibration of epistemic uncertainty:
1. **Evidence-First Retrieval**: Rather than sending open-ended prompts to an LLM, user questions pass through a local retrieval pipeline (BM25 / lexical inverted index or vector search) over verified archive chunks.
2. **Hard Grounding Constraints**: The synthesis prompt explicitly bounds the context window: the model is instructed to answer *only* from the supplied passages. If the relevance score fails to meet a confidence threshold, the system triggers an "epistemic fallback" admitting the archive has no record of the query (e.g., *"The surviving archive ends in September 2003 and does not contain information regarding..."*).
3. **Explicit Provenance & Separation**: Answers visually segregate AI interpretation from verbatim archive excerpts. Every assertion includes a clickable citation linking directly to the raw preserved post, its archive date, and Wayback Machine/source identifier.
4. **Ethical Disclosures**: The UI reinforces that the absence of posts does not prove when real people left or why a community dissolved; it merely marks the boundary of what was indexed by web crawlers.

---

### Question 2: In-Browser Lexical Search vs. Heavy Vector Embeddings
**Q: For a local-first Hacktoberfest MVP with ~50-100 archived pages, why might an in-browser BM25/TF-IDF lexical search engine be preferable to a vector database with neural embeddings?**

**Answer:**
1. **Zero External Dependencies & Latency**: A lightweight BM25 inverted index implemented in JavaScript runs directly in the client within single-digit milliseconds. Reviewers and users do not need to download gigabyte-sized ONNX models, install vector databases (like Chroma or Pinecone), or obtain third-party API keys.
2. **Exact Terminology & Slang Preservation**: Historical internet subcultures heavily rely on unique terminology, username handles (`ghost_user_97`, `pixel_witch`), dial-up slang, and era-specific gaming jargon (e.g., "56k v.90", "Diablo 2 1.09d", "AIM screenname"). Dense neural embeddings often smooth out or compress rare tokens into generic semantic clusters, whereas BM25 prioritizes exact rare-token matches via Inverse Document Frequency (IDF).
3. **Inspectability & Determinism**: Lexical scoring produces transparent, explainable relevance weights. Reviewers can directly inspect why a passage was selected in an "Evidence Mode" panel.

---

### Question 3: Web Performance, Accessibility, and Retro CRT Aesthetics
**Q: How do you create an authentic early-2000s CRT/Netscape browser aesthetic while maintaining modern web standards, WCAG accessibility, and responsive design?**

**Answer:**
1. **Progressive Enhancement for Visual Effects**: Heavy visual effects such as CRT phosphor scanlines, chromatic aberration, or curvature must be applied using pure CSS overlay layers (e.g., `repeating-linear-gradient` with `mix-blend-mode: overlay` and subtle `box-shadow` vignetting) or SVG filters. They should never interfere with pointer events (`pointer-events: none`).
2. **Reduced Motion & Accessibility**: All scanlines, screen shakes, and typewriter animations must respect `@media (prefers-reduced-motion: reduce)`. When triggered, transitions switch to immediate renders, eliminating flickering that could trigger seizures or discomfort.
3. **Semantic HTML & Screen Reader Support**: Although the UI visually renders an old browser window (with faux title bars, minimize/maximize buttons, and URL bars), the underlying DOM uses semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<time>`, `<dialog>`). High-contrast ratios are enforced for text readability despite retro color palettes.
4. **ARIA Attributes**: Live chat streams use `aria-live="polite"`, modals use `role="dialog"` with `aria-modal="true"`, and tabs implement `role="tablist"` with appropriate `aria-selected` toggles.

---

### Question 4: State Architecture for a Virtual Browser Shell
**Q: How do you model the navigation and history state for a simulated retro browser inside a Single Page Application (SPA)?**

**Answer:**
A simulated browser requires decoupling the outer application's URL from the inner virtual browser's address bar:
1. **State Model**: An internal navigation state object tracks:
   - `historyStack: Array<{ worldId, pageId, title, virtualUrl, timestamp }>`
   - `historyIndex: number`
   - `canGoBack: boolean`, `canGoForward: boolean`
2. **Dynamic Toolbar Activation**: When `historyIndex <= 0`, the Back button is disabled. When `historyIndex >= historyStack.length - 1`, the Forward button is disabled. Navigating to a new document while midway through history truncates forward history just like a real browser.
3. **Simulated Network Latency**: Real-time progress bars animate simulated transfer stages (`Connecting to host...`, `Receiving 34.2 KB...`, `Document: Done`) to evoke early broadband / dial-up latency.

---

### Question 5: Production Ingestion from Web Archives (Wayback Machine CDX API & Raw WARC)
**Q: How do you build a production extraction pipeline to harvest and clean real historical websites from the Wayback Machine at scale?**

**Answer:**
1. **Index Querying via CDX API**: The Internet Archive’s Capture Index (CDX) API allows querying historical captures by domain wildcard (`url=domain.com/*`), date range (`from=YYYYMMDD&to=YYYYMMDD`), and status code (`filter=statuscode:200`). To prevent bias from multiple daily crawler sweeps, the query collapses timestamps (`collapse=timestamp:6`), extracting roughly one snapshot per month to accurately map activity decay over years.
2. **Raw Snapshot Retrieval (`id_` modifier)**: Standard Wayback Machine URLs inject JavaScript navigation toolbars and rewrite links. To obtain pristine original HTML, the pipeline appends the `id_` modifier to the timestamp (`https://web.archive.org/web/{timestamp}id_/{url}`).
3. **Archaeological Parsing & Layout Unwrapping**: Early web design relied heavily on deeply nested `<table>` tags, spacer GIFs, and frames. The parser strips `<script>`, `<style>`, and `<noscript>`, converts layout tables into semantic block streams, and extracts paragraphs exceeding minimum lexical length thresholds ($>40$ chars).
4. **PII Redaction & Archive Ethics**: Public archives often contain historical emails and phone numbers from an era before spam scrapers were ubiquitous. The production pipeline applies automated regex sanitizers to mask emails (`[email-redacted]`) and phone numbers before storing passages in search indexes.

---

### Question 6: CDX Index Lookup vs. Synchronous On-Demand Fetching in Web Archive Applications
**Q: Why can't a web archive exploration tool simply query Wayback URLs directly on-demand whenever a user opens a site, bypassing the CDX index API?**

**Answer:**
Directly querying Wayback URLs on-demand without querying the CDX index first breaks four fundamental system requirements:
1. **Temporal Non-Determinism (The Missing Timestamp)**: The live web uses static URLs (`example.com/page.html`), but historical archives are multi-dimensional: content is stored across hundreds of 14-digit timestamps (`YYYYMMDDHHMMSS`). Without querying the index (CDX), the system has no way of knowing what dates were actually crawled, which snapshots succeeded (HTTP 200), and which were crawl errors (HTTP 404/500).
2. **Corpus-Level RAG vs. Single-Page Scraping**: Answering questions such as *"Why did everyone leave this forum?"* or *"What did people care about here?"* requires retrieving evidence across an entire corpus of 30–100 interconnected discussions. If retrieval depended on synchronous scraping, an AI chat query would have to initiate 50+ network roundtrips to `archive.org` sequentially, taking 2 to 3 minutes and hitting HTTP 429 rate limits.
3. **Timeline & Activity Fade Synthesis**: Feature 4 ("The Last Online") relies on calculating post density and decay curves over months and years. This statistical distribution can only be computed by inspecting the metadata of all captures in the CDX index.
4. **Latency & Resilience**: Live requests to public web archives typically take 2 to 6 seconds per page. The production solution is a **Read-Through Cache Pattern**: the CDX index is queried once to discover the archive map and pre-populate an in-memory or SQLite index, enabling sub-10ms browsing and instant AI retrieval.
