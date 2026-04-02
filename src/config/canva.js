// Canva Connect API — frontend service module
// Calls the Vercel serverless proxy at /api/canva

const API_BASE = "/api/canva";

const STORAGE_KEY = "canva_tokens";

function getStoredTokens() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch { return null; }
}

function storeTokens(tokens) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (tokens.expires_in || 3600) * 1000,
  }));
}

export function clearCanvaTokens() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isCanvaConnected() {
  const t = getStoredTokens();
  return !!(t && t.access_token);
}

async function getValidToken() {
  const tokens = getStoredTokens();
  if (!tokens) return null;

  // Refresh if expiring within 5 minutes
  if (tokens.expires_at && tokens.expires_at - Date.now() < 300000) {
    if (!tokens.refresh_token) return null;
    try {
      const res = await fetch(`${API_BASE}?action=refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: tokens.refresh_token }),
      });
      if (!res.ok) { clearCanvaTokens(); return null; }
      const data = await res.json();
      storeTokens(data);
      return data.access_token;
    } catch { clearCanvaTokens(); return null; }
  }

  return tokens.access_token;
}

// Step 1: Get OAuth URL and redirect
export async function startCanvaAuth() {
  const res = await fetch(`${API_BASE}?action=auth-url`);
  const { url } = await res.json();
  window.location.href = url;
}

// Step 2: Exchange code for token (call from OAuth callback)
export async function exchangeCanvaCode(code) {
  const res = await fetch(`${API_BASE}?action=token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error("Token exchange failed");
  const data = await res.json();
  storeTokens(data);
  return data;
}

// List brand templates
export async function listTemplates() {
  const token = await getValidToken();
  if (!token) throw new Error("Not connected to Canva");
  const res = await fetch(`${API_BASE}?action=templates`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
}

// Get template autofill fields
export async function getTemplateFields(templateId) {
  const token = await getValidToken();
  if (!token) throw new Error("Not connected to Canva");
  const res = await fetch(`${API_BASE}?action=template-fields&templateId=${templateId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch template fields");
  return res.json();
}

// Create autofilled design
export async function createAutofill({ brand_template_id, title, data }) {
  const token = await getValidToken();
  if (!token) throw new Error("Not connected to Canva");
  const res = await fetch(`${API_BASE}?action=autofill`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ brand_template_id, title, data }),
  });
  if (!res.ok) throw new Error("Autofill failed");
  return res.json();
}

// Poll autofill job status
export async function checkAutofillStatus(jobId) {
  const token = await getValidToken();
  if (!token) throw new Error("Not connected to Canva");
  const res = await fetch(`${API_BASE}?action=autofill-status&jobId=${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Status check failed");
  return res.json();
}

// Export design as PNG/PDF
export async function exportDesign(designId, format = "png") {
  const token = await getValidToken();
  if (!token) throw new Error("Not connected to Canva");
  const res = await fetch(`${API_BASE}?action=export`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ design_id: designId, format }),
  });
  if (!res.ok) throw new Error("Export failed");
  return res.json();
}

// Poll export job status
export async function checkExportStatus(exportId) {
  const token = await getValidToken();
  if (!token) throw new Error("Not connected to Canva");
  const res = await fetch(`${API_BASE}?action=export-status&exportId=${exportId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Export status check failed");
  return res.json();
}

// Poll a job until complete (works for both autofill and export)
export async function pollJob(checkFn, id, { maxAttempts = 30, interval = 2000 } = {}) {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await checkFn(id);
    const status = result.job?.status || result.status;
    if (status === "success" || status === "completed") return result;
    if (status === "failed") throw new Error("Job failed");
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error("Job timed out");
}
