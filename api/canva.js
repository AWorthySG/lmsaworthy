// Canva Connect API proxy — Vercel serverless function
// Handles OAuth token exchange and API calls to Canva
// Environment variables required:
//   CANVA_CLIENT_ID, CANVA_CLIENT_SECRET, CANVA_REDIRECT_URI

const CANVA_API_BASE = "https://api.canva.com/rest/v1";
const CANVA_AUTH_URL = "https://www.canva.com/api/oauth/authorize";
const CANVA_TOKEN_URL = "https://api.canva.com/rest/v1/oauth/token";

export default async function handler(req, res) {
  // CORS headers for the SPA
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    switch (action) {
      // Step 1: Return the OAuth authorization URL for the frontend to redirect to
      case "auth-url": {
        const state = crypto.randomUUID();
        const scopes = "design:content:read design:content:write asset:read asset:write brandtemplate:content:read brandtemplate:meta:read";
        const url = `${CANVA_AUTH_URL}?response_type=code&client_id=${process.env.CANVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.CANVA_REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
        return res.json({ url, state });
      }

      // Step 2: Exchange authorization code for access token
      case "token": {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: "Missing authorization code" });

        const tokenRes = await fetch(CANVA_TOKEN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${process.env.CANVA_CLIENT_ID}:${process.env.CANVA_CLIENT_SECRET}`).toString("base64")}`,
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.CANVA_REDIRECT_URI,
          }),
        });
        const data = await tokenRes.json();
        if (!tokenRes.ok) return res.status(tokenRes.status).json(data);
        return res.json(data);
      }

      // Step 3: Refresh an expired access token
      case "refresh": {
        const { refresh_token } = req.body;
        if (!refresh_token) return res.status(400).json({ error: "Missing refresh token" });

        const refreshRes = await fetch(CANVA_TOKEN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${process.env.CANVA_CLIENT_ID}:${process.env.CANVA_CLIENT_SECRET}`).toString("base64")}`,
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token,
          }),
        });
        const data = await refreshRes.json();
        if (!refreshRes.ok) return res.status(refreshRes.status).json(data);
        return res.json(data);
      }

      // Step 4: List brand templates available for autofill
      case "templates": {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ error: "Missing access token" });

        const templatesRes = await fetch(`${CANVA_API_BASE}/brand-templates?query=certificate&ownership=owned`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await templatesRes.json();
        if (!templatesRes.ok) return res.status(templatesRes.status).json(data);
        return res.json(data);
      }

      // Step 5: Get a specific brand template's autofill fields
      case "template-fields": {
        const token = req.headers.authorization?.replace("Bearer ", "");
        const { templateId } = req.query;
        if (!token) return res.status(401).json({ error: "Missing access token" });
        if (!templateId) return res.status(400).json({ error: "Missing templateId" });

        const fieldsRes = await fetch(`${CANVA_API_BASE}/brand-templates/${templateId}/dataset`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await fieldsRes.json();
        if (!fieldsRes.ok) return res.status(fieldsRes.status).json(data);
        return res.json(data);
      }

      // Step 6: Create a design from a brand template with autofill data
      case "autofill": {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ error: "Missing access token" });

        const { brand_template_id, title, data } = req.body;
        if (!brand_template_id) return res.status(400).json({ error: "Missing brand_template_id" });

        const autofillRes = await fetch(`${CANVA_API_BASE}/autofill`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ brand_template_id, title, data }),
        });
        const result = await autofillRes.json();
        if (!autofillRes.ok) return res.status(autofillRes.status).json(result);
        return res.json(result);
      }

      // Step 7: Check autofill job status
      case "autofill-status": {
        const token = req.headers.authorization?.replace("Bearer ", "");
        const { jobId } = req.query;
        if (!token) return res.status(401).json({ error: "Missing access token" });
        if (!jobId) return res.status(400).json({ error: "Missing jobId" });

        const statusRes = await fetch(`${CANVA_API_BASE}/autofill/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await statusRes.json();
        if (!statusRes.ok) return res.status(statusRes.status).json(data);
        return res.json(data);
      }

      // Step 8: Export a design as PNG/PDF
      case "export": {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ error: "Missing access token" });

        const { design_id, format = "png" } = req.body;
        if (!design_id) return res.status(400).json({ error: "Missing design_id" });

        const exportRes = await fetch(`${CANVA_API_BASE}/exports`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            design_id,
            format: { type: format },
          }),
        });
        const result = await exportRes.json();
        if (!exportRes.ok) return res.status(exportRes.status).json(result);
        return res.json(result);
      }

      // Step 9: Check export job status
      case "export-status": {
        const token = req.headers.authorization?.replace("Bearer ", "");
        const { exportId } = req.query;
        if (!token) return res.status(401).json({ error: "Missing access token" });
        if (!exportId) return res.status(400).json({ error: "Missing exportId" });

        const statusRes = await fetch(`${CANVA_API_BASE}/exports/${exportId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await statusRes.json();
        if (!statusRes.ok) return res.status(statusRes.status).json(data);
        return res.json(data);
      }

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (err) {
    console.error("Canva API error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
