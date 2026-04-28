export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  let payload = req.body;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (e) {
      return res.status(400).json({ success: false, error: "Invalid JSON" });
    }
  }

  const webhookUrl = process.env.WEBHOOK_URL || "https://example.com/webhook/quiz";
  const redirectUrl = process.env.PRODUCT_REDIRECT_URL || "https://example.com/product";

  // In a real environment, we forward to the webhook:
  if (!webhookUrl.includes("example.com")) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Webhook error:", err);
    }
  }

  return res.status(200).json({
    success: true,
    redirectUrl: redirectUrl
  });
}
