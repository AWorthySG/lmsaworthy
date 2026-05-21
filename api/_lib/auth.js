// Shared helpers for Vercel serverless functions.
// Verifies the caller is a signed-in Firebase user, restricts CORS to known origins,
// and provides an in-memory rate limiter for grading endpoints.

import crypto from "crypto";

const ALLOWED_ORIGINS = [
  "https://lms.a-worthy.com",
  "https://www.a-worthy.com",
  "http://localhost:5173",
  "http://localhost:5174",
];

const FIREBASE_PROJECT_ID = "aworthy-lms";

// In-memory sliding-window rate limit. Resets when the function instance is recycled.
const RATE_LIMITS = new Map();

export function applyCors(req, res, { methods = "POST, OPTIONS" } = {}) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

// Verify a Firebase ID token against Google's public certs. Returns the decoded
// payload on success; throws on failure.
let cachedCerts = null;
let certsExpiry = 0;

async function fetchGoogleCerts() {
  if (cachedCerts && Date.now() < certsExpiry) return cachedCerts;
  const res = await fetch("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");
  if (!res.ok) throw new Error("Failed to fetch Google certs");
  cachedCerts = await res.json();
  const cacheControl = res.headers.get("cache-control") || "";
  const maxAge = parseInt((cacheControl.match(/max-age=(\d+)/) || [])[1] || "3600", 10);
  certsExpiry = Date.now() + maxAge * 1000;
  return cachedCerts;
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Buffer.from(str, "base64");
}

export async function verifyFirebaseIdToken(idToken) {
  if (!idToken || typeof idToken !== "string") throw new Error("Missing ID token");
  const [headerB64, payloadB64, signatureB64] = idToken.split(".");
  if (!headerB64 || !payloadB64 || !signatureB64) throw new Error("Malformed token");

  const header = JSON.parse(base64UrlDecode(headerB64).toString("utf8"));
  const payload = JSON.parse(base64UrlDecode(payloadB64).toString("utf8"));

  if (payload.aud !== FIREBASE_PROJECT_ID) throw new Error("Token audience mismatch");
  if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) throw new Error("Token issuer mismatch");
  if (!payload.sub) throw new Error("Token missing subject");
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) throw new Error("Token expired");
  if (payload.iat > now + 60) throw new Error("Token issued in the future");

  const certs = await fetchGoogleCerts();
  const cert = certs[header.kid];
  if (!cert) throw new Error("Unknown signing key");

  const signedData = `${headerB64}.${payloadB64}`;
  const signature = base64UrlDecode(signatureB64);
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(signedData);
  if (!verifier.verify(cert, signature)) throw new Error("Invalid token signature");

  return { uid: payload.sub, email: payload.email || null, payload };
}

export async function requireAuth(req, res) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  try {
    return await verifyFirebaseIdToken(token);
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return null;
  }
}

// Sliding window rate limit. Returns true if the request should proceed.
export function checkRateLimit(uid, { windowMs = 60_000, maxRequests = 10 } = {}) {
  const now = Date.now();
  const arr = RATE_LIMITS.get(uid) || [];
  const recent = arr.filter(t => now - t < windowMs);
  if (recent.length >= maxRequests) {
    RATE_LIMITS.set(uid, recent);
    return false;
  }
  recent.push(now);
  RATE_LIMITS.set(uid, recent);
  return true;
}
