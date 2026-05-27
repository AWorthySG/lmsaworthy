/**
 * Upload O-Level English editing practice papers to Firebase Storage
 * and generate seed entries for initialPastPaperDocs.
 *
 * Usage:  node scripts/upload-practice-papers.mjs
 *
 * Uploads all Paper-XX-Q.pdf and Paper-XX-A.pdf from
 * public/resources/eng/finalised-2026/practice/ to Firebase Storage
 * at past-papers/eng/practice/, then writes the resulting
 * initialPastPaperDocs entries to scripts/practice-papers-seed.json.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
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

const LOCAL_DIR = resolve("public/resources/eng/finalised-2026/practice");
const STORAGE_PREFIX = "resources/eng/practice";

// IDs 1-3 are the existing seeded papers; start from 4.
let nextId = 4;

const entries = [];
let uploaded = 0;
let failed = 0;

for (let num = 1; num <= 50; num++) {
  const padded = String(num).padStart(2, "0");

  for (const variant of ["Q", "A"]) {
    const fileName = `Paper-${padded}-${variant}.pdf`;
    const localPath = `${LOCAL_DIR}/${fileName}`;
    const storagePath = `${STORAGE_PREFIX}/${fileName}`;
    const label = variant === "Q" ? "Questions" : "Answers";
    const name = `Editing Practice ${padded} — ${label}`;

    if (!existsSync(localPath)) {
      console.warn(`  MISSING: ${localPath}`);
      failed++;
      continue;
    }

    const storageRef = ref(storage, storagePath);

    try {
      const fileBuffer = readFileSync(localPath);
      await uploadBytes(storageRef, fileBuffer, { contentType: "application/pdf" });
      const url = await getDownloadURL(storageRef);

      entries.push({
        id: nextId++,
        name,
        fileName,
        url,
        subject: "eng",
        fileType: "pdf",
        year: 2026,
        school: "A Worthy Learning",
        uploadedAt: "2026-01-01",
        uploadedBy: "Tutor",
      });

      uploaded++;
      console.log(`  [${uploaded}] ✓ ${name}`);
    } catch (err) {
      console.error(`  FAILED: ${fileName} — ${err.message}`);
      failed++;
    }
  }
}

console.log(`\nDone: ${uploaded} uploaded, ${failed} failed`);

writeFileSync(
  "scripts/practice-papers-seed.json",
  JSON.stringify(entries, null, 2),
);
console.log(`\nSeed data written to scripts/practice-papers-seed.json`);
console.log(`\nNext step: run node scripts/apply-practice-papers-seed.mjs`);
