// Extract text or image bytes from a submission file.
// - .docx → text via mammoth
// - .pdf  → text via pdf.js. If no extractable text (scanned), render each page to PNG and return as images.
// - image (jpg/png/webp/heic) → return as base64 image
// Returns { text?: string, images?: [{ mediaType, base64, label }], warnings?: string[] }

import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
// Vite-friendly worker setup
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_PDF_PAGES_AS_IMAGES = 8;
const PDF_RENDER_SCALE = 1.5;

export async function extractFromFile(file) {
  const name = (file.name || "submission").toLowerCase();
  if (name.endsWith(".docx")) return extractDocx(file);
  if (name.endsWith(".pdf")) return extractPdf(file);
  if (/\.(png|jpe?g|webp|heic|heif|gif)$/i.test(name)) return extractImage(file);
  // Plain text fallback
  if (name.endsWith(".txt") || name.endsWith(".md")) {
    const text = await file.text();
    return { text, warnings: [] };
  }
  throw new Error(`Unsupported file type: ${file.name}. Use .docx, .pdf, .png, .jpg, or .txt.`);
}

// Same shape but for a remote URL (e.g. Firebase Storage). Fetches as blob first.
export async function extractFromUrl(url, displayName) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download submission (${res.status})`);
  const blob = await res.blob();
  const file = new File([blob], displayName || url.split("/").pop()?.split("?")[0] || "submission", { type: blob.type });
  return extractFromFile(file);
}

async function extractDocx(file) {
  const buf = await file.arrayBuffer();
  const { value, messages } = await mammoth.extractRawText({ arrayBuffer: buf });
  const warnings = (messages || []).filter((m) => m.type === "warning").map((m) => m.message);
  return { text: value.trim(), warnings };
}

async function extractPdf(file) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const textChunks = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((it) => ("str" in it ? it.str : "")).join(" ").trim();
    if (pageText) textChunks.push(pageText);
  }
  const text = textChunks.join("\n\n").trim();
  // If we got reasonable text, return it.
  if (text.length > 80) return { text, warnings: [] };
  // Otherwise treat as scanned — render up to N pages as PNG and let the vision model read them.
  const images = [];
  const limit = Math.min(pdf.numPages, MAX_PDF_PAGES_AS_IMAGES);
  for (let i = 1; i <= limit; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: PDF_RENDER_SCALE });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;
    const base64 = canvas.toDataURL("image/png").split(",")[1];
    images.push({ mediaType: "image/png", base64, label: `Page ${i}` });
  }
  return {
    images,
    warnings: pdf.numPages > limit ? [`PDF has ${pdf.numPages} pages; only the first ${limit} were sent for marking.`] : [],
  };
}

async function extractImage(file) {
  const warnings = [];
  // Downscale large images so the encoded payload stays under Vercel's request limit
  // and Anthropic's per-image cap. Long edge max 2048px, JPEG quality 0.85.
  const { base64, mediaType, resized } = await downscaleImage(file, 2048, 0.85);
  if (resized) warnings.push("Photo was downscaled to under 2048px for faster marking.");
  if (mediaType === "image/heic" || mediaType === "image/heif") {
    warnings.push("HEIC images may not be readable. Export as JPEG or PNG for best results.");
  }
  return {
    images: [{ mediaType, base64, label: file.name }],
    warnings,
  };
}

function downscaleImage(file, maxEdge, jpegQuality) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const longest = Math.max(img.naturalWidth, img.naturalHeight);
        const needsResize = longest > maxEdge;
        const scale = needsResize ? maxEdge / longest : 1;
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        // Re-encode as JPEG to shrink payload; PNG transparency is rarely useful for marking.
        const dataUrl = canvas.toDataURL("image/jpeg", jpegQuality);
        URL.revokeObjectURL(url);
        const base64 = dataUrl.split(",")[1];
        resolve({ base64, mediaType: "image/jpeg", resized: needsResize });
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Could not decode ${file.name}`)); };
    img.src = url;
  });
}

// Merge multiple extracted submissions into one payload for the grading API.
export function mergeExtractions(items) {
  const texts = [];
  const images = [];
  const warnings = [];
  items.forEach((it, idx) => {
    if (it.text) texts.push(items.length > 1 ? `--- File ${idx + 1} ---\n${it.text}` : it.text);
    if (it.images) images.push(...it.images);
    if (it.warnings) warnings.push(...it.warnings);
  });
  return {
    text: texts.length ? texts.join("\n\n") : undefined,
    images: images.length ? images : undefined,
    warnings,
  };
}
