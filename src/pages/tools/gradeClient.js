// Thin client wrapper around POST /api/grade.
// Sends extracted submission content + rubric, receives structured marking response.

import { firebaseAuth } from "../../config/firebase.js";

async function getAuthHeader() {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("You must be signed in to use AI grading.");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function gradeSubmission({ subject, topic, question, rubric, text, images, instructions }) {
  const body = {
    subject: subject || "general",
    topic: topic || "",
    question: question || "",
    rubric: rubric || "",
    instructions: instructions || "",
    text: text || "",
    images: images || [],
  };
  const authHeader = await getAuthHeader();
  const res = await fetch("/api/grade", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j.error || j.message || "";
    } catch { /* ignore */ }
    throw new Error(`Grading failed (${res.status}): ${detail || res.statusText}`);
  }
  return res.json();
}
