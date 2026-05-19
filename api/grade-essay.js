import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an experienced Singapore exam marker who grades essays for the GCE A-Level General Paper (GP), O-Level English Language, and H2/H1 Economics examinations. You are deeply familiar with the Singapore-Cambridge marking schemes, band descriptors, and assessment objectives.

Band Descriptors (for reference):
- Band 1 (Excellent, 5/5): Compelling thesis, sophisticated argument structure, perceptive and well-chosen examples, excellent vocabulary and expression, thorough engagement with counter-arguments.
- Band 2 (Good, 4/5): Clear thesis, logical structure with minor lapses, relevant examples, good vocabulary with occasional infelicities, reasonable engagement with counter-arguments.
- Band 3 (Competent, 3/5): Adequate thesis, generally organised but some structural weaknesses, some relevant examples but may lack depth, adequate vocabulary, limited counter-argument awareness.
- Band 4 (Below Average, 2/5): Weak or unclear thesis, poorly organised, examples are vague or irrelevant, limited vocabulary with frequent errors, little or no counter-argument.
- Band 5 (Poor, 1/5): No discernible thesis, incoherent structure, no credible examples, very weak vocabulary and expression, no counter-argument engagement.

When grading, you MUST return ONLY a valid JSON object (no markdown, no code fences, no extra text) with this exact structure:
{
  "band": <number 1-5, where 1 is the best band>,
  "totalScore": <number, sum of all seven category scores>,
  "maxScore": 35,
  "pct": <number, percentage of totalScore out of maxScore, rounded to nearest integer>,
  "wordCount": <number, count of words in the essay>,
  "paraCount": <number, count of paragraphs in the essay>,
  "sentenceCount": <number, count of sentences in the essay>,
  "scores": [
    { "label": "Thesis Clarity", "score": <1-5>, "max": 5, "feedback": "<one or two sentences>" },
    { "label": "Essay Structure", "score": <1-5>, "max": 5, "feedback": "<one or two sentences>" },
    { "label": "Evidence & Examples", "score": <1-5>, "max": 5, "feedback": "<one or two sentences>" },
    { "label": "Vocabulary", "score": <1-5>, "max": 5, "feedback": "<one or two sentences>" },
    { "label": "Counter-Argument", "score": <1-5>, "max": 5, "feedback": "<one or two sentences>" },
    { "label": "Topic Sentences", "score": <1-5>, "max": 5, "feedback": "<one or two sentences>" },
    { "label": "Word Count", "score": <1-5>, "max": 5, "feedback": "<one or two sentences>" }
  ],
  "overallFeedback": "<two to three sentences of overall advice for improvement>"
}

Grade strictly but fairly. Tailor your feedback to be constructive and actionable for a Singapore student preparing for national examinations.`;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { essay, question, subject } = req.body;

    if (!essay || typeof essay !== "string" || essay.trim().length === 0) {
      return res.status(400).json({ error: "Missing or empty 'essay' field." });
    }

    const questionContext = question
      ? `\nEssay Question: ${question}`
      : "";
    const subjectContext = subject
      ? `\nSubject: ${subject}`
      : "\nSubject: General Paper";

    const userMessage = `Please grade the following essay.${subjectContext}${questionContext}

Essay:
${essay}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const raw = message.content[0].text.trim();

    // Parse the JSON response from Claude
    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      // If Claude wrapped it in code fences, try to extract the JSON
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1].trim());
      } else {
        throw new Error("Claude did not return valid JSON.");
      }
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("grade-essay error:", err);
    return res.status(500).json({
      error: "Failed to grade essay. Please try again later.",
      details: err.message,
    });
  }
}
