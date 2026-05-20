// Thin client wrapper around POST /api/grade.
// Sends extracted submission content + rubric, receives structured marking response.

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
  const res = await fetch("/api/grade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
