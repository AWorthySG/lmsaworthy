// Pre-built marking rubrics for each subject + task type.
// Tutors can override per-homework with a free-form rubric field.
// All rubrics target Singapore syllabuses (Cambridge GCE O-Level / Cambridge A-Level / IP).

export const SUBJECT_RUBRICS = {
  gp: {
    label: "H1 General Paper",
    defaultTaskKey: "essay",
    tasks: {
      essay: {
        label: "Paper 1 Essay",
        scale: { type: "band", min: 1, max: 5, target: "Cambridge GP Band Descriptors" },
        criteria: [
          { key: "thesis", label: "Thesis & Position", weight: 4, descriptor: "A clear, defensible position is stated early and sustained. Question type (extent/agreement/comparison/open/cause-solution/evaluative) is correctly identified and addressed." },
          { key: "structure", label: "Essay Structure", weight: 4, descriptor: "Logical organisation — distinct introduction, body paragraphs (PEEL/PEEEL), and a synthesising (not summarising) conclusion. Paragraphs flow with clear signposting." },
          { key: "argument", label: "Argument Quality & Counter-Argument", weight: 5, descriptor: "Strong reasoning, deep analysis, clear concession/rebuttal handling. Engages seriously with opposing views (not strawmen). Awareness of nuance, qualification, scope (always/sometimes/often)." },
          { key: "evidence", label: "Evidence & Examples", weight: 5, descriptor: "Specific, named, recent (last 10 years preferred), accurate examples with dates, figures, statistics, named studies/individuals/countries. Singapore + global mix. Each example linked back to argument." },
          { key: "language", label: "Language & Expression", weight: 4, descriptor: "Sophisticated, precise vocabulary; evaluative phrases; control of register; near-perfect grammar; varied sentence structures." },
          { key: "topic_sentences", label: "Topic Sentences", weight: 2, descriptor: "Each body paragraph opens with a reason-driven topic sentence that previews the argument (X is true because Y, leading to Z)." },
          { key: "length", label: "Length & Time-Management", weight: 1, descriptor: "Target 600–800 words. Penalise <500 (insufficient depth) and >900 (rambles)." },
        ],
        gradeBands: [
          { band: 5, range: [85, 100], descriptor: "Insightful, evaluative, nuanced. Original perspectives. Sophisticated language." },
          { band: 4, range: [70, 84], descriptor: "Cogent, well-developed argument with relevant evidence. Strong language." },
          { band: 3, range: [50, 69], descriptor: "Competent, clear position. Adequate but generic evidence. Some lapses." },
          { band: 2, range: [30, 49], descriptor: "Understanding shown but argument under-developed. Limited examples." },
          { band: 1, range: [0, 29], descriptor: "Off-topic, incoherent, or seriously under-length." },
        ],
      },
      saq: {
        label: "Paper 2 SAQ (Short-Answer Question)",
        scale: { type: "marks", min: 0, max: 35 },
        criteria: [
          { key: "literal", label: "Literal comprehension", weight: 2, descriptor: "Direct answers to factual questions, lifted accurately from passage." },
          { key: "inference", label: "Inference", weight: 3, descriptor: "Reads between the lines; tone, attitude, implied meaning." },
          { key: "vocab", label: "Vocabulary in context", weight: 2, descriptor: "Defines words using context, not dictionary definition. One-word or short-phrase answers." },
          { key: "summary", label: "Summary", weight: 4, descriptor: "Captures all key points; paraphrases (not lifts); within word limit; coherent prose." },
          { key: "ao3", label: "Application (AO3)", weight: 4, descriptor: "Application question — uses authors' ideas + own knowledge + personal stance. Must engage both passages." },
        ],
      },
    },
  },

  eng: {
    label: "O-Level English",
    defaultTaskKey: "comprehension",
    tasks: {
      comprehension: {
        label: "Paper 2 Comprehension",
        scale: { type: "marks", min: 0, max: 50 },
        criteria: [
          { key: "literal", label: "Literal questions", weight: 2, descriptor: "Direct, accurate answers using question stem in response." },
          { key: "inference", label: "Inferential questions", weight: 3, descriptor: "Reads beyond the surface — tone, mood, character motivation, author's purpose." },
          { key: "vocab", label: "Vocabulary in context", weight: 2, descriptor: "Defines using context; one-word/short-phrase answers as required." },
          { key: "language_use", label: "Language use (effect of word/phrase)", weight: 3, descriptor: "Identifies device, explains literal + connotative meaning, effect on reader." },
          { key: "summary", label: "Summary", weight: 4, descriptor: "All required points; paraphrased (not lifted); within 80-word limit; cohesive prose." },
        ],
      },
      narrative: {
        label: "Narrative Writing",
        scale: { type: "marks", min: 0, max: 30 },
        criteria: [
          { key: "content", label: "Content & Plot (15)", weight: 5, descriptor: "Engaging plot with clear arc (exposition→climax→resolution); convincing characters; sensory description; original premise." },
          { key: "language", label: "Language (10)", weight: 4, descriptor: "Varied vocabulary; figurative language; controlled grammar; effective dialogue." },
          { key: "organisation", label: "Organisation (5)", weight: 3, descriptor: "Logical paragraphing; smooth transitions; balanced pacing." },
        ],
      },
      argumentative: {
        label: "Argumentative / Discursive Writing",
        scale: { type: "marks", min: 0, max: 30 },
        criteria: [
          { key: "thesis", label: "Thesis & Stance", weight: 4, descriptor: "Clear position taken from the start; addresses the prompt directly." },
          { key: "reasoning", label: "Reasoning & Evidence", weight: 5, descriptor: "Logical arguments; relevant examples; counter-argument handled fairly." },
          { key: "structure", label: "Structure", weight: 3, descriptor: "Introduction–Body–Conclusion; cohesive paragraphing." },
          { key: "language", label: "Language", weight: 4, descriptor: "Persuasive vocabulary; varied syntax; correct grammar." },
        ],
      },
      summary: {
        label: "Summary Writing",
        scale: { type: "marks", min: 0, max: 15 },
        criteria: [
          { key: "points", label: "Content points", weight: 5, descriptor: "All required points captured from passage." },
          { key: "paraphrase", label: "Paraphrasing", weight: 4, descriptor: "Reworded in own words, not lifted." },
          { key: "length", label: "Length", weight: 2, descriptor: "Within 80-word limit." },
          { key: "cohesion", label: "Cohesion", weight: 2, descriptor: "Flows as coherent prose, not list." },
        ],
      },
      situational: {
        label: "Situational Writing",
        scale: { type: "marks", min: 0, max: 30 },
        criteria: [
          { key: "purpose", label: "Purpose & Task fulfilment", weight: 4, descriptor: "Addresses all bullet points; matches text type (email/report/letter)." },
          { key: "audience", label: "Audience & Tone", weight: 4, descriptor: "Appropriate register for the named recipient." },
          { key: "format", label: "Format", weight: 3, descriptor: "Correct conventions (greeting, sign-off, paragraphing)." },
          { key: "language", label: "Language accuracy", weight: 4, descriptor: "Few errors; clear, precise expression." },
        ],
      },
    },
  },

  h1econ: {
    label: "H1 Economics",
    defaultTaskKey: "essay",
    tasks: {
      essay: {
        label: "Essay Question",
        scale: { type: "level", min: "L1", max: "L3", marks: 25 },
        criteria: [
          { key: "knowledge", label: "Knowledge & Understanding (L1)", weight: 4, descriptor: "Correct definitions, accurate concept use. Defines key economic terms upfront." },
          { key: "application", label: "Application to context (L2)", weight: 5, descriptor: "Uses real-world Singapore/global examples, recent data, named industries. Applies framework to the specific scenario in the question." },
          { key: "analysis", label: "Analysis & Diagrams (L3)", weight: 5, descriptor: "Step-by-step economic reasoning; uses diagrams labelled correctly (axes, curves, equilibrium); explains shifts and effects." },
          { key: "evaluation", label: "Evaluation (E marks)", weight: 5, descriptor: "Weighs trade-offs; considers SR vs LR, depends-on factors (PED, government type, time horizon); reaches a justified conclusion." },
        ],
      },
      caseStudy: {
        label: "Case Study Question",
        scale: { type: "marks", min: 0, max: 30 },
        criteria: [
          { key: "data_use", label: "Use of extract data", weight: 4, descriptor: "Quotes figures, dates, examples from the provided extracts. References specific extract numbers." },
          { key: "knowledge", label: "Concept application", weight: 4, descriptor: "Applies the correct framework to the question (PED, externalities, AD/AS, etc.)." },
          { key: "analysis", label: "Analysis", weight: 4, descriptor: "Logical chain of reasoning with diagrams where appropriate." },
          { key: "evaluation", label: "Evaluation", weight: 4, descriptor: "Higher-order judgement, limitations, alternative perspectives." },
        ],
      },
    },
  },

  h2econ: {
    label: "H2 Economics",
    defaultTaskKey: "essay",
    tasks: {
      essay: {
        label: "Essay (Section A or B)",
        scale: { type: "level", min: "L1", max: "L3", marks: 25 },
        criteria: [
          { key: "knowledge", label: "Knowledge & Definitions (L1)", weight: 3, descriptor: "Accurate economic concepts, sharp definitions of all key terms (MC=MR for monopoly, J-curve, etc.)." },
          { key: "application", label: "Application & Context (L2)", weight: 4, descriptor: "Real, named, recent examples — Singapore + global. Industries, firms, policies named specifically." },
          { key: "analysis", label: "Analysis & Diagrams (L3)", weight: 5, descriptor: "Detailed economic reasoning. Correct, labelled diagrams (axes, curves, equilibrium, dead-weight loss). Mechanism fully explained step-by-step." },
          { key: "evaluation", label: "Evaluation (E marks)", weight: 5, descriptor: "Stand taken with justification. Considers magnitudes, time horizon, assumptions, government effectiveness, alternative policies. Reaches reasoned conclusion." },
          { key: "structure", label: "Structure & Synthesis", weight: 3, descriptor: "Introduction with definitions and stand. Body with TS-Evidence-Analysis-Evaluation. Conclusion synthesises." },
        ],
      },
      caseStudy: {
        label: "Case Study Question",
        scale: { type: "marks", min: 0, max: 30 },
        criteria: [
          { key: "data_use", label: "Use of extract data", weight: 4, descriptor: "Direct references to extracts with figures/quotes; correct extract numbers." },
          { key: "knowledge", label: "Concept application", weight: 4, descriptor: "Correct framework selection for each sub-question." },
          { key: "analysis", label: "Analysis with diagrams", weight: 4, descriptor: "Chains of reasoning with labelled diagrams where relevant." },
          { key: "evaluation", label: "Evaluation", weight: 4, descriptor: "Higher-order judgement on policy effectiveness, magnitudes, limitations." },
        ],
      },
    },
  },

  // Catch-all fallback when no subject rubric exists yet
  general: {
    label: "General",
    defaultTaskKey: "default",
    tasks: {
      default: {
        label: "Generic Marking",
        scale: { type: "percent", min: 0, max: 100 },
        criteria: [
          { key: "content", label: "Content & Accuracy", weight: 5, descriptor: "Accurate, complete, relevant content addressing the task." },
          { key: "reasoning", label: "Reasoning & Analysis", weight: 4, descriptor: "Logical reasoning, depth of analysis." },
          { key: "structure", label: "Structure & Clarity", weight: 3, descriptor: "Clear organisation, easy to follow." },
          { key: "language", label: "Language & Mechanics", weight: 3, descriptor: "Grammar, spelling, precise vocabulary." },
        ],
      },
    },
  },
};

