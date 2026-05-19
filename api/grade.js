// Vercel serverless function — Claude-powered marking endpoint.
// Required environment variable: ANTHROPIC_API_KEY
// Optional environment variable: ANTHROPIC_GRADING_MODEL (defaults to claude-sonnet-4-6)
//
// Request body (JSON):
//   {
//     subject:     "gp" | "eng" | "h1econ" | "h2econ" | "general",
//     topic:       string,
//     question:    string,    // the prompt / question the student was answering
//     rubric:      string,    // marking rubric (human-readable; prefer rubricToText())
//     instructions:string,    // homework instructions, optional
//     text:        string,    // extracted essay text, optional
//     images: [{ mediaType: "image/png|jpeg|webp", base64: "...", label: "Page 1" }]
//   }
//
// Response (JSON):
//   {
//     grade:        "A" | "B+" | "5" | "22/25" | etc.
//     summary:      "Short tutor-facing comment (1–2 sentences)",
//     strengths:    ["..."],
//     improvements: ["..."],
//     criteria:     [{ key, label, score, max, comment }],
//     overallPercent: 0-100,
//     model:        "claude-...",
//     raw:          "full markdown feedback Claude wrote, for transparency"
//   }

const API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-6";

export const config = {
  api: { bodyParser: { sizeLimit: "20mb" } },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY is not configured on the server. Add it in your Vercel project settings.",
    });
  }

  const {
    subject = "general",
    topic = "",
    question = "",
    rubric = "",
    instructions = "",
    text = "",
    images = [],
  } = req.body || {};

  if (!text.trim() && (!images || images.length === 0)) {
    return res.status(400).json({ error: "Submission is empty — provide either extracted text or at least one image." });
  }

  const model = process.env.ANTHROPIC_GRADING_MODEL || DEFAULT_MODEL;
  const systemPrompt = buildSystemPrompt({ subject });
  const userContent = buildUserContent({ subject, topic, question, rubric, instructions, text, images });

  try {
    const apiRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2400,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.text();
      return res.status(apiRes.status).json({
        error: `Claude API error (${apiRes.status})`,
        detail: safeJson(errBody),
      });
    }

    const data = await apiRes.json();
    const raw = (data.content || []).map((c) => c.text || "").join("\n").trim();
    const parsed = parseClaudeMarking(raw);
    return res.status(200).json({
      ...parsed,
      raw,
      model: data.model || model,
      usage: data.usage || null,
    });
  } catch (err) {
    return res.status(500).json({ error: "Unexpected error calling Claude", detail: String(err) });
  }
}

function buildSystemPrompt({ subject }) {
  const context = SUBJECT_CONTEXT[subject] || SUBJECT_CONTEXT.general;
  return `You are a strict but fair marker for a Singapore tuition centre. ${context}

When you mark, you MUST:
1. Read the question (if given) and the rubric carefully before judging the work.
2. Be specific. Quote short snippets of the student's writing when praising or criticising.
3. Never invent content the student didn't write. If you cannot read part of the work (e.g. blurry handwriting), say so.
4. Use Singapore English conventions (e.g. "favourable", not "favorable").
5. Hold the standard you'd hold for a real Cambridge / MOE exam — generous on effort, strict on accuracy.
6. ALWAYS respond in the exact JSON-then-prose format described in the user message. The first line of your reply must be a single line of valid JSON inside <grade-json>...</grade-json> tags. Do not wrap it in markdown code fences.`;
}

