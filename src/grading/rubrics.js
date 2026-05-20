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
          { key: "knowledge", label: "Knowledge & Understanding (L1)", weight: 4, descriptor: "Defines key economic terms upfront (demand, PED, externality, AD/AS, etc.). Correct concept use without contradicting standard A-level definitions." },
          { key: "application", label: "Application to context (L2)", weight: 5, descriptor: "Uses real-world Singapore + global examples with recent data and named industries/policies (CDC vouchers, GST, MAS exchange rate policy, NTU strike, etc.). Each example explicitly linked to the question scenario." },
          { key: "analysis", label: "Analysis — reasoning chain (L3)", weight: 4, descriptor: "Step-by-step economic mechanism: cause → intermediate effect → final effect, with each step justified. Avoids leaps. Distinguishes correlation from causation." },
          { key: "diagrams", label: "Diagrams — accuracy & integration (L3)", weight: 4, descriptor: "For every diagram the student draws, check ALL of:\n    (a) Both axes labelled with correct variables (e.g. 'Price' on Y, 'Quantity' on X — not P/Q without units).\n    (b) Curves labelled (D, S, MC, MR, AC, AD, AS, LRAS, etc.).\n    (c) Initial equilibrium clearly marked with a point and dropped guide lines (P0, Q0).\n    (d) Direction of shift correct given the scenario (e.g. tax → S shifts left/up; subsidy → S shifts right/down).\n    (e) New equilibrium clearly marked (P1, Q1).\n    (f) Where relevant, shaded areas labelled (DWL, CS, PS, tax revenue, subsidy cost).\n    (g) Diagram referenced in the prose — student writes 'as shown in Figure 1' or similar.\n    Award full marks only when all relevant points apply; deduct proportionally for each missing item. If the photograph is unclear, say so rather than guess." },
          { key: "evaluation", label: "Evaluation (E marks)", weight: 4, descriptor: "Weighs trade-offs; considers SR vs LR, depends-on factors (PED/PES values, government type, time horizon, magnitudes). Reaches a justified, qualified conclusion — not a one-line summary." },
        ],
        misconceptions: [
          "Confusing 'demand' (the curve) with 'quantity demanded' (a point) — flag if student writes 'demand decreases' when they mean a movement along the curve due to price change.",
          "Same confusion for 'supply' vs 'quantity supplied'.",
          "Treating MC = MR as a synonym for 'profit maximisation' without explaining it locates the profit-max output.",
          "Asserting 'monopoly is bad' without comparing allocative efficiency loss against potential dynamic efficiency / EOS gains.",
          "Claiming 'currency depreciation improves the current account' without invoking Marshall-Lerner or J-curve.",
          "Assuming government intervention is always welfare-improving — ignoring government failure / unintended consequences.",
          "Confusing nominal vs real (GDP, interest rates, wages).",
          "Treating PED as elasticity in general — flag if used loosely without specifying which elasticity.",
        ],
      },
      caseStudy: {
        label: "Case Study Question",
        scale: { type: "marks", min: 0, max: 30 },
        criteria: [
          { key: "data_use", label: "Use of extract data", weight: 5, descriptor: "Direct quotes / figures / dates from the extracts. References extract numbers (Extract 1, Table 2, Fig 3) explicitly. Doesn't paraphrase vaguely when specifics are available." },
          { key: "knowledge", label: "Concept application", weight: 4, descriptor: "Picks the correct framework for each sub-question (PED for revenue questions, AD/AS for macro shocks, externalities for welfare questions)." },
          { key: "analysis", label: "Analysis — reasoning chain", weight: 4, descriptor: "Logical chain: data → economic mechanism → effect. No skipped steps." },
          { key: "diagrams", label: "Diagrams (where relevant)", weight: 3, descriptor: "Many CSQ sub-questions don't need a diagram — only mark this criterion if the sub-question implies one (e.g. 'with the aid of a diagram'). When present, check axes labelled, curves labelled, initial + new equilibrium marked, direction of shift matches the extract's scenario, and the diagram is referenced in prose. Deduct for unlabelled or missing equilibrium points." },
          { key: "evaluation", label: "Evaluation", weight: 4, descriptor: "Higher-order judgement: magnitudes (using data), limitations of policy, time horizon, alternative perspectives. Reaches reasoned stand." },
        ],
        misconceptions: [
          "Quoting extracts without applying economic theory — flag as 'description, not analysis'.",
          "Inventing data not in the extracts.",
          "Generic 'on the one hand / on the other hand' evaluation that doesn't pick a side.",
          "Confusing 'demand' vs 'quantity demanded' (and 'supply' vs 'quantity supplied').",
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
          { key: "knowledge", label: "Knowledge & Definitions (L1)", weight: 3, descriptor: "Sharp definitions of ALL key terms in the question. H2 expects more depth than H1 — e.g. 'monopolistic competition' should mention many firms, differentiated products, low barriers, P > MC in SR with zero supernormal profit in LR." },
          { key: "application", label: "Application & Context (L2)", weight: 4, descriptor: "Real, named, recent examples — Singapore + global. Industries, firms, policies named specifically (DBS, Grab vs Gojek, MAS forward guidance, US-China tariffs, etc.). Avoid generic 'a country' or 'a firm'." },
          { key: "analysis", label: "Analysis — reasoning chain (L3)", weight: 4, descriptor: "Detailed economic mechanism: cause → SR effect → LR adjustment → final state. Each link justified, no leaps. For policy questions: target → instrument → transmission mechanism → outcome." },
          { key: "diagrams", label: "Diagrams — accuracy & integration (L3)", weight: 4, descriptor: "H2 expects technically precise diagrams — typically 2–3 per essay. For every diagram, check ALL of:\n    (a) Both axes labelled with correct variables (Price, Quantity, Cost, Real National Income, General Price Level, Exchange Rate, etc.).\n    (b) All curves labelled (D, S, MC, MR, AC, ATC, AVC, AD, SRAS, LRAS, Yf, AE, etc.).\n    (c) Initial equilibrium marked with a point + dropped guide lines (P0, Q0 — or Y0, P0 for macro).\n    (d) Direction of shift correct (e.g. tax → S left/up; positive externality → MSB > MPB; depreciation → AD right via X-M).\n    (e) New equilibrium clearly marked (P1, Q1) and dropped guide lines.\n    (f) Shaded areas labelled where relevant (DWL, CS, PS, supernormal profit, subnormal loss, tax revenue, subsidy cost, output gap).\n    (g) For monopoly/oligopoly: MC = MR identified, then traced up to AC then to D for P. For perfect competition: P = MC = AC at LR equilibrium.\n    (h) Diagram referenced in prose ('as shown in Figure 1') — not just drawn and ignored.\n    Award full marks only when all relevant points are present; deduct proportionally for each missing or wrong item. If the photograph is unclear, say so rather than guess." },
          { key: "evaluation", label: "Evaluation (E marks)", weight: 5, descriptor: "H2 demands sustained evaluation — stand taken in intro, reinforced in body via 'depends-on' factors, and synthesised in conclusion. Consider: magnitudes (PED/YED/PES values), time horizon (SR vs LR adjustment), assumptions (ceteris paribus violations), government effectiveness, alternative policies, distributional impact, dynamic vs static efficiency." },
          { key: "structure", label: "Structure & Synthesis", weight: 2, descriptor: "Introduction defines terms, takes stand, signposts. Body paragraphs use TS–Evidence–Analysis–Evaluation. Conclusion synthesises (does not summarise) — picks a side and qualifies it." },
        ],
        misconceptions: [
          "Confusing 'demand' (the curve) with 'quantity demanded' (a point) — common in micro questions.",
          "Same confusion for 'supply' vs 'quantity supplied'.",
          "Stating 'MC = MR' as the definition of profit maximisation without explaining it locates the output level.",
          "For monopoly: drawing AC above ATC, or putting P at the MC=MR intersection instead of tracing up to the demand curve.",
          "Asserting 'monopoly is always inefficient' without distinguishing allocative vs productive vs dynamic efficiency.",
          "Claiming 'depreciation improves BOT/current account' without invoking Marshall-Lerner or acknowledging the J-curve.",
          "Treating Phillips curve relationship as eternal — missing the LR vertical Phillips curve.",
          "Assuming fiscal multiplier is always > 1, or ignoring crowding-out.",
          "Confusing nominal vs real (GDP, wages, interest rates, exchange rates).",
          "Treating 'PED' as elasticity in general — flag when used loosely (could be PES, YED, XED).",
          "Government intervention treated as automatically welfare-improving — missing government failure.",
          "AD/AS diagram with no Yf line, or Yf in the wrong place relative to equilibrium.",
        ],
      },
      caseStudy: {
        label: "Case Study Question",
        scale: { type: "marks", min: 0, max: 30 },
        criteria: [
          { key: "data_use", label: "Use of extract data", weight: 5, descriptor: "Direct quotes / figures / dates from the extracts. References extract numbers (Extract 1, Table 2, Fig 3). Doesn't paraphrase vaguely when specifics are available. Computes percentage changes from raw data when relevant." },
          { key: "knowledge", label: "Concept application", weight: 4, descriptor: "Correct framework per sub-question. H2 CSQ often spans micro + macro + international — pick the right tool each time." },
          { key: "analysis", label: "Analysis — reasoning chain", weight: 4, descriptor: "Logical chain: data → mechanism → effect. Show working. Quote the extract that triggers each step." },
          { key: "diagrams", label: "Diagrams (where required)", weight: 3, descriptor: "Only mark this criterion if the sub-question explicitly requires a diagram or strongly implies one. When present, apply the full H2 essay diagram checklist (axes, curves, equilibria, shift direction, shaded areas, prose reference). Deduct for unlabelled or missing equilibrium points." },
          { key: "evaluation", label: "Evaluation", weight: 4, descriptor: "Higher-order judgement: magnitudes from data, policy limitations, time horizon, alternative perspectives, government effectiveness in the specific context of the extracts. Reaches reasoned stand grounded in the data." },
        ],
        misconceptions: [
          "Quoting extracts without applying economic theory — description, not analysis.",
          "Inventing data not in the extracts.",
          "Generic evaluation that ignores the extract's specific context.",
          "Confusing 'demand' vs 'quantity demanded'.",
          "Drawing diagrams that contradict the extract's scenario (wrong shift direction).",
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
  if (task.misconceptions && task.misconceptions.length) {
    lines.push("");
    lines.push("COMMON MISCONCEPTIONS TO FLAG (deduct marks and call out explicitly):");
    task.misconceptions.forEach((m) => lines.push(`• ${m}`));
  }
  return lines.join("\n");
}

export function getDefaultRubricForHomework(subject, topic) {
  return rubricToText(subject, pickDefaultTask(subject, topic));
}
