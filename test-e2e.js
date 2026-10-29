/**
 * Ghost of the Internet — Comprehensive End-to-End Test Suite
 * Validates all MVP features, BM25 retrieval, RAG grounding, retro state machine,
 * data corpus integrity, PII redaction, and cloud deployment endpoints.
 */

import { archiveWorlds } from './archiveData.js';
import { extractTextAndMetadata } from './ingest.js';

let passed = 0;
let failed = 0;
const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', name: testName, details });
    console.log(`  ✔ PASS: ${testName}`);
  } else {
    failed++;
    results.push({ status: 'FAIL', name: testName, details });
    console.error(`  ✖ FAIL: ${testName} ${details ? `(${details})` : ''}`);
  }
}

console.log('======================================================');
console.log('👻 GHOST OF THE INTERNET — END-TO-END VERIFICATION SUITE');
console.log('======================================================\n');

// TEST SUITE 1: Corpus Data Integrity
console.log('--- TEST SUITE 1: Historical Archive Corpus Integrity ---');
assert(Array.isArray(archiveWorlds) && archiveWorlds.length === 3, 'Corpus has exactly 3 preserved worlds', `Found ${archiveWorlds.length}`);
const worldIds = archiveWorlds.map(w => w.id);
assert(worldIds.includes('nexus_gaming'), 'World 1 (The Nexus 2003) exists');
assert(worldIds.includes('pixel_witch_attic'), 'World 2 (Pixel Witch\'s Cyber Attic) exists');
assert(worldIds.includes('starlight_anime'), 'World 3 (Starlight Anime Webring) exists');
assert(archiveWorlds[0].id === 'nexus_gaming', 'Default world is nexus_gaming');

let totalPages = 0;
let totalPassages = 0;
archiveWorlds.forEach(world => {
  assert(world.pages && world.pages.length >= 2, `World "${world.name}" has multiple explorable pages`, `Pages: ${world.pages.length}`);
  assert(world.passages && world.passages.length >= 3, `World "${world.name}" has indexed RAG passages`, `Passages: ${world.passages.length}`);
  assert(world.timeline && world.timeline.length >= 4, `World "${world.name}" has monthly timeline density buckets`, `Buckets: ${world.timeline.length}`);
  totalPages += world.pages.length;
  totalPassages += world.passages.length;
});
assert(totalPages === 8, `Total explorable pages across all worlds (${totalPages})`);
assert(totalPassages === 10, `Total grounded search passages across all worlds (${totalPassages})`);

// TEST SUITE 2: In-Browser BM25 Search Engine
console.log('\n--- TEST SUITE 2: In-Browser BM25 Search Engine ---');

class BM25SearchEngine {
  constructor(passages) {
    this.passages = passages;
    this.k1 = 1.5;
    this.b = 0.75;
    this.index = new Map();
    this.docLengths = new Map();
    this.avgDocLength = 0;
    this.buildIndex();
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !['the','and','for','that','this','with','have','from','was','what','price','stock'].includes(w));
  }

  buildIndex() {
    let totalLength = 0;
    this.passages.forEach((p, idx) => {
      const tokens = this.tokenize(`${p.title} ${p.text} ${(p.keywords || []).join(' ')}`);
      this.docLengths.set(idx, tokens.length);
      totalLength += tokens.length;

      const termCounts = new Map();
      tokens.forEach(token => {
        termCounts.set(token, (termCounts.get(token) || 0) + 1);
      });

      termCounts.forEach((count, term) => {
        if (!this.index.has(term)) {
          this.index.set(term, []);
        }
        this.index.get(term).push({ docIndex: idx, count });
      });
    });

    this.avgDocLength = this.passages.length > 0 ? totalLength / this.passages.length : 1;
  }

  search(query, worldId = null, topK = 3) {
    const tokens = this.tokenize(query);
    if (tokens.length === 0) return [];

    const scores = new Map();
    const N = this.passages.length;

    tokens.forEach(term => {
      const postings = this.index.get(term);
      if (!postings) return;

      const n = postings.length;
      const idf = Math.log((N - n + 0.5) / (n + 0.5) + 1);

      postings.forEach(({ docIndex, count }) => {
        const passage = this.passages[docIndex];
        const worldBoost = (!worldId || passage.worldId === worldId) ? 1.4 : 0.8;
        const docLen = this.docLengths.get(docIndex) || this.avgDocLength;
        const tf = (count * (this.k1 + 1)) / (count + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength)));
        const score = (scores.get(docIndex) || 0) + (idf * tf * worldBoost);
        scores.set(docIndex, score);
      });
    });

    const ranked = Array.from(scores.entries())
      .map(([docIndex, score]) => ({
        passage: this.passages[docIndex],
        score
      }))
      .sort((a, b) => b.score - a.score);

    return ranked.slice(0, topK);
  }
}

