import React, { useState, useEffect } from 'react';
import { T } from '../../theme/theme.js';
import { CaretDown, Sparkle } from '../../icons/icons.jsx';
import { CRITICAL_READING_STEPS, DISCOURSE_MARKERS } from '../../data/gpQuestionTypes.js';

function CriticalReadingInfographic() {
  const [active, setActive] = useState(null);
  const [dmAnim, setDmAnim] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDmAnim(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(120deg, #0F1B3D, #216ef4)", borderRadius: T.r3, padding: "22px 26px", color: "#fff" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#8BAEED", marginBottom: 6 }}>Foundation Skill · All Question Types</div>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 6 }}>Critical Reading Framework</div>
        <div style={{ fontSize: 13, color: "#C8D8F5", lineHeight: 1.6 }}>Critical reading means analysing underlying meaning, evaluating the author's intentions and assumptions, and forming a reasoned response — not simply retaining information. Apply these 6 steps to every passage.</div>
      </div>

      {/* 6-step flow */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.textSec, marginBottom: 12 }}>The 6-Step Critical Reading Routine — click any step to expand</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CRITICAL_READING_STEPS.map(step => (
            <div key={step.n} onClick={() => setActive(a => a === step.n ? null : step.n)}
              style={{ borderRadius: T.r2, border: `2px solid ${active === step.n ? step.color : T.border}`, background: active === step.n ? step.bg : T.bgCard, cursor: "pointer", overflow: "hidden", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: step.color, color: "#fff", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{step.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>Step {step.n} — {step.title}</div>
                  {active !== step.n && <div style={{ fontSize: 11, color: T.textSec, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{step.q}</div>}
                </div>
                <CaretDown size={14} color={step.color} style={{ transform: active === step.n ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
              </div>
              {active === step.n && (
                <div style={{ padding: "0 16px 16px 64px" }}>
                  <div style={{ background: "#fff", borderRadius: T.r1, padding: "12px 14px", fontSize: 13, color: T.text, lineHeight: 1.7, border: `1px solid ${step.color}33` }}>
                    <span style={{ fontWeight: 700, color: step.color }}>Key question: </span>{step.q}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Discourse markers */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.textSec, marginBottom: 12 }}>Common Discourse Markers — Quick Reference</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
          {DISCOURSE_MARKERS.map((dm, i) => (
            <div key={i} style={{ background: T.bgCard, borderRadius: T.r2, padding: "12px 14px", border: `1px solid ${T.border}`, borderLeft: `4px solid ${dm.color}`, opacity: dmAnim ? 1 : 0, transform: dmAnim ? "translateY(0)" : "translateY(12px)", transition: `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: dm.color, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 5 }}>{dm.fn}</div>
              <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{dm.examples}</div>
            </div>
          ))}
        </div>
      </div>

      {/* APT reminder */}
      <div style={{ background: T.accentLight, borderRadius: T.r2, padding: "14px 18px", border: `1px solid ${T.accentMid}`, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Sparkle size={18} weight="fill" color={T.accent} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: T.accentText, marginBottom: 4 }}>APT Paraphrasing — The Golden Rule</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[["Accuracy","Replace words with synonyms of the same connotation in context."],["Precision","Capture the intensity and nuance. Do not water down strong language."],["Thoroughness","Capture the complete idea: context, cause-effect, specific subject."]].map(([k,v]) => (
              <div key={k} style={{ minWidth: 160 }}>
                <span style={{ fontWeight: 700, color: T.accent }}>{k}: </span>
                <span style={{ fontSize: 12, color: T.accentText }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━ GP PAPER 1 DATA ━━━ */
const GP1_QTYPES = [
  {
    id: "q01", code: "01", color: "#216ef4", bg: "#E4EFFE",
    title: "Direct Assertion",
    emoji: "🎯",
    structure: "REFUTATION",
    structureColor: "#216ef4",
    framework: "TAS",
    frameworkFull: "Thesis–Antithesis–Synthesis",
    counter: "Rebuttal",
    counterColor: "#FB424E",
    stand: "Absolute or strong qualified",
    triggers: ["Do you agree?", "Discuss.", "Is this true?", "Does X do more harm than good?", "Is X the most important…?"],
    what: "States a position directly. No qualifier like 'how far' appears. You must take a clear stance and evaluate whether the assertion is valid.",
    paraStructure: [
      { label: "Intro", role: "Context + Thesis", what: "Define key terms. State your position on the assertion directly. Preview your line of argument." },
      { label: "Body 1", role: "Strongest SV", what: "Your strongest supporting argument using PEEL. One specific, developed example." },
      { label: "Body 2", role: "Second SV", what: "A second argument from a different domain or region." },
      { label: "Body 3", role: "OVR (Rebuttal)", what: "Concede the most compelling counter-argument, then rebut using PEPEEL (Pivot + Explain + Example)." },
      { label: "Body 4 (opt)", role: "CE Paragraph", what: "Critical Evaluation examining root causes — separates B from A essays." },
      { label: "Conclusion", role: "Reaffirm + Synthesise", what: "Restate your position. Do NOT summarise. Offer a forward-looking or qualifying remark." },
    ],
    mistakes: [
      "Sitting on the fence: saying 'both sides have merit' without committing.",
      "Ignoring exact wording: if it says 'most important', address degree and rank.",
      "Using examples without analysis — listing events without explaining why they support your thesis.",
    ],
    reward: "A clear, defensible thesis sustained throughout. Evaluating rather than describing pushes scripts into upper bands.",
    thesis: "\"While technological advancement has undeniably improved material living standards, it has not resolved — and in several respects has deepened — the social inequalities that undermine human well-being. The assertion therefore holds true only in a narrow, economic sense.\"",
    warning: "For the 'Discuss' variant, a slightly qualified stand is safer than a blunt absolute. If you qualify, use CONCESSION not rebuttal for OV paragraphs.",
  },
  {
    id: "q02", code: "02", color: "#6660B9", bg: "#EEEAFF",
    title: "Extent / 'How Far'",
    emoji: "📏",
    structure: "LIMITATION",
    structureColor: "#6660B9",
    framework: "CAF",
    frameworkFull: "Calibrated Agreement Framework",
    counter: "Concession ONLY",
    counterColor: "#17a2b8",
    stand: "Qualified — state a degree",
    triggers: ["How far do you agree that…?", "To what extent is X responsible…?", "In what ways, and to what extent…?", "How valid is the view that…"],
    what: "Asks you to measure the degree to which a claim is true. You must acknowledge some validity while identifying conditions under which it does not fully hold.",
    paraStructure: [
      { label: "Intro", role: "Qualified Thesis", what: "State the extent of your agreement: e.g. 'largely', 'only in limited circumstances'. Degree qualifier belongs ONLY here." },
      { label: "Body 1", role: "SV: Claim Valid", what: "Strongest argument for why the claim IS true. PEEL with specific evidence." },
      { label: "Body 2", role: "SV: Claim Valid", what: "Second argument supporting the claim's validity from a different domain." },
      { label: "Body 3", role: "Limitation (Concession)", what: "Show where the claim BREAKS DOWN. Acknowledge → Present evidence → Qualify → Return to thesis." },
      { label: "Body 4 (opt)", role: "Second Limitation", what: "A second context where the claim fails (e.g. regional variation, specific demographic)." },
      { label: "Conclusion", role: "Measured Verdict", what: "Specify the extent of your agreement. Explain WHY the extent falls where you claimed. Add evaluative synthesis." },
    ],
    mistakes: [
      "Treating the question as binary — writing full agree/disagree when it asks for degree.",
      "Failing to define scope of extent: 'to a large extent' must be justified.",
      "Losing thread of calibration: body paragraphs that forget the 'how far' framing.",
    ],
    reward: "Quality of qualification — not number of examples — distinguishes upper-band scripts for extent questions.",
    thesis: "\"Globalisation has, to a considerable extent, eroded national sovereignty in economic affairs; however, states retain meaningful authority in social and cultural policy, such that the claim holds only partially.\"",
    warning: "CRITICAL: Do NOT rebut your limitation paragraphs. Your qualified thesis already endorses both sides. Rebutting Part B contradicts your own stand.",
  },
  {
    id: "q03", code: "03", color: "#17a2b8", bg: "#E0F6F9",
    title: "Comparison",
    emoji: "⚖️",
    structure: "LIMITATION + COMPARATIVE",
    structureColor: "#17a2b8",
    framework: "CCF",
    frameworkFull: "Comparative Criterion Framework",
    counter: "Concession",
    counterColor: "#6660B9",
    stand: "Qualified comparative",
    triggers: ["Compare the roles of X and Y in…", "Is X more effective than Y?", "X poses a greater threat than Y.", "more than", "rather than", "as opposed to", "greater than"],
    what: "Asks you to compare two or more things and evaluate which is superior. You must maintain a comparative lens in EVERY paragraph. The link between elements is the essay's focus.",
    paraStructure: [
      { label: "Intro", role: "Define + State Verdict", what: "Define both subjects and the criteria. State your overall comparative verdict." },
      { label: "Body 1", role: "Criterion 1: Both", what: "Apply the first criterion to BOTH subjects. Show where one outperforms the other and WHY." },
      { label: "Body 2", role: "Criterion 2: Both", what: "Apply the second criterion. Acceptable to concede that the weaker subject performs better here." },
      { label: "Body 3", role: "Criterion 3 / Context", what: "Third criterion or show how the comparison shifts in a specific context (e.g. developed vs developing)." },
      { label: "Conclusion", role: "Comparative Verdict", what: "Reaffirm which subject is superior overall, with reference to the criteria used. Acknowledge any important caveat." },
    ],
    mistakes: [
      "Writing two separate essays (all of X, then all of Y) — the forbidden Block Method.",
      "Ignoring the basis of comparison: a comparison is meaningless without shared criteria.",
      "Failing to reach a verdict: you must conclude which is greater or more valid.",
    ],
    reward: "Point-by-Point method across shared criteria demonstrates analytical comparison. The Block Method fails because it describes each subject, not the relationship between them.",
    thesis: "\"While both education and legislation are important tools for addressing environmental degradation, education produces more durable behavioural change and therefore represents the more effective long-term strategy.\"",
    warning: "Both subjects must appear in EVERY body paragraph using the Point-by-Point method. Block method (all of X, then all of Y) is a structural error that tutors warn against.",
  },
  {
    id: "q04", code: "04", color: "#E07800", bg: "#FFF0D9",
    title: "Cause / Solution",
    emoji: "🔍",
    structure: "THEMATIC-CATEGORICAL",
    structureColor: "#E07800",
    framework: "FAF",
    frameworkFull: "Factor Analysis Framework",
    counter: "Limited — evaluate feasibility",
    counterColor: "#E07800",
    stand: "Prioritisation-based",
    triggers: ["What are the main causes of X?", "Why has X become such a serious problem?", "How can X be effectively addressed?", "causes", "reasons", "why", "how can", "solutions", "address", "responsible for"],
    what: "Explains why something occurred (causes) or how to address a problem (solutions). Expository-evaluative rather than adversarial. The thesis must PRIORITISE — identify the most fundamental cause or effective solution.",
    paraStructure: [
      { label: "Intro", role: "Define + Preview", what: "Define the phenomenon. State the factors you will discuss. Indicate the most significant one. Introduction is DIAGNOSTIC, not argumentative." },
      { label: "Body 1", role: "Primary Factor", what: "Most significant cause or effective solution. Explain the MECHANISM (how it causes/solves) with evidence." },
      { label: "Body 2", role: "Secondary Factor", what: "Second, distinct factor. Compare its significance to the first where possible." },
      { label: "Body 3", role: "Third Factor / Link", what: "Third factor, or — if both causes and solutions required — connect a solution to a stated cause." },
      { label: "Conclusion", role: "Prioritise + Conclude", what: "State which cause is most fundamental or which solution is most viable. Offer an evaluative remark on the overall picture." },
    ],
    mistakes: [
      "Listing causes without explaining mechanisms: 'poverty causes crime' earns no marks — explain HOW and WHY.",
      "Proposing solutions that do not address the stated causes.",
      "Treating all factors as equally significant — the conclusion must prioritise and evaluate.",
    ],
    reward: "Explaining the mechanism (why X causes Y) scores higher than description. For solutions, feasibility and evidence of success outperform idealistic proposals.",
    thesis: "\"The rise in youth mental health disorders is driven principally by three interconnected factors: the restructuring of social interaction by digital technology, the intensification of academic pressure, and the erosion of community support networks — each of which requires a targeted policy response.\"",
    warning: "For hybrid questions that embed a cause/solution within a proposition (e.g. 'Technology is the solution to climate change.' Discuss), revert to the Refutation or Limitation structure instead.",
  },
  {
    id: "q05", code: "05", color: "#C08A00", bg: "#FFF8D6",
    title: "Open Discussion",
    emoji: "💬",
    structure: "EITHER (depends on stand)",
    structureColor: "#C08A00",
    framework: "EEP",
    frameworkFull: "Explore–Evaluate–Position",
    counter: "Depends on stand type",
    counterColor: "#C08A00",
    stand: "Either; qualified preferred for 'Discuss'",
    triggers: ["Discuss the view that X.", "Consider the role of X in Y. Discuss.", "What is your view?", "discuss", "consider", "explore"],
    what: "Presents a topic without a strong directional push and asks you to 'discuss'. Expects balanced exploration before arriving at a position. Widest structural freedom — but a fence-sitting essay scores poorly.",
    paraStructure: [
      { label: "Intro", role: "Context + Stance", what: "Establish the issue's significance and main perspectives. State your reasoned position briefly." },
      { label: "Body 1", role: "First Perspective", what: "Explore the strongest case for one view. Analyse why it holds merit using PEEL." },
      { label: "Body 2", role: "Second Perspective", what: "Introduce a contrasting or complicating perspective. Show why the issue is more complex." },
      { label: "Body 3", role: "Your Evaluation", what: "Assess which perspective is more persuasive, or under what conditions each applies. This is your analytical judgment." },
      { label: "Body 4 (opt)", role: "CE Paragraph", what: "Critical Evaluation examining root causes or underlying assumptions — elevates from B to A." },
      { label: "Conclusion", role: "Personal Position", what: "State your view clearly. Synthesise what the body established. Do NOT introduce new arguments." },
    ],
    mistakes: [
      "Writing a 'balanced' essay that refuses to take a position — still requires a personal stance.",
      "Structuring as 'advantages and disadvantages' without evaluative commentary — descriptive, not discursive.",
      "Allowing the essay to drift without a unifying argument.",
    ],
    reward: "A student who wrestles with complexity and arrives at a nuanced, well-justified position scores higher than one who merely lists points.",
    thesis: "\"Although freedom of expression is a foundational democratic value, it is neither absolute nor unconditional; societies are justified in imposing measured restrictions where expression demonstrably incites harm to identifiable groups.\"",
    warning: "Your stand type determines your counter-approach. Absolute stand → Refutation with rebuttals. Qualified stand → Limitation with concessions. Qualified stands are generally safer and score better.",
  },
  {
    id: "q06", code: "06", color: "#006840", bg: "#E2FBF0",
    title: "Evaluative Judgement",
    emoji: "📊",
    structure: "LIMITATION + CRITERIA",
    structureColor: "#006840",
    framework: "CEV",
    frameworkFull: "Criteria–Evidence–Verdict",
    counter: "Concession",
    counterColor: "#17a2b8",
    stand: "Qualified / calibrated",
    triggers: ["How successful has X been in achieving Y?", "How effective are international efforts to…?", "Assess the impact of X on Y.", "how successful", "how effective", "assess the impact", "evaluate", "how significant"],
    what: "Asks you to evaluate the degree of success, effectiveness, or impact. Requires criteria-based assessment — without criteria, your evaluation has no basis. Absolute judgments are almost always untenable.",
    paraStructure: [
      { label: "Intro", role: "Define Criteria + Verdict", what: "Define what success/effectiveness means for this topic. State your overall calibrated assessment." },
      { label: "Body 1", role: "Area of Success", what: "Identify and analyse one area where the subject HAS met the stated criteria. Use specific evidence." },
      { label: "Body 2", role: "Second Area or Limitation", what: "Either a second area of success, or a significant limitation where criteria are NOT met." },
      { label: "Body 3", role: "Contextual Qualification", what: "Assess whether success is consistent across contexts (e.g. rich vs poor nations, short-term vs long-term)." },
      { label: "Conclusion", role: "Overall Verdict", what: "State how successful/effective the subject has been overall, relative to the criteria established in the introduction." },
    ],
    mistakes: [
      "Failing to define criteria: without criteria, an evaluation degenerates into description.",
      "Treating the question as purely descriptive: recounting what was done ≠ evaluating whether it worked.",
      "Ignoring context: effectiveness often varies by geography, time, or demographic.",
    ],
    reward: "Setting clear benchmarks and measuring evidence against them signals sophisticated analytical thinking. For evaluative questions, criteria are everything.",
    thesis: "\"Judged by the criteria of reach, long-term behaviour change, and equitable access, global vaccination campaigns have been partially effective: they have achieved remarkable results in wealthy nations but have fallen significantly short in low-income countries, where structural barriers persist.\"",
    warning: "Because your stand is calibrated ('partially effective'), your essay naturally has paragraphs for success AND failure. Use CONCESSION for the weaker side, not rebuttal — you are mapping boundaries, not defeating opponents.",
  },
];

const GP1_FRAMEWORKS = [
  { id: "peel", label: "PEEL", color: "#216ef4", bg: "#E4EFFE", when: "All supporting view (SV) paragraphs", steps: [
    { abbr: "P", name: "Point", desc: "State your argument clearly using question keywords." },
    { abbr: "E", name: "Explanation", desc: "Unpack the reasoning — this is the BULK of the paragraph. Analytical depth lives here." },
    { abbr: "E", name: "Example", desc: "A specific, developed piece of evidence that supports your explanation." },
    { abbr: "L", name: "Link", desc: "Connect back to your thesis and the question." },
  ]},
  { id: "pepeel", label: "PEPEEL", color: "#FB424E", bg: "#FFEBEC", when: "Opposing view with rebuttal (OVR) in Refutation essays", steps: [
    { abbr: "P", name: "Point", desc: "State the opposing view using question keywords." },
    { abbr: "E", name: "Explain", desc: "Unpack the opposing view's reasoning fairly." },
    { abbr: "P", name: "Pivot", desc: "\"This seemingly compelling argument breaks down when…\" — ESSENTIAL, without it the paragraph reads as two disconnected halves." },
    { abbr: "E", name: "Explain", desc: "Develop the rebuttal reasoning." },
    { abbr: "E", name: "Example", desc: "Evidence supporting the rebuttal." },
    { abbr: "L", name: "Link", desc: "Return to your original stand." },
  ]},
  { id: "peele", label: "PEELE", color: "#6660B9", bg: "#EEEAFF", when: "Any paragraph needing explicit evaluation", steps: [
    { abbr: "P", name: "Point", desc: "State your argument." },
    { abbr: "E", name: "Explanation", desc: "Unpack the reasoning." },
    { abbr: "E", name: "Example", desc: "Specific evidence." },
    { abbr: "L", name: "Link", desc: "Connect back to thesis." },
    { abbr: "E", name: "Evaluation", desc: "Consider challenges to your own argument, consequences, and who is affected." },
  ]},
];

const GP1_TOOLS = [
  { id: "spectram", label: "SPECTRAM", source: "TMJC", color: "#216ef4", when: "Planning stage — brainstorming diverse perspectives", letters: [
    { l: "S", full: "Social / Science / Sports" },
    { l: "P", full: "Political / Prejudice / Poverty" },
    { l: "E", full: "Economic / Environmental / Ethics / Education" },
    { l: "C", full: "Cultural / Crime / Communications" },
    { l: "T", full: "Technological / Terrorism" },
    { l: "R", full: "Religious / Race / Rights" },
    { l: "A", full: "Arts / Aesthetics" },
    { l: "M", full: "Media / Military / Medicine" },
  ], note: "Scan all eight domains, then select the 3–4 strongest for your essay. Ensures breadth — a criterion in the Band 5 descriptor." },
  { id: "tipps", label: "TIPPS", source: "TMJC", color: "#E07800", when: "Within paragraphs — adding evaluative depth after evidence", letters: [
    { l: "T", full: "Time (long-run vs short-run)" },
    { l: "I", full: "Impact (scale, frequency)" },
    { l: "P", full: "Perception (ideal vs reality)" },
    { l: "P", full: "People (minority vs majority)" },
    { l: "S", full: "Status Quo (change over time)" },
  ], note: "Apply 1–2 TIPPS lenses after presenting a point and evidence to add evaluative depth." },
  { id: "clams", label: "CLAMS", source: "TMJC", color: "#17a2b8", when: "Within paragraphs — qualifying arguments to avoid absolute claims", letters: [
    { l: "C", full: "Context" },
    { l: "L", full: "Long-run / Short-run" },
    { l: "A", full: "Alternatives" },
    { l: "M", full: "Magnitude" },
    { l: "S", full: "Scope / Stakeholders" },
  ], note: "Use CLAMS criteria to add nuance and earn marks for 'developed analysis and evaluation' (Band 5 descriptor)." },
  { id: "iong", label: "IONG", source: "TMJC", color: "#6660B9", when: "Planning stage — ensuring multi-level stakeholder analysis", letters: [
    { l: "I", full: "Individual / Domestic" },
    { l: "O", full: "Organisation / Group" },
    { l: "N", full: "National" },
    { l: "G", full: "Global / International" },
  ], note: "Ensure your arguments consider effects at multiple levels. Using examples from at least 2–3 levels signals analytical breadth." },
];


export default CriticalReadingInfographic;
