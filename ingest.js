/**
 * Ghost of the Internet — Production Archive Ingestion Pipeline
 * 
 * Fetches real historical website data from the Internet Archive / Wayback Machine CDX API,
 * extracts raw HTML snapshots (using the `id_` modifier to strip Wayback wrappers),
 * cleans archaic markup, extracts passages, and formats the output into a new "Lost World"
 * dataset with an activity fade timeline.
 * 
 * Usage:
 *   node ingest.js --url "info.cern.ch/*" --from 1997 --to 2003 --limit 10
 */

import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));

// CLI Arguments parser
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    url: 'info.cern.ch/*',
    from: '1997',
    to: '2004',
    limit: 6,
    worldId: 'real_archive_' + Date.now().toString(36),
    worldName: 'Real Preserved Archive'
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) options.url = args[++i];
    if (args[i] === '--from' && args[i + 1]) options.from = args[++i];
    if (args[i] === '--to' && args[i + 1]) options.to = args[++i];
    if (args[i] === '--limit' && args[i + 1]) options.limit = parseInt(args[++i], 10);
    if (args[i] === '--name' && args[i + 1]) options.worldName = args[++i];
  }
  return options;
}

// 1. Query Wayback Machine CDX API
export async function queryWaybackCDX(targetUrl, fromYear = '1999', toYear = '2004', limit = 10) {
  const cdxUrl = new URL('https://web.archive.org/cdx/search/cdx');
  cdxUrl.searchParams.set('url', targetUrl);
  cdxUrl.searchParams.set('output', 'json');
  cdxUrl.searchParams.set('from', `${fromYear}0101`);
  cdxUrl.searchParams.set('to', `${toYear}1231`);
  cdxUrl.searchParams.set('filter', 'statuscode:200');
  cdxUrl.searchParams.set('filter', 'mimetype:text/html');
  cdxUrl.searchParams.set('collapse', 'timestamp:6'); // 1 per month
  cdxUrl.searchParams.set('limit', String(limit));
  cdxUrl.searchParams.set('fl', 'timestamp,original,mimetype,statuscode');

  console.log(`[CDX API] Querying Wayback Machine for: ${targetUrl} (${fromYear} - ${toYear})...`);
  const response = await fetch(cdxUrl.toString(), {
    headers: { 'User-Agent': 'GhostOfTheInternet-Archivist/1.0 (Hacktoberfest 2026; Educational)' }
  });

  if (!response.ok) {
    throw new Error(`CDX API error: ${response.status} ${response.statusText}`);
  }

  const rows = await response.json();
  if (rows.length <= 1) {
    console.warn(`[CDX API] No snapshots found for ${targetUrl} in range ${fromYear}-${toYear}.`);
    return [];
  }

  // First row is headers: ['timestamp', 'original', 'mimetype', 'statuscode']
  return rows.slice(1).map(row => ({
    timestamp: row[0],
    originalUrl: row[1],
    mimetype: row[2],
    statuscode: row[3]
  }));
}

// 2. Fetch raw unmodified snapshot using id_ modifier
export async function fetchRawSnapshot(timestamp, originalUrl) {
  // 'id_' modifier returns the original payload without Wayback banners, rewrite scripts, or wrappers
  const rawUrl = `https://web.archive.org/web/${timestamp}id_/${originalUrl}`;
  console.log(`[Snapshot Fetch] Downloading raw payload: ${rawUrl}`);

  const res = await fetch(rawUrl, {
    headers: { 'User-Agent': 'GhostOfTheInternet-Archivist/1.0' }
  });

  if (!res.ok) {
    console.warn(`Failed to fetch snapshot at ${timestamp} (${res.status})`);
    return null;
  }

  return await res.text();
}

// 3. Archaeology Parser: Sanitize HTML & extract meaningful text passages
export function extractTextAndMetadata(html, originalUrl, timestamp) {
  // Strip scripts, styles, head, noscript
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');

  // Extract page title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : originalUrl;

  // Replace block elements with linebreaks
  clean = clean
    .replace(/<(?:p|div|br|tr|h[1-6]|li)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\r/g, '\n');

  // Privacy / PII filter: redact emails & phone numbers
  clean = clean
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[email-redacted]')
    .replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[phone-redacted]');

  // Split into paragraphs / lines
  const rawParagraphs = clean
    .split('\n')
    .map(p => p.trim().replace(/\s+/g, ' '))
    .filter(p => p.length >= 40); // Filter out tiny navigation items / noise

  // Format date from YYYYMMDDHHMMSS
  const year = timestamp.substring(0, 4);
  const monthIdx = parseInt(timestamp.substring(4, 6), 10) - 1;
  const day = timestamp.substring(6, 8);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const formattedDate = `${day} ${months[monthIdx] || 'JAN'} ${year}`;

  return {
    title,
    formattedDate,
    timestamp,
    paragraphs: rawParagraphs.slice(0, 5) // Top passages
  };
}

