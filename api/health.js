export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'GhostOfTheInternet-Vercel',
    time: new Date().toISOString()
  });
}
