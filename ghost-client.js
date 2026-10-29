import { archiveWorlds, getAllPassages, getWorldById, getPageById, getPassageById } from './archiveData.js';

// DOM Selectors
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Application State
const state = {
  currentWorldId: "nexus_gaming",
  currentPageId: "thread_0047",
  historyStack: [],
  historyIndex: -1,
  ghostMode: "historian", // 'historian' | 'echo'
  audioEnabled: false,
  crtEnabled: true,
  spookyEnabled: true,
  audioContext: null
};

// Web Audio API Retro Sound Synthesizer (Zero external audio file dependencies)
function playRetroSound(type = 'click') {
  if (!state.audioEnabled) return;
  try {
    if (!state.audioContext) {
      state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = state.audioContext;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'dialup') {
      // Short nostalgic modem chirp
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(1200, now);
      osc1.frequency.linearRampToValueAtTime(2400, now + 0.25);
      osc2.frequency.setValueAtTime(600, now);
      osc2.frequency.linearRampToValueAtTime(1800, now + 0.25);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } else if (type === 'spooky') {
      // Cute theremin spooky octave wobble
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(310, now + 0.35);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'candle') {
      // Warm memorial bell chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (err) {
    console.debug('Audio not supported or permitted', err);
  }
}

// BM25 Retrieval Engine for Grounded Historical Search
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
      .filter(w => w.length > 2 && !['the','and','for','that','this','with','have','from','was'].includes(w));
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
        // Boost if matches active world
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

const searchEngine = new BM25SearchEngine(getAllPassages());

// Escape HTML utility
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

// Toast Notifications
const toast = $('#toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

// Navigation & Virtual Browser State Machine
function navigateTo(worldId, pageId, pushHistory = true) {
  playRetroSound('click');
  const world = getWorldById(worldId);
  const page = getPageById(worldId, pageId);
  
  state.currentWorldId = world.id;
  state.currentPageId = page.id;

  if (pushHistory) {
    if (state.historyIndex < state.historyStack.length - 1) {
      state.historyStack = state.historyStack.slice(0, state.historyIndex + 1);
    }
    state.historyStack.push({ worldId: world.id, pageId: page.id, url: page.url, title: page.title });
    state.historyIndex = state.historyStack.length - 1;
  }

  updateBrowserChrome(world, page);
  renderActivePage(world, page);
  updateTimelineView(world);
  updateToolbarButtons();

  // Simulate network load
  simulatePageTransfer(page.url);
}

function updateToolbarButtons() {
  const backBtn = $('#btnBack');
  const fwdBtn = $('#btnForward');
  if (backBtn) backBtn.disabled = state.historyIndex <= 0;
  if (fwdBtn) fwdBtn.disabled = state.historyIndex >= state.historyStack.length - 1;
}

function updateBrowserChrome(world, page) {
  // Title bar
  const titleDisplay = $('#browserTitleDisplay');
  if (titleDisplay) {
    titleDisplay.textContent = `${page.title} — [Retro Navigator 4.0 - ${world.name}]`;
  }

  // Address Bar
  const urlInput = $('#virtualUrlBar');
  if (urlInput) {
    urlInput.value = page.url;
  }

  // Wayback Snapshot Badge
  const snapshotDate = $('#snapshotDate');
  if (snapshotDate) {
    snapshotDate.textContent = world.captureDate;
  }

  // World Selector Active Pill
  $$('.world-selector-card').forEach(card => {
    card.classList.toggle('is-selected', card.dataset.world === world.id);
  });
}

function simulatePageTransfer(url) {
  const statusBar = $('#browserStatusMsg');
  const progress = $('#browserProgressBar');
  if (!statusBar || !progress) return;

  statusBar.textContent = `Connecting to ${new URL(url).hostname}...`;
  progress.style.width = '30%';
  progress.classList.add('is-loading');

  setTimeout(() => {
    progress.style.width = '75%';
    statusBar.textContent = `Transferring 34.2 KB from archive.org...`;
  }, 160);

  setTimeout(() => {
    progress.style.width = '100%';
    statusBar.textContent = `Document: Done`;
    setTimeout(() => {
      progress.classList.remove('is-loading');
      progress.style.width = '0%';
    }, 250);
  }, 380);
}

// Render active page in the Retro Browser view
function renderActivePage(world, page) {
  const container = $('#virtualBrowserContent');
  if (!container) return;

  let html = '';

  if (world.id === 'nexus_gaming') {
    html = renderNexusPage(world, page);
  } else if (world.id === 'pixel_witch_attic') {
    html = renderPixelWitchPage(world, page);
  } else if (world.id === 'starlight_anime') {
    html = renderStarlightPage(world, page);
  }

  container.innerHTML = html;

  // Re-bind links inside the virtual page
  $$('[data-virtual-nav]', container).forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const [wId, pFile] = link.dataset.virtualNav.split('/');
      const pId = pFile.replace('.html', '');
      navigateTo(wId, pId);
    });
  });

  // Re-bind evidence citation triggers inside the rendered page
  $$('.source-trigger', container).forEach(btn => {
    btn.addEventListener('click', () => openEvidenceModal(btn.dataset.source));
  });
}

