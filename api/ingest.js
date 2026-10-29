import { runIngestion } from '../ingest.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const world = await runIngestion({
      url: payload.url || 'info.cern.ch/*',
      from: payload.from || '1997',
      to: payload.to || '2003',
      limit: Math.min(payload.limit || 5, 15),
      worldId: 'wayback_' + Date.now().toString(36),
      worldName: payload.name || payload.url
    });
    return res.status(200).json({ success: true, world });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