// 4. Ingest and build a "Lost World" dataset
export async function runIngestion(options = parseArgs()) {
  console.log(`=== GHOST OF THE INTERNET: PRODUCTION ARCHIVE INGESTION ===`);
  console.log(`Target: ${options.url} | Date Range: ${options.from} - ${options.to}`);

  const snapshots = await queryWaybackCDX(options.url, options.from, options.to, options.limit);
  if (snapshots.length === 0) {
    console.log('No historical snapshots retrieved.');
    return null;
  }

  const pages = [];
  const passages = [];
  const timelineMap = new Map();

  for (let i = 0; i < snapshots.length; i++) {
    const snap = snapshots[i];
    const html = await fetchRawSnapshot(snap.timestamp, snap.originalUrl);
    if (!html) continue;

    const data = extractTextAndMetadata(html, snap.originalUrl, snap.timestamp);
    const pageId = `page_${i + 1}`;

    // Timeline count
    const yearMonth = `${data.formattedDate.split(' ')[1]} ${data.formattedDate.split(' ')[2].slice(2)}`;
    timelineMap.set(yearMonth, (timelineMap.get(yearMonth) || 0) + 1);

    // Build page object
    pages.push({
      id: pageId,
      url: snap.originalUrl,
      title: data.title,
      type: 'archived_document',
      date: data.formattedDate,
      summary: data.paragraphs[0] ? data.paragraphs[0].slice(0, 140) + '...' : 'Preserved web document.',
      contentHtml: `
        <div class="production-archive-doc">
          <div class="doc-header">
            <h2>${data.title}</h2>
            <p>Original Source: <a href="${snap.originalUrl}" target="_blank" rel="noopener">${snap.originalUrl}</a> · Snapshot: ${data.formattedDate}</p>
          </div>
          <div class="doc-body">
            ${data.paragraphs.map(p => `<p>${p}</p>`).join('')}
          </div>
        </div>
      `
    });

    // Extract passages for BM25 Ghost Retrieval
    data.paragraphs.forEach((pText, pIdx) => {
      passages.push({
        id: `${options.worldId}_${pageId}_${pIdx}`,
        worldId: options.worldId,
        pageId: pageId,
        title: `${data.title} (Section ${pIdx + 1})`,
        author: 'Preserved Web Record',
        date: data.formattedDate,
        text: pText,
        keywords: pText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3).slice(0, 8)
      });
    });

    // Rate-limiting pause for Internet Archive API politeness
    await new Promise(r => setTimeout(r, 600));
  }

  // Convert timeline map to array
  const maxPosts = Math.max(...Array.from(timelineMap.values()), 1);
  const timeline = Array.from(timelineMap.entries()).map(([month, count]) => ({
    month,
    posts: count * 15, // normalized sample scale
    pct: `${Math.round((count / maxPosts) * 100)}%`
  }));

  const newWorld = {
    id: options.worldId,
    name: options.worldName || 'Real Wayback Archive',
    subtitle: `Preserved records from ${options.url}`,
    category: 'Real Web Archive',
    era: `${options.from} – ${options.to}`,
    captureDate: snapshots[snapshots.length - 1]?.timestamp || 'ARCHIVE',
    homeUrl: snapshots[0]?.originalUrl || options.url,
    themeColor: '#2b506e',
    totalPosts: passages.length,
    stats: {
      snapshotsIndexed: snapshots.length,
      passagesExtracted: passages.length,
      peakMonth: timeline[0]?.month || 'ARCHIVED',
      lastActivity: snapshots[snapshots.length - 1]?.timestamp || 'FINAL',
      fadeStatus: 'Real Web Archive Preserved'
    },
    timeline,
    pages,
    passages
  };

  console.log(`\n✔ Ingestion Complete:`);
  console.log(`- ${pages.length} pages constructed.`);
  console.log(`- ${passages.length} grounded search passages indexed.`);
  console.log(`- Timeline generated across ${timeline.length} time buckets.`);

  return newWorld;
}

// Direct CLI Execution
if (process.argv[1] && process.argv[1].endsWith('ingest.js')) {
  runIngestion().catch(console.error);
}