// Pick a sensible default task for a homework based on subject + topic.
export function pickDefaultTask(subject, topic) {
  const subj = SUBJECT_RUBRICS[subject] || SUBJECT_RUBRICS.general;
  if (!topic) return subj.defaultTaskKey;
  const t = topic.toLowerCase();
  if (subject === "eng") {
    if (t.includes("comprehension")) return "comprehension";
    if (t.includes("summary")) return "summary";
    if (t.includes("narrative")) return "narrative";
    if (t.includes("argumentative") || t.includes("discursive")) return "argumentative";
    if (t.includes("situational")) return "situational";
  }
  if (subject === "gp") {
    if (t.includes("paper 2") || t.includes("saq") || t.includes("comprehension")) return "saq";
    return "essay";
  }
  if (subject === "h1econ" || subject === "h2econ") {
    if (t.includes("case") || t.includes("extract")) return "caseStudy";
    return "essay";
  }
  return subj.defaultTaskKey;
}

// Render a rubric to a human-readable string the tutor can edit, and Claude can consume.
export function rubricToText(subject, taskKey) {
  const subj = SUBJECT_RUBRICS[subject] || SUBJECT_RUBRICS.general;
  const task = subj.tasks[taskKey] || subj.tasks[subj.defaultTaskKey];
  if (!task) return "";
  const lines = [];
  lines.push(`SUBJECT: ${subj.label}`);
  lines.push(`TASK: ${task.label}`);
  if (task.scale) {
    if (task.scale.type === "band") lines.push(`GRADE SCALE: Band ${task.scale.min}–${task.scale.max} (${task.scale.target || "band descriptors"})`);
    else if (task.scale.type === "marks") lines.push(`GRADE SCALE: ${task.scale.min}–${task.scale.max} marks`);
    else if (task.scale.type === "level") lines.push(`GRADE SCALE: Levels ${task.scale.min}–${task.scale.max} (${task.scale.marks || 25} marks total)`);
    else if (task.scale.type === "percent") lines.push(`GRADE SCALE: 0–100%`);
  }
  lines.push("");
  lines.push("CRITERIA:");
  task.criteria.forEach((c) => {
    lines.push(`• ${c.label} (weight ${c.weight})`);
    lines.push(`  ${c.descriptor}`);
  });
  if (task.gradeBands) {
    lines.push("");
    lines.push("BAND DESCRIPTORS:");
    task.gradeBands.forEach((b) => {
      lines.push(`Band ${b.band} (${b.range[0]}–${b.range[1]}%): ${b.descriptor}`);
    });
  }
  return lines.join("\n");
}

export function getDefaultRubricForHomework(subject, topic) {
  return rubricToText(subject, pickDefaultTask(subject, topic));
}