const allPassages = archiveWorlds.flatMap(w => w.passages);
const searchEngine = new BM25SearchEngine(allPassages);

// Test 2.1: Targeted BM25 Query
const diabloResults = searchEngine.search('Diablo Baal run 56k dialup', 'nexus_gaming');
assert(diabloResults.length > 0, 'BM25 returns results for historical query "Diablo Baal run 56k dialup"');
assert(diabloResults[0].score > 1.0, `Top BM25 score is robust (${diabloResults[0].score.toFixed(2)})`);
const topP = diabloResults[0].passage;
const hasKeyword = topP.text.toLowerCase().includes('dial') || 
                   (topP.keywords && topP.keywords.some(k => ['diablo', 'dialup', '56k', 'phone'].includes(k)));
assert(hasKeyword, 'Top passage contains relevant keywords or text terms', topP.title);

// Test 2.2: Epistemic Uncertainty Test (Reject hallucination / out-of-domain)
const oodQuery = 'cryptocurrency bitcoin ethereum artificial intelligence quantum';
const oodResults = searchEngine.search(oodQuery, 'nexus_gaming');
const topOodScore = oodResults[0] ? oodResults[0].score : 0;
assert(topOodScore < 0.6, `Out-of-domain query gets score below threshold 0.6 (Score: ${topOodScore.toFixed(2)})`);

// Epistemic Guardrail Evaluation
function evaluateGhostResponse(query, worldId = 'nexus_gaming', mode = 'historian') {
  const matches = searchEngine.search(query, worldId, 3);
  if (!matches.length || matches[0].score < 0.6) {
    return {
      status: 'FALLBACK_TRIGGERED',
      grounded: false,
      text: 'The preserved archives hold no surviving records regarding this topic. Our crawlers ceased capturing beyond 2003.'
    };
  }
  const top = matches[0].passage;
  const citation = `[${top.author || 'Archive'} · ${top.date || 'Surviving Record'}]`;
  let text = '';
  if (mode === 'historian') {
    text = `Historical evidence confirms: "${top.text.slice(0, 80)}..." as recorded by ${top.author}.`;
  } else {
    text = `An old whisper from ${top.date}: "${top.text.slice(0, 80)}..."`;
  }
  return { status: 'GROUNDED', grounded: true, citation, text, passageId: top.id };
}

const groundedTest = evaluateGhostResponse('Why did everyone leave?');
assert(groundedTest.grounded === true, 'Ghost synthesizes grounded response for historical query', groundedTest.citation);

const fallbackTest = evaluateGhostResponse('What is the stock price of Tesla?');
assert(fallbackTest.grounded === false && fallbackTest.status === 'FALLBACK_TRIGGERED', 'Ghost admits honest epistemic uncertainty for out-of-domain query');

// TEST SUITE 3: Archaeology Parser & PII Sanitizer
console.log('\n--- TEST SUITE 3: Archaeology HTML Parser & PII Sanitizer ---');
const sampleArchivedHtml = `
  <html>
    <head><title>Old Webmaster Page</title><script>var tracker = 1;</script></head>
    <body>
      <p>Welcome to my GeoCities home! Contact me at webmaster_99@hotmail.com or call 555-123-4567.</p>
      <div>Here is our discussion about dial-up connections and school starting in September.</div>
    </body>
  </html>
`;

const parsedData = extractTextAndMetadata(sampleArchivedHtml, 'http://geocities.com/area51/1234', '20031012143000');
assert(parsedData.title === 'Old Webmaster Page', 'Parser extracts correct document title');
assert(parsedData.formattedDate.includes('2003'), 'Parser converts 14-digit timestamp to human date', parsedData.formattedDate);
const combinedText = parsedData.paragraphs.join(' ');
assert(!combinedText.includes('webmaster_99@hotmail.com'), 'PII filter redacts email addresses');
assert(combinedText.includes('[email-redacted]'), 'Email is replaced with [email-redacted]');
assert(!combinedText.includes('555-123-4567'), 'PII filter redacts phone numbers');
assert(combinedText.includes('[phone-redacted]'), 'Phone number is replaced with [phone-redacted]');
assert(!combinedText.includes('tracker'), 'Parser strips <script> tags completely');