const SUBJECT_CONTEXT = {
  gp: "You mark Cambridge H1 General Paper (8807). You know the Paper 1 essay band descriptors (Bands 1–5) and the Paper 2 SAQ/AQ mark scheme conventions. Recent and Singapore-relevant examples are valued. The standard for a Band 5 is sophisticated evaluation, not just well-organised argument.",
  eng: "You mark Cambridge O-Level English (1184) — Papers 1 (Writing) and 2 (Comprehension). You apply the official assessment objectives: writing for purpose/audience/form, language accuracy, summary skills, and inference.",
  h1econ: "You mark Cambridge H1 Economics (8823). You apply Level 1 (Knowledge), Level 2 (Application), Level 3 (Analysis), plus Evaluation marks. Diagrams must be labelled and integrated, not decorative.",
  h2econ: "You mark Cambridge H2 Economics (9570). You apply L1/L2/L3 + Evaluation. Diagrams must be tightly integrated with analysis. Real-world Singapore + global examples are expected at this level.",
  general: "You apply the rubric provided by the tutor strictly. If the rubric is silent on a criterion, use professional judgement and flag it.",
};

function buildUserContent({ subject, topic, question, rubric, instructions, text, images }) {
  const parts = [];
  const header = [
    "I'm a tutor. Please mark the student submission below using the rubric provided. Return your reply in this exact format:",
    "",
    "<grade-json>{\"grade\":\"<single grade label, e.g. B+, Band 4, 18/25, 72%>\",\"overallPercent\":<integer 0-100>,\"summary\":\"<one or two sentence tutor-facing comment>\",\"strengths\":[\"<short bullet>\",\"<short bullet>\"],\"improvements\":[\"<short bullet>\",\"<short bullet>\"],\"criteria\":[{\"key\":\"<rubric key>\",\"label\":\"<criterion label>\",\"score\":<number>,\"max\":<number>,\"comment\":\"<one sentence>\"}]}</grade-json>",
    "",
    "Then below the tag, write a longer markdown report the student can read — strengths, weaknesses, and 3 concrete things to do next time. Be specific and quote short bits of their work.",
    "",
    "── CONTEXT ──",
    `Subject: ${subject}`,
    topic ? `Topic: ${topic}` : null,
    question ? `Question / Prompt: ${question}` : "Question / Prompt: (not provided)",
    instructions ? `Tutor instructions to the student: ${instructions}` : null,
    "",
    "── RUBRIC ──",
    rubric || "(No rubric provided — apply professional judgement.)",
    "",
    "── STUDENT SUBMISSION ──",
  ].filter(Boolean).join("\n");
  parts.push({ type: "text", text: header });

  if (text && text.trim()) {
    parts.push({ type: "text", text: text.trim() });
  }
  if (Array.isArray(images) && images.length) {
    parts.push({
      type: "text",
      text: text && text.trim()
        ? "\nThe student also attached the following image(s); read them carefully:"
        : "The submission is the following image(s); please read what the student has written and mark it:",
    });
    for (const img of images) {
      if (!img || !img.base64 || !img.mediaType) continue;
      parts.push({
        type: "image",
        source: { type: "base64", media_type: img.mediaType, data: img.base64 },
      });
      if (img.label) parts.push({ type: "text", text: `(${img.label})` });
    }
  }
  return parts;
}

// Extract the JSON header Claude wrote, fall back to a tolerant structure if it didn't comply.
function parseClaudeMarking(raw) {
  const match = raw.match(/<grade-json>([\s\S]*?)<\/grade-json>/);
  let parsed = null;
  if (match) {
    try {
      parsed = JSON.parse(match[1].trim());
    } catch { /* fall through */ }
  }
  // Look for a bare JSON block if tags weren't used.
  if (!parsed) {
    const jsonMatch = raw.match(/\{[\s\S]*"grade"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch { /* ignore */ }
    }
  }
  const report = match ? raw.slice(match.index + match[0].length).trim() : raw.trim();
  return {
    grade: parsed?.grade ?? "—",
    overallPercent: typeof parsed?.overallPercent === "number" ? parsed.overallPercent : null,
    summary: parsed?.summary ?? "",
    strengths: Array.isArray(parsed?.strengths) ? parsed.strengths : [],
    improvements: Array.isArray(parsed?.improvements) ? parsed.improvements : [],
    criteria: Array.isArray(parsed?.criteria) ? parsed.criteria : [],
    report,
  };
}

function safeJson(s) {
  try { return JSON.parse(s); } catch { return s; }
}