// Page Renderers
function renderNexusPage(world, page) {
  if (page.type === 'forum_index') {
    return `
      <div class="forum-index-view">
        <div class="thread-head">
          <div>
            <span class="thread-label">ARCHIVE COLLECTION: GAMER_FORUM_03 🎃</span>
            <h1>The Nexus :: Community Discussion Boards</h1>
            <p>Snapshot Date: ${world.captureDate} · 1,284 posts indexed · Read-Only</p>
          </div>
        </div>
        ${page.sections.map(sec => `
          <div class="forum-category-box">
            <div class="cat-header">${sec.category}</div>
            <div class="thread-list">
              ${sec.threads.map(t => `
                <div class="thread-row">
                  <div class="thread-icon">✉</div>
                  <div class="thread-info">
                    <a href="#thread" data-virtual-nav="nexus_gaming/${t.id}.html" class="thread-title-link">${t.title}</a>
                    <span class="thread-meta">Started by <strong>${t.author}</strong> · ${t.replies} replies · ${t.views} views</span>
                  </div>
                  <div class="thread-last-post">${t.lastPost}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Single Thread View
  return `
    <div class="forum-thread-view">
      <div class="thread-head">
        <div>
          <span class="thread-label">ARCHIVED FORUM THREAD 🎃</span>
          <h1>${page.title}</h1>
          <p>Preserved snapshot from ${page.date} · Read-only historical evidence</p>
        </div>
        <div class="thread-actions">
          <button type="button" data-toast="This thread is archived. New replies are disabled.">reply</button>
          <button type="button" class="source-trigger" data-source="nex_01">source citation</button>
        </div>
      </div>
      <div class="posts-container">
        ${(page.posts || []).map((post, idx) => `
          <article class="forum-post ${idx === 0 ? 'original-post' : ''}" id="${post.id}">
            <aside class="post-user">
              <div class="post-avatar avatar-${post.author.includes('ghost') ? 'ghost' : post.author.includes('pixel') ? 'pixel' : 'dialup'}">
                ${post.author.includes('ghost') ? '<img src="/logo.png" alt="ghost_user_97" class="post-avatar-img" />' : post.author.charAt(0).toUpperCase()}
              </div>
              <span class="username">${post.author}</span>
              <span class="rank">${post.rank}</span>
              <span class="post-count">posts: ${post.postCount}</span>
            </aside>
            <div class="post-body">
              <div class="post-meta">
                <span>POST #${idx + 1} · ${post.date}</span>
                <span>ORIGINAL ARCHIVE EXCERPT</span>
              </div>
              <p class="${idx === 0 ? 'lead-post' : ''}">${escapeHtml(post.content)}</p>
              ${post.signature ? `<div class="post-signature">${escapeHtml(post.signature)}</div>` : ''}
              <div class="post-footer">
                <span>IP: archived · ${post.ipStatus || 'Confidence: 0.96'}</span>
                <span>
                  <button type="button" class="inline-source source-trigger" data-source="${post.id === 'post_0047_1' ? 'nex_01' : post.id === 'post_0047_3' ? 'nex_02' : 'nex_03'}">↳ inspect source</button>
                </span>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPixelWitchPage(world, page) {
  if (page.type === 'guestbook') {
    return `
      <div class="geocities-page">
        <div class="geocities-header">
          <h1>✦ Pixel Witch's Cyber Guestbook ✦</h1>
          <p>Signatures from 2003 · Last signed October 12, 2003</p>
          <div class="retro-subnav">
            <a href="#home" data-virtual-nav="pixel_witch_attic/index.html">« Back to Attic Home</a>
            <span>·</span>
            <a href="#shrine" data-virtual-nav="pixel_witch_attic/shrine.html">Sorceress Shrine »</a>
          </div>
        </div>
        <div class="guestbook-entries">
          ${page.entries.map((entry, idx) => `
            <div class="gb-entry-card ${entry.id === 'gb_04' ? 'final-entry' : ''}">
              <div class="gb-entry-head">
                <strong>#${idx + 1} From: ${entry.author} (${entry.city})</strong>
                <span>${entry.date}</span>
              </div>
              <p>${escapeHtml(entry.comment)}</p>
              <div class="gb-entry-foot">
                <button type="button" class="inline-source source-trigger" data-source="${entry.id === 'gb_04' ? 'witch_01' : 'witch_03'}">↳ show evidence</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="geocities-page">
      <div class="geocities-header">
        <h1>${page.title}</h1>
        <div class="retro-subnav">
          <a href="#guestbook" data-virtual-nav="pixel_witch_attic/guestbook.html">✎ Guestbook (${world.stats.guestbookEntries} entries)</a>
          <span>·</span>
          <a href="#shrine" data-virtual-nav="pixel_witch_attic/shrine.html">✦ Sorceress Shrine</a>
        </div>
      </div>
      <div class="geocities-body">
        ${page.contentHtml}
      </div>
    </div>
  `;
}

function renderStarlightPage(world, page) {
  return `
    <div class="starlight-page">
      <div class="starlight-header">
        <div class="starlight-badge">STARLIGHT FAN-NETWORK · EST. 2001 🎃</div>
        <div class="retro-subnav">
          <a href="#index" data-virtual-nav="starlight_anime/index.html">Hub Index</a>
          <span>·</span>
          <a href="#farewell" data-virtual-nav="starlight_anime/farewell.html">Webmaster Farewell Post ⚠</a>
        </div>
      </div>
      <div class="starlight-body">
        ${page.contentHtml}
      </div>
      <div class="starlight-footer">
        <button type="button" class="inline-source source-trigger" data-source="star_01">↳ inspect webmaster shutdown evidence</button>
      </div>
    </div>
  `;
}

// Update "The Last Online" Timeline View
function updateTimelineView(world) {
  const worldTitle = $('#lastOnlineWorldTitle');
  if (worldTitle) worldTitle.textContent = `${world.name} · Activity Fade Map`;

  const timelineRows = $('#timelineRows');
  if (timelineRows) {
    timelineRows.innerHTML = world.timeline.map(t => `
      <div class="timeline-row ${t.posts === 0 ? 'faint' : ''}">
        <span>${t.month}</span>
        <b style="--size:${t.pct}"></b>
        <small>${t.posts} posts ${t.note ? `(${t.note})` : ''}</small>
      </div>
    `).join('');
  }

  const oldestDate = $('#genesisDate');
  const newestDate = $('#lastRecordedDate');
  if (oldestDate) oldestDate.textContent = world.timeline[0]?.month || '2001';
  if (newestDate) newestDate.textContent = world.stats.lastActivity || world.captureDate;
}

// Ask the Ghost Logic (Historian vs Community Echo)
function generateGhostResponse(question, mode) {
  const results = searchEngine.search(question, state.currentWorldId, 3);
  const activeWorld = getWorldById(state.currentWorldId);

  // Confidence check: If query has no relevance or very low score
  if (results.length === 0 || results[0].score < 0.6) {
    return {
      text: `The surviving archive for ${activeWorld.name} ends in ${activeWorld.stats.lastActivity || 'late 2003'} and contains no verifiable mention or record of "${escapeHtml(question)}". Because this is a grounded historical time capsule, I will not fabricate answers outside the surviving evidence.`,
      citations: [],
      isUncertain: true
    };
  }

  const best = results[0].passage;
  const secondary = results[1]?.passage;

  if (mode === 'historian') {
    let answer = `According to the preserved archive of ${activeWorld.name}: On ${best.date}, ${best.author} recorded: "${best.text}"`;
    if (secondary && secondary.score > 0.8) {
      answer += ` Furthermore, a related entry by ${secondary.author} on ${secondary.date} notes that "${secondary.text}"`;
    }
    answer += ` Beyond these preserved traces, the historical archive remains silent regarding subsequent offline events.`;
    return {
      text: answer,
      citations: [best, secondary].filter(Boolean),
      isUncertain: false
    };
  } else {
    // Community Echo Mode
    let echo = `In those days on ${activeWorld.name}, there was a distinct rhythm before the dial-up connection dropped. When people discussed this, the consensus centered around: "${best.text}" (recorded by ${best.author} on ${best.date}).`;
    if (secondary) {
      echo += ` You can still hear the echo of ${secondary.author} reminding everyone: "${secondary.text}".`;
    }
    echo += ` It was a world made of glowing monitors and late-night message boards, preserved right before the silence.`;
    return {
      text: echo,
      citations: [best, secondary].filter(Boolean),
      isUncertain: false
    };
  }
}

// Add message to chat feed
function addChatMessage(type, label, text, citations = []) {
  const feed = $('#chatFeed');
  if (!feed) return;

  const msg = document.createElement('div');
  msg.className = `chat-message ${type}-message`;
  
  let citationsHtml = '';
  if (citations && citations.length > 0) {
    citationsHtml = `
      <div class="chat-citations">
        <span class="citation-label">Evidence Citations:</span>
        ${citations.map(c => `
          <button type="button" class="citation-pill source-trigger" data-source="${c.id}">
            ↳ [${c.author} · ${c.date}]
          </button>
        `).join('')}
      </div>
    `;
  }

  msg.innerHTML = `
    <span class="chat-label">${label}</span>
    <p>${text}</p>
    ${citationsHtml}
  `;

  feed.append(msg);
  msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Bind citation buttons
  $$('.source-trigger', msg).forEach(btn => {
    btn.addEventListener('click', () => openEvidenceModal(btn.dataset.source));
  });
}

// Evidence Inspector Modal / Drawer
function openEvidenceModal(sourceId) {
  playRetroSound('click');
  const passage = getPassageById(sourceId);
  const modal = $('#sourceModal');
  const modalContent = $('#modalContent');
  if (!modal || !modalContent) return;

  if (passage) {
    const world = getWorldById(passage.worldId);
    modalContent.innerHTML = `
      <div class="evidence-header">
        <span class="evidence-tag">VERIFIED ARCHIVE PASSAGE</span>
        <h3>${escapeHtml(passage.title)}</h3>
        <p class="evidence-meta">Source World: <strong>${world.name}</strong> · Author: <strong>${passage.author}</strong> · Date: <strong>${passage.date}</strong></p>
      </div>
      <div class="evidence-quote-box">
        <blockquote>“${escapeHtml(passage.text)}”</blockquote>
      </div>
      <div class="provenance-grid">
        <div><strong>Extraction Confidence:</strong> 0.98</div>
        <div><strong>Record Status:</strong> Read-Only Historical Snapshot</div>
        <div><strong>Wayback ID:</strong> ${passage.worldId}_${passage.pageId}</div>
        <div><strong>Matched Keywords:</strong> ${(passage.keywords || []).slice(0, 5).join(', ')}</div>
      </div>
      <div class="evidence-action-row">
        <button type="button" class="btn-jump-page" id="btnJumpToEvidence">Open Page in Retro Browser ↗</button>
      </div>
    `;

    $('#btnJumpToEvidence')?.addEventListener('click', () => {
      closeEvidenceModal();
      activatePanel('browserPanel');
      navigateTo(passage.worldId, passage.pageId);
    });
  } else {
    modalContent.innerHTML = `
      <h3>Archive Provenance & Retrieval Map</h3>
      <p>Ghost of the Internet operates on verified historical snapshots from 2001–2003. Responses are synthesized from indexed passages using BM25 lexical ranking.</p>
      <code>MODEL MODE: Dual (Historian / Community Echo)
DATA STORE: Local-First Inverted Index
EVALUATION: Epistemic Uncertainty Enforced
PROMISE: Evidence and atmosphere never share a label</code>
    `;
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeEvidenceModal() {
  playRetroSound('click');
  const modal = $('#sourceModal');
  if (modal) {
    modal.hidden = true;
    document.body.style.overflow = '';
  }
}

// Panel Switching (Forum Browser, Ask the Ghost, The Last Online)
function activatePanel(panelId) {
  playRetroSound('click');
  $$('.mode-tab').forEach(tab => {
    const active = tab.dataset.panel === panelId;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  $$('[data-panel-view]').forEach(panel => {
    const active = panel.id === panelId;
    panel.hidden = !active;
    panel.classList.toggle('is-visible', active);
  });
}

// Initialize Application
function initApp() {
  // Bind Mode Tabs
  $$('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => activatePanel(tab.dataset.panel));
  });

  // Bind Navigation Panel Links
  $$('[data-nav-panel]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      activatePanel(link.dataset.navPanel);
      document.getElementById(link.dataset.navPanel)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // World Selector Cards
  $$('.world-selector-card').forEach(card => {
    card.addEventListener('click', () => {
      const worldId = card.dataset.world;
      const world = getWorldById(worldId);
      navigateTo(worldId, world.pages[0].id);
      showToast(`Switched time machine to: ${world.name}`);
    });
  });

  // Browser Chrome Controls (Back, Forward, Refresh, Home)
  $('#btnBack')?.addEventListener('click', () => {
    if (state.historyIndex > 0) {
      state.historyIndex--;
      const target = state.historyStack[state.historyIndex];
      navigateTo(target.worldId, target.pageId, false);
    }
  });

  $('#btnForward')?.addEventListener('click', () => {
    if (state.historyIndex < state.historyStack.length - 1) {
      state.historyIndex++;
      const target = state.historyStack[state.historyIndex];
      navigateTo(target.worldId, target.pageId, false);
    }
  });

  $('#btnRefresh')?.addEventListener('click', () => {
    playRetroSound('click');
    const world = getWorldById(state.currentWorldId);
    const page = getPageById(state.currentWorldId, state.currentPageId);
    simulatePageTransfer(page.url);
    showToast('Page refreshed from archive cache.');
  });

  $('#btnHome')?.addEventListener('click', () => {
    navigateTo('nexus_gaming', 'index');
  });

  // Virtual Address Bar Enter Key
  $('#virtualUrlBar')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      showToast('Navigating via simulated DNS lookup...');
      simulatePageTransfer(e.target.value);
    }
  });

  // Ghost Mode Toggles (Historian vs Community Echo)
  $$('.ghost-mode-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      playRetroSound('click');
      $$('.ghost-mode-toggle button').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.ghostMode = btn.dataset.mode;
      showToast(`Ghost mode set to: ${state.ghostMode.toUpperCase()}`);
    });
  });

  // Chat Form Submission
  $('#chatForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#ghostQuestion');
    const question = input.value.trim();
    if (!question) return input.focus();

    playRetroSound('click');
    addChatMessage('user', 'YOU / NOW', escapeHtml(question));
    input.value = '';

    // Typing / Retrieval indicator
    const feed = $('#chatFeed');
    const typing = document.createElement('div');
    typing.className = 'chat-message ghost-message typing-message';
    typing.innerHTML = `
      <span class="chat-label"><img src="/logo.png" alt="" class="chat-skull-icon" /> THE GHOST / RETRIEVING (${state.ghostMode.toUpperCase()})</span>
      <p>searching BM25 index across ${getWorldById(state.currentWorldId).name} <span class="typing-dots">. . .</span></p>
    `;
    feed.append(typing);
    typing.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => {
      typing.remove();
      const response = generateGhostResponse(question, state.ghostMode);
      addChatMessage(
        'ghost',
        `<img src="/logo.png" alt="" class="chat-skull-icon" /> THE GHOST / ${response.isUncertain ? 'EPISTEMIC BOUNDARY' : state.ghostMode.toUpperCase()}`,
        response.text,
        response.citations
      );
    }, 650);
  });

  // CRT, Audio & Spooky Toggles
  $('#toggleAudio')?.addEventListener('click', () => {
    state.audioEnabled = !state.audioEnabled;
    $('#toggleAudio').textContent = state.audioEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    $('#toggleAudio').classList.toggle('active-pill', state.audioEnabled);
    if (state.audioEnabled) {
      playRetroSound('spooky');
      showToast('Retro audio synthesizer & Halloween chimes enabled.');
    }
  });

  $('#toggleCrt')?.addEventListener('click', () => {
    state.crtEnabled = !state.crtEnabled;
    document.body.classList.toggle('crt-disabled', !state.crtEnabled);
    $('#toggleCrt').textContent = state.crtEnabled ? '📺 CRT: ON' : '📺 CRT: OFF';
  });

  $('#toggleSpooky')?.addEventListener('click', () => {
    state.spookyEnabled = !state.spookyEnabled;
    document.body.classList.toggle('halloween-theme', state.spookyEnabled);
    $('#toggleSpooky').textContent = state.spookyEnabled ? '🎃 Spooky: ON' : '🎃 Spooky: OFF';
    $('#toggleSpooky').classList.toggle('active-pill', state.spookyEnabled);
    playRetroSound('spooky');
    showToast(state.spookyEnabled ? '🎃 Halloween Spooky Mood activated!' : 'Classic archive theme restored.');
  });

  // Floating Spooky Click Easter Eggs
  $('#spookGhost')?.addEventListener('click', () => {
    playRetroSound('spooky');
    showToast('👻 Boo! A friendly ghost from a 2003 message board says hi!');
  });

  $('#spookPumpkin')?.addEventListener('click', () => {
    playRetroSound('spooky');
    showToast('🎃 Happy Halloween from the Internet\'s Attic!');
  });

  // Interactive Digital Graveyard Tombstone Candle Lighting
  $$('.btn-candle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.tombstone-card');
      const countEl = btn.querySelector('.respect-count');
      const nameEl = card.querySelector('.tombstone-name');
      const name = nameEl ? nameEl.textContent : 'this digital relic';

      const isLit = btn.classList.toggle('is-lit');
      card.classList.toggle('is-honored', isLit);

      let count = parseInt(countEl.textContent, 10) || 100;
      countEl.textContent = isLit ? count + 1 : Math.max(1, count - 1);

      if (isLit) {
        playRetroSound('candle');
        showToast(`🕯️ You lit a memorial candle for ${name}.`);
      } else {
        playRetroSound('click');
      }
    });
  });

  // Modal Close Listeners
  $$('.modal-close').forEach(btn => btn.addEventListener('click', closeEvidenceModal));
  $('#sourceModal')?.addEventListener('click', (e) => {
    if (e.target === $('#sourceModal')) closeEvidenceModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeEvidenceModal();
  });

  // Global Toast Triggers
  $$('[data-toast]').forEach(btn => {
    btn.addEventListener('click', () => showToast(btn.dataset.toast));
  });

  // Jump to Ghost Channel
  $$('.jump-ghost').forEach(btn => {
    btn.addEventListener('click', () => {
      activatePanel('ghostPanel');
      $('#ghostPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => $('#ghostQuestion')?.focus(), 300);
    });
  });

  // Initial load
  navigateTo("nexus_gaming", "thread_0047");
}

// Start on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
