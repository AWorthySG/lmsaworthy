/**
 * Upload referenced resources to Firebase Storage.
 *
 * Usage:  node scripts/upload-resources.mjs
 *
 * 1. Reads LMS.jsx and extracts every fileUrl value.
 * 2. Resolves each path under public/ (following symlinks).
 * 3. Uploads to Firebase Storage under resources/...
 * 4. Prints a JSON map of old-path → download URL.
 * 5. Writes updated fileUrls back into LMS.jsx.
 */

import { readFileSync, writeFileSync, existsSync, statSync, createReadStream } from "node:fs";
import { resolve, join } from "node:path";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBzpx_k8G404dSuEUiNWatGCNutMlEyPMs",
  authDomain: "aworthy-lms.firebaseapp.com",
  databaseURL: "https://aworthy-lms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aworthy-lms",
  storageBucket: "aworthy-lms.firebasestorage.app",
  messagingSenderId: "980465378405",
  appId: "1:980465378405:web:394914749a87184e45d28c",
});

const storage = getStorage(firebaseApp);

// ── 1. Extract fileUrl values from LMS.jsx ──────────────────────────
const lmsPath = resolve("src/LMS.jsx");
let lmsSource = readFileSync(lmsPath, "utf-8");

const urlRegex = /fileUrl:\s*"(\/resources\/[^"]+)"/g;
const entries = [];
let m;
while ((m = urlRegex.exec(lmsSource)) !== null) {
  entries.push({ original: m[0], urlPath: m[1] });
}

console.log(`Found ${entries.length} resource references in LMS.jsx\n`);

// ── 2. Deduplicate ──────────────────────────────────────────────────
const uniquePaths = [...new Set(entries.map((e) => e.urlPath))];
console.log(`${uniquePaths.length} unique file paths to upload\n`);

// ── 3. Upload each file ─────────────────────────────────────────────
const urlMap = {}; // old path → firebase download URL
let uploaded = 0;
let missing = 0;
let failed = 0;

for (const urlPath of uniquePaths) {
  // urlPath looks like "/resources/olevel-downloads/file.pdf"
  const localPath = resolve("public" + urlPath);

  if (!existsSync(localPath)) {
    console.warn(`  MISSING: ${urlPath}`);
    missing++;
    continue;
  }

  const storagePath = urlPath.slice(1); // remove leading /
  const storageRef = ref(storage, storagePath);

  try {
    const fileBuffer = readFileSync(localPath);
    const contentType = urlPath.endsWith(".pdf")
      ? "application/pdf"
      : urlPath.endsWith(".docx")
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : "application/octet-stream";

    await uploadBytes(storageRef, fileBuffer, { contentType });
    const downloadURL = await getDownloadURL(storageRef);
    urlMap[urlPath] = downloadURL;
    uploaded++;
    console.log(`  [${uploaded}/${uniquePaths.length}] ✓ ${urlPath}`);
  } catch (err) {
    console.error(`  FAILED: ${urlPath} — ${err.message}`);
    failed++;
  }
}

console.log(`\nDone: ${uploaded} uploaded, ${missing} missing, ${failed} failed\n`);

// ── 4. Rewrite LMS.jsx with Firebase URLs ───────────────────────────
if (uploaded > 0) {
  for (const [oldPath, newUrl] of Object.entries(urlMap)) {
    // Replace all occurrences of the old path with the Firebase URL
    lmsSource = lmsSource.split(oldPath).join(newUrl);
  }
  writeFileSync(lmsPath, lmsSource);
  console.log(`Updated ${uploaded} URLs in LMS.jsx`);
}

// ── 5. Save URL map for reference ───────────────────────────────────
writeFileSync("scripts/url-map.json", JSON.stringify(urlMap, null, 2));
console.log("URL map saved to scripts/url-map.json");

process.exit(0);