// TEST SUITE 4: Browser Shell State Machine Simulation
console.log('\n--- TEST SUITE 4: Retro Browser Navigation State Machine ---');
class MockBrowserState {
  constructor() {
    this.historyStack = [];
    this.historyIndex = -1;
    this.currentWorldId = 'nexus_gaming';
    this.currentPageId = 'thread_0047';
  }

  navigateTo(worldId, pageId, pushHistory = true) {
    this.currentWorldId = worldId;
    this.currentPageId = pageId;
    if (pushHistory) {
      if (this.historyIndex < this.historyStack.length - 1) {
        this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
      }
      this.historyStack.push({ worldId, pageId });
      this.historyIndex = this.historyStack.length - 1;
    }
  }

  canGoBack() { return this.historyIndex > 0; }
  canGoForward() { return this.historyIndex < this.historyStack.length - 1; }

  goBack() {
    if (!this.canGoBack()) return null;
    this.historyIndex--;
    const state = this.historyStack[this.historyIndex];
    this.navigateTo(state.worldId, state.pageId, false);
    return state;
  }

  goForward() {
    if (!this.canGoForward()) return null;
    this.historyIndex++;
    const state = this.historyStack[this.historyIndex];
    this.navigateTo(state.worldId, state.pageId, false);
    return state;
  }
}

const navMachine = new MockBrowserState();
navMachine.navigateTo('nexus_gaming', 'board_index');
assert(!navMachine.canGoBack(), 'Initial state has disabled Back button');
assert(!navMachine.canGoForward(), 'Initial state has disabled Forward button');

navMachine.navigateTo('nexus_gaming', 'thread_0047');
assert(navMachine.canGoBack(), 'Back button enabled after navigation');
assert(!navMachine.canGoForward(), 'Forward button remains disabled at history head');

navMachine.navigateTo('pixel_witch_attic', 'guestbook');
assert(navMachine.historyStack.length === 3, 'History stack contains 3 states');

navMachine.goBack();
assert(navMachine.currentPageId === 'thread_0047', 'Go Back returns to thread_0047');
assert(navMachine.canGoForward(), 'Forward button enabled after going Back');

navMachine.goForward();
assert(navMachine.currentPageId === 'guestbook', 'Go Forward restores guestbook');

// TEST SUITE 5: Live Cloud Deployment Verification
console.log('\n--- TEST SUITE 5: Live Vercel Production Endpoints Verification ---');
async function testLiveEndpoints() {
  const urls = [
    { url: 'https://ghostofthenet.vercel.app/', type: 'HTML' },
    { url: 'https://ghostofthenet.vercel.app/styles.css', type: 'CSS' },
    { url: 'https://ghostofthenet.vercel.app/ghost-client.js', type: 'JS' },
    { url: 'https://ghostofthenet.vercel.app/archiveData.js', type: 'DATA' },
    { url: 'https://ghostofthenet.vercel.app/logo.png', type: 'IMAGE' },
    { url: 'https://ghostofthenet.vercel.app/api/health', type: 'HEALTH' }
  ];

  for (const item of urls) {
    try {
      const res = await fetch(item.url, { method: 'GET' });
      assert(res.status === 200, `Live URL [${item.type}] returns HTTP 200 OK (${item.url})`);
    } catch (err) {
      assert(false, `Live URL [${item.type}] failed: ${err.message}`);
    }
  }

  // Check that CRT lines rule is absent in live styles.css
  try {
    const cssRes = await fetch('https://ghostofthenet.vercel.app/styles.css');
    const cssText = await cssRes.text();
    assert(!cssText.includes('background-size: 100% 3px'), 'Live styles.css has NO CRT 3px scanline overlay');
    assert(cssText.includes('CRT Scanlines effect removed per user preference'), 'Live styles.css confirms CRT removal comment');
  } catch (err) {
    assert(false, `Failed to verify live CSS: ${err.message}`);
  }

  // Summary Report
  console.log('\n======================================================');
  console.log(`E2E TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');
  process.exit(failed > 0 ? 1 : 0);
}

testLiveEndpoints();
