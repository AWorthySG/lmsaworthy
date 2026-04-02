// GP Question Types data
export const GP2_QTYPES = [
  {
    id: "q1", code: "Q1", section: "A", sectionLabel: "Literal", badge: "Most common",
    title: "Direct Paraphrasing", subtitle: "Locate → Restate in your own words",
    color: "#216ef4", bg: "#E4EFFE", emoji: "📝",
    commandWords: ["WHY = reasons/causes", "HOW = methods/processes", "WHAT = definitions"],
    steps: [
      { n: 1, title: "Identify the command word", body: "WHY → trace causal signposts (because, as, since, due to). HOW → trace sequential connectors (first, then, through). WHAT → find the elaboration or definition near the term." },
      { n: 2, title: "Locate the answer", body: "Find the keyword(s) from the question in the passage. Read the sentences BEFORE and AFTER — the answer is almost always there." },
      { n: 3, title: "Apply APT Paraphrasing", body: "Accuracy: replace with synonyms of the same connotation. Precision: capture intensity — 'grief' → 'anguish', not 'sadness'. Thoroughness: retain cause-effect, compare-contrast, and specific subject." },
      { n: 4, title: "Write and check", body: "One complete sentence per point. Do not start by lifting the original phrase. Ensure grammatical fluency. Verify the answer addresses the command word." },
    ],
    templates: [
      { label: "WHY (1 reason)", t: "The author explains this is because [paraphrased cause], which results in [paraphrased effect]." },
      { label: "HOW (process)",  t: "The author describes how [subject] first [step 1], then [step 2], in order to [purpose]." },
      { label: "WHAT (definition)", t: "[Concept] refers to [paraphrased explanation in context], suggesting that [implication]." },
    ],
    eg: {
      passage: '"…because if everyone travels within the bounds of given rules, no horizons will ever be expanded."',
      weak: '"We should only break rules to better society." — Too vague. Loses the cause-effect and the idea of expanding knowledge.',
      strong: '"The author sees the advantage as helping to widen people\'s knowledge and perspectives of the world around them, thereby facilitating the progress of society."',
      why: '"horizons expanded" → "widen people\'s knowledge and perspectives" captures literal + contextual meaning. The cause-effect chain is preserved.',
    },
  },
  {
    id: "q2", code: "Q2", section: "A", sectionLabel: "Literal", badge: "Similarities / Differences",
    title: "Comparison Questions", subtitle: "Aligned or opposing ideas between two subjects",
    color: "#216ef4", bg: "#E4EFFE", emoji: "⚖️",
    commandWords: ["Similarities: aligned ideas", "Differences: same criterion, contrasting outcomes"],
    steps: [
      { n: 1, title: "Identify the two subjects", body: "Clearly name Subject A and Subject B from the question. The question will specify what to compare — attitude, approach, outcome, etc." },
      { n: 2, title: "Locate aligned or contrasting ideas", body: "For similarities: find ideas that both subjects share. For differences: find the SAME criterion with opposing outcomes. Each paired answer = 1 mark." },
      { n: 3, title: "Structure your answer clearly", body: "Signal your answer explicitly. Never leave the contrast implied. Each pair must show a clear contrast based on the same criterion." },
    ],
    templates: [
      { label: "Similarity", t: "Both [Subject A] and [Subject B] [shared paraphrased idea]." },
      { label: "Difference (1 mark)", t: "While [Subject A] [paraphrased idea A], [Subject B] [paraphrased contrasting idea B]." },
    ],
    eg: {
      passage: 'Criterion: VALUE OF BEAUTY — comparing the author\'s view vs. the public\'s view.',
      weak: '"Subject A thinks beauty is bad. Subject B thinks beauty is good." — Criterion not stated, no paraphrasing.',
      strong: '"While the author views beauty as a burden that causes suffering, the public regards beauty as a blessing that brings admiration and social advantage."',
      why: 'Same criterion (value of beauty) with a clear contrast visible in both halves. Both ideas are paraphrased, not lifted.',
    },
  },
  {
    id: "q3", code: "Q3", section: "B1", sectionLabel: "Inferential", badge: "Intensifiers & Qualifiers",
    title: "Use of Vocabulary", subtitle: "Function of a specific word in context",
    color: "#6660B9", bg: "#EEEAFF", emoji: "🔍",
    commandWords: ['"What is the effect of…"', '"Why does the author use the word…"'],
    steps: [
      { n: 1, title: "Identify the word's type", body: "Intensifier: emphasises degree/extent (significantly, even, greatly). Qualifier: limits a claim (almost, largely, merely). 'Even': emphasises surprising extreme extent. 'Only': sole viable option. 'Mere': insignificance or underestimation." },
      { n: 2, title: "State the FUNCTION", body: "What role does this word play? 'The author uses [word] to emphasise the [extremity / surprising nature / extent / insignificance] of [the issue]…'" },
      { n: 3, title: "Provide the CONTEXT", body: "What specifically is being emphasised? 'such that / so much so that / to the point that [paraphrased contextual explanation].' Answers without context will NOT score." },
    ],
    templates: [
      { label: "Full template", t: "The author uses [word/phrase] to emphasise [the extremity / surprising nature / extent / insignificance] of [the issue], such that [paraphrased contextual explanation — what is surprising or qualified]." },
    ],
    eg: {
      passage: '"Anxiety is on the rise in all age groups, such that even toddlers are not immune." (line 7)',
      weak: '"The word \'even\' is used to emphasise the author\'s point." — No context. Will not score.',
      strong: '"The author uses the word \'even\' to emphasise the surprising extremity of the problem, such that very young children — who we would not normally expect to experience anxiety — are also not spared from its effects."',
      why: 'Function: "emphasise the surprising extremity". Context: explains WHO is affected and WHY this is surprising. Both components present.',
    },
  },
  {
    id: "q4a", code: "Q4A", section: "B2", sectionLabel: "Inferential", badge: "Typographical devices",
    title: "Punctuation & Devices", subtitle: "Effect of inverted commas, brackets, repetition, dashes…",
    color: "#6660B9", bg: "#EEEAFF", emoji: "🖋️",
    commandWords: ['"Explain the effect of…"', '"Why does the author use…"'],
    steps: [
      { n: 1, title: "Name the device", body: "Inverted commas / Quotation marks · Brackets / Parentheses · Repetition · Ellipsis (…) · Italics · Rhetorical questions · Dashes (—)." },
      { n: 2, title: "State the FUNCTION", body: "Inverted commas: question/challenge whether the word truly applies (often ironic). Repetition: emphasise the idea carried by the repeated word. Ellipsis: dramatic emphasis or endless continuation. Dashes: dramatic pause before a key idea." },
      { n: 3, title: "Provide REASON/CONTEXT", body: "Why is this device used here? What does it convey in this specific passage? Naming the device alone does NOT earn marks." },
    ],
    templates: [
      { label: "Inverted commas", t: "[Author] uses inverted commas around [word] to question/challenge whether [word] truly applies here, because [contextual reason — why the term is being disputed or used ironically]." },
      { label: "Repetition", t: "[Author] repeats [word/phrase] to emphasise [contextual idea conveyed by the repeated word]." },
      { label: "Rhetorical Qs", t: "The author poses a series of rhetorical questions to provoke thought in the reader about [specific issue], and to progressively build the argument that [paraphrased claim]." },
    ],
    eg: {
      passage: '"Rule-breaking may have another \'positive\' association — it may be perceived as a form of solidarity."',
      weak: '"The inverted commas show that this is not really positive." — Insufficient. No context.',
      strong: '"The author places \'positive\' in inverted commas to challenge whether rule-breaking can genuinely be regarded as beneficial, since the word is used ironically to suggest that the so-called \'positive\' associations are dubious or contested."',
      why: 'Function (challenge/question) + contextual explanation of why the irony is significant = full marks.',
    },
  },
  {
    id: "q4c", code: "Q4C", section: "B2", sectionLabel: "Inferential", badge: "Figurative language",
    title: "Metaphor, Analogy, Paradox, Irony", subtitle: "Literal image → contextual meaning",
    color: "#6660B9", bg: "#EEEAFF", emoji: "🎭",
    commandWords: ['"Explain the metaphor in…"', '"What does the author mean by…"', '"What is paradoxical about…"'],
    steps: [
      { n: 1, title: "Identify the device type", body: "Metaphor/Analogy: comparison attributing qualities without 'like/as'. Paradox: self-contradictory statement that reveals a truth. Irony: contrast between expectation and reality." },
      { n: 2, title: "State the LITERAL meaning", body: "What does the image/object literally refer to? For metaphors: 'X literally refers to [literal quality]…'" },
      { n: 3, title: "Map to CONTEXTUAL meaning", body: "Use 'Just as [literal meaning], so too does [subject] [contextual quality].' For paradox: 'While one would expect [expected], it is paradoxical that [actual], because [reason].' For irony: 'One would expect [X], yet in reality [Y], which is ironic because [reason].'" },
    ],
    templates: [
      { label: "Metaphor / Analogy", t: "'[Object]' literally refers to [literal quality]. Just as [literal meaning], so too does [subject] [contextual quality], suggesting [implication]." },
      { label: "Paradox", t: "While one would expect [expected outcome], it is paradoxical that [actual contradictory reality], because [reason for the contradiction]." },
      { label: "Irony", t: "One would expect [X], yet in reality [contrasting Y occurs], which is ironic because [reason the gap is significant]." },
    ],
    eg: {
      passage: '"Nothing matches the tentacles of the internet for its insidious spread and reach."',
      weak: '"The author compares the internet to a creature with tentacles to show it is dangerous." — Too vague. No literal meaning, no contextual quality.',
      strong: '"\'Tentacles\' literally refers to the long, flexible limbs of creatures like octopuses that extend in multiple directions to grip and entrap their prey. Just as tentacles spread imperceptibly and ensnare without warning, so too does the internet penetrate every corner of life in a hidden and harmful way, making it impossible to escape once your personal data has been released into it."',
      why: 'Literal meaning → contextual quality. The "just as... so too" connector links both halves explicitly.',
    },
  },
  {
    id: "q4d", code: "Q4D", section: "B2", sectionLabel: "Inferential", badge: "Contextual meaning",
    title: "Explain the Meaning Of…", subtitle: "Full contextual paraphrase (3-part answer)",
    color: "#6660B9", bg: "#EEEAFF", emoji: "💬",
    commandWords: ['"Explain the meaning of…"', '"What does the phrase… mean?"', '"In your own words, explain…"'],
    steps: [
      { n: 1, title: "Paraphrase (Part 1)", body: "Replace the word or phrase with a precise synonym. Apply APT principles. Shows the examiner you understand the core meaning without relying on the original wording." },
      { n: 2, title: "Contextualise (Part 2)", body: "Explain what the word/phrase specifically means given the subject matter. State who it refers to and what situation it describes. Prevents vague answers that could apply to any passage." },
      { n: 3, title: "Implication (Part 3)", body: "State what the expression implies or suggests — the attitude, tone, or judgement conveyed. Required for full marks on higher-value questions." },
    ],
    templates: [
      { label: "Literal/concrete", t: "[Word/phrase] means [precise paraphrase]. In this context, it refers to [contextual explanation of who/what/situation], suggesting that [implication or attitude conveyed]." },
      { label: "Figurative", t: "The expression [quote] literally refers to [literal image]. Here, it conveys that [contextual meaning], suggesting [implication or attitude]." },
    ],
    eg: {
      passage: '"social media has become an echo chamber"',
      weak: '"An echo chamber is a place where sounds repeat. Social media is like this." — Only literal meaning. No contextual unpacking.',
      strong: '"An \'echo chamber\' literally refers to a space that reflects the same sound repeatedly. Here, it suggests that social media platforms amplify only the views users already hold, insulating them from opposing perspectives and reinforcing existing biases, implying that users become increasingly closed-minded over time."',
      why: 'Part 1: paraphrase. Part 2: specific contextual meaning (social media/views/biases). Part 3: implication for users. All three parts present.',
    },
  },
  {
    id: "q5", code: "Q5", section: "B3", sectionLabel: "Structural", badge: "Intro & Conclusion",
    title: "Stylistic Devices in Structure", subtitle: "Opening/closing devices and their purpose",
    color: "#17a2b8", bg: "#E0F6F9", emoji: "🏛️",
    commandWords: ['"What is the purpose of the opening…"', '"How does the conclusion…"'],
    steps: [
      { n: 1, title: "Identify the device", body: "Anecdote · Analogy · Quote · Rhetorical question · Return to the opening device (circularity) · Call to action · Lingering question." },
      { n: 2, title: "State the FUNCTION", body: "Introduction: establish relevance, engage the reader, contextualise the issue, set up the argument. Conclusion: summarise, reiterate, strengthen, create urgency/circularity." },
      { n: 3, title: "Link to the MAIN CLAIM", body: "Always connect the device to the author's central argument. 'by showing that [paraphrased contextual point linked to the author's main claim]'." },
    ],
    templates: [
      { label: "Introduction device", t: "The author opens with [device] in order to [function: establish relevance / engage the reader / contextualise the issue], by showing that [paraphrased point linked to main claim]." },
      { label: "Conclusion device", t: "The author concludes by [device/action], in order to [function: summarise / reiterate / call to action / create circularity], reinforcing the argument that [paraphrased main claim]." },
      { label: "2-mark answer", t: "Firstly, the final sentence reiterates the argument that [point 1]. Additionally, it creates a sense of urgency by [point 2]." },
    ],
    eg: {
      passage: 'Question: "What is the purpose of the opening paragraph?" (anecdote about a child using a smartphone)',
      weak: '"The author uses an anecdote to make the passage more interesting." — No function, no link to claim.',
      strong: '"The author opens with an anecdote about a young child using a smartphone to establish the pervasiveness of digital technology, engaging the reader with a relatable scene and contextualising the argument that even the youngest members of society are not immune to the effects of excessive screen time."',
      why: 'Device named (anecdote). Function stated (establish pervasiveness, engage reader). Point linked to main claim (screen time effects on children).',
    },
  },
  {
    id: "q6", code: "Q6", section: "B3", sectionLabel: "Structural", badge: "Attitude · Language · Pronouns",
    title: "Author's Voice", subtitle: "Attitude, use of language, and personal pronouns",
    color: "#17a2b8", bg: "#E0F6F9", emoji: "🎤",
    commandWords: ['"What is the author\'s attitude towards…"', '"Identify the language feature…"', '"Explain the use of \'we\'…"'],
    steps: [
      { n: 1, title: "6A — Author's Attitude", body: "Use precise vocabulary: critical, sceptical, dismissive, cynical, cautious, measured, disapproving, optimistic, hopeful, ambivalent. Avoid vague labels like 'negative'. Structure: 'The word [word] suggests the author is [precise attitude] of [subject], because [contextual explanation].'" },
      { n: 2, title: "6B — Use of Language", body: "Identify the feature: hyperbole, analogy, metaphor, oxymoron, irony, emotionally charged language, loaded diction. For metaphors/analogies — apply Q4C method (literal → contextual). For hyperbole/loaded diction — explain connotation and effect." },
      { n: 3, title: "6C — Personal Pronouns", body: "'You': directly address reader, make them feel implicated. 'We'/'Us': include reader in shared group, build solidarity. 'They'/'Them': distance the author, create us-vs-them. Always explain what the pronoun communicates about that group's situation." },
    ],
    templates: [
      { label: "6A Attitude", t: "The word [word] suggests that the author is [precise attitude word] of [subject], because [contextual explanation of what is implied about the subject]." },
      { label: "6B Language feature", t: "The author uses [language feature] in the phrase [quote] to [function: criticise / reinforce / challenge], suggesting that [paraphrased contextual point — including connotation]." },
      { label: "6C Pronoun 'We'", t: "The author uses 'we' to include the reader as part of a shared group, suggesting collective [responsibility / experience / complicity] in [paraphrased contextual point]." },
    ],
    eg: {
      passage: '"We willingly share our personal views and data online without considering the consequences."',
      weak: '"The author uses \'we\' to include everyone." — No function, no contextual explanation.',
      strong: '"The author uses \'we\' to implicate both himself and the reader as willing participants in the erosion of online privacy, building a sense of collective responsibility and suggesting that the problem is not external but self-inflicted."',
      why: 'Pronoun function (implicate/include reader). Contextual point (collective responsibility, self-inflicted). Both elements present.',
    },
  },
];

export const CRITICAL_READING_STEPS = [
  { n: 1, title: "Author's Purpose", q: "Why did the author write this? What effect does the author intend to create?", color: "#216ef4", bg: "#E4EFFE" },
  { n: 2, title: "Claim, POV, Context & Reasons", q: "What is the claim? From what context (cultural, societal)? What reasons/evidence are given?", color: "#6660B9", bg: "#EEEAFF" },
  { n: 3, title: "Assumptions", q: "What assumptions did the author make? Are they valid, fair, and free from bias?", color: "#17a2b8", bg: "#E0F6F9" },
  { n: 4, title: "Readers' Conclusions", q: "What conclusions should the reader draw? Are they justified, balanced, logical, and significant?", color: "#E07800", bg: "#FFF0D9" },
  { n: 5, title: "Implications & Consequences", q: "What are the implications of accepting or rejecting the argument? Are they significant?", color: "#FB424E", bg: "#FFEBEC" },
  { n: 6, title: "Rethink and Question", q: "Would these conclusions change given the possible implications and consequences of accepting the claim?", color: "#6C7A99", bg: "#EEF2FB" },
];

export const DISCOURSE_MARKERS = [
  { fn: "Emphasis",        examples: "Indeed, In fact, Importantly, Furthermore, Moreover", color: "#216ef4" },
  { fn: "Contrast / Shift", examples: "However, Rather, In contrast, Conversely, On the other hand", color: "#FB424E" },
  { fn: "Similarity",      examples: "Similarly, Likewise, Also, Again", color: "#17a2b8" },
  { fn: "Clarification",   examples: "In particular, More specifically, With respect to", color: "#6660B9" },
  { fn: "Nuance",          examples: "Although, Even though, Notwithstanding, Yet, Nevertheless", color: "#E07800" },
  { fn: "Cause-Effect",    examples: "Therefore, Hence, Consequently, As a result, Accordingly", color: "#006840" },
  { fn: "Illustration",    examples: "For instance, For example, Namely, Such as", color: "#FF8C3A" },
  { fn: "Summary",         examples: "In conclusion, To summarise, Overall, Finally", color: "#8A96B0" },
];

function QTypeDetail({ qt, showStrong, setShowStrong }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 16px 20px", borderTop: `2px solid ${qt.color}22`, animation: "fadeSlideIn 0.2s ease" }}>
      {/* Command words */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Trigger Phrases</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {qt.commandWords.map((w, i) => (
            <span key={i} style={{ background: qt.bg, color: qt.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: `1px solid ${qt.color}33` }}>{w}</span>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>The Approach</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {qt.steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: qt.color, color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{s.n}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12, color: T.text, marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Answer Templates</div>
        {qt.templates.map((tmpl, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: qt.color, marginBottom: 4 }}>{tmpl.label}</div>
            <div style={{ background: qt.bg, border: `1px solid ${qt.color}33`, borderRadius: T.r1, padding: "8px 12px", fontSize: 12, color: T.text, lineHeight: 1.7, fontStyle: "italic" }}>{tmpl.t}</div>
          </div>
        ))}
      </div>

      {/* Worked example */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Worked Example</div>
        <div style={{ background: T.bgMuted, borderRadius: T.r1, padding: "8px 12px", fontSize: 12, color: T.text, marginBottom: 10, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700, color: T.textSec }}>Passage: </span>{qt.eg.passage}
        </div>
        <div style={{ display: "flex", gap: 0, background: T.bgMuted, borderRadius: T.r1, padding: 3, marginBottom: 10, width: "fit-content" }}>
          <button onClick={() => setShowStrong(false)} style={{ padding: "4px 12px", borderRadius: 7, border: "none", background: !showStrong ? "#FB424E" : "transparent", color: !showStrong ? "#fff" : T.textSec, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>✗ Weak</button>
          <button onClick={() => setShowStrong(true)} style={{ padding: "4px 12px", borderRadius: 7, border: "none", background: showStrong ? "#17a2b8" : "transparent", color: showStrong ? "#fff" : T.textSec, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>✓ Strong</button>
        </div>
        <div style={{ background: showStrong ? "#E0F6F9" : "#FFEBEC", border: `1px solid ${showStrong ? "#17a2b8" : "#FB424E"}44`, borderRadius: T.r1, padding: "10px 12px", fontSize: 12, color: T.text, lineHeight: 1.7, marginBottom: showStrong ? 8 : 0, transition: "background 0.25s" }}>
          {showStrong ? qt.eg.strong : qt.eg.weak}
        </div>
        {showStrong && (
          <div style={{ background: "#E4EFFE", borderRadius: T.r1, padding: "8px 12px", fontSize: 11, color: "#1250B0", lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700 }}>Why it works: </span>{qt.eg.why}
          </div>
        )}
      </div>
    </div>
  );
}

function GP2Infographic() {
  const [selected, setSelected] = useState(null);
  const [showStrong, setShowStrong] = useState(false);
  const [animBars, setAnimBars] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimBars(true), 100);
    return () => clearTimeout(t);
  }, []);

  const sectionGroups = [
    { label: "Section A — Literal Paraphrasing", color: "#216ef4", items: GP2_QTYPES.filter(q => q.section === "A") },
    { label: "Section B1 — Word & Phrase Level", color: "#6660B9", items: GP2_QTYPES.filter(q => q.section === "B1") },
    { label: "Section B2 — Device & Figure Level", color: "#6660B9", items: GP2_QTYPES.filter(q => q.section === "B2") },
    { label: "Section B3 — Structural & Authorial", color: "#17a2b8", items: GP2_QTYPES.filter(q => q.section === "B3") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Paper 2 at a glance */}
      <div style={{ background: "linear-gradient(120deg, #0F1B3D 0%, #1A2A5E 60%, #216ef4 100%)", borderRadius: T.r3, padding: "20px 22px", color: "#fff" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#8BAEED", marginBottom: 4 }}>A-Level H1 General Paper · 8881</div>
        <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 16 }}>Paper 2 · 90 Minutes · 50 Marks</div>
        {GP2_OVERVIEW.map(c => (
          <div key={c.code} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
              <span style={{ color: "#C8D8F5", fontWeight: 600 }}>{c.code} — {c.label}</span>
              <span style={{ color: "#fff", fontWeight: 700 }}>{c.marks} marks · {c.time}</span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", background: c.color, borderRadius: 8, width: animBars ? `${c.pct * 4}%` : "0%", transition: "width 1s cubic-bezier(0.4,0,0.2,1)", maxWidth: "100%" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Accordion question types */}
      <div style={{ fontSize: 13, fontWeight: 600, color: T.textSec }}>Click any question type below to see the full approach, templates, and worked examples.</div>

      {sectionGroups.map(grp => (
        <div key={grp.label}>
          <div style={{ fontSize: 11, fontWeight: 700, color: grp.color, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8, paddingLeft: 2 }}>{grp.label}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {grp.items.map(qt => {
              const isOpen = selected === qt.id;
              return (
                <div key={qt.id} style={{ borderRadius: T.r2, border: `2px solid ${isOpen ? qt.color : T.border}`, background: isOpen ? qt.bg : T.bgCard, overflow: "hidden", transition: "border-color 0.18s, background 0.18s", boxShadow: isOpen ? `0 0 0 3px ${qt.color}18` : "none" }}>
                  <button onClick={() => { setSelected(s => s === qt.id ? null : qt.id); setShowStrong(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontSize: 22, flexShrink: 0 }}>{qt.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: qt.color, fontFamily: "'JetBrains Mono', monospace" }}>{qt.code}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: qt.color, background: isOpen ? "#fff" : qt.bg, padding: "1px 6px", borderRadius: 20 }}>{qt.badge}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{qt.title}</div>
                      <div style={{ fontSize: 11, color: T.textSec, marginTop: 1 }}>{qt.subtitle}</div>
                    </div>
                    <CaretDown size={15} color={qt.color} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                  </button>
                  {isOpen && <QTypeDetail qt={qt} showStrong={showStrong} setShowStrong={setShowStrong} />}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

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
export const GP1_QTYPES = [
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

export const GP1_FRAMEWORKS = [
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

export const GP1_TOOLS = [
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

function GP1QTypeDetail({ qt, showStrong, setShowStrong }) {
  return (
    <div style={{ padding: "0 20px 20px", animation: "fadeSlideIn 0.18s ease" }}>
      {/* Trigger words */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: qt.color, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Trigger Words to Identify This Type</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {qt.triggers.map((t, i) => (
            <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: qt.bg, color: qt.color, fontStyle: t.includes("…") || t.length > 20 ? "italic" : "normal", border: `1px solid ${qt.color}30` }}>{t}</span>
          ))}
        </div>
      </div>

      {/* What the question is asking */}
      <div style={{ background: "#F5F7FE", borderRadius: T.r1, padding: "10px 14px", marginBottom: 16, borderLeft: `3px solid ${qt.color}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>What the Question Is Really Asking</div>
        <p style={{ fontSize: 13, color: T.text, margin: 0, lineHeight: 1.6 }}>{qt.what}</p>
      </div>

      {/* Framework + Counter row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ background: qt.bg, borderRadius: T.r1, padding: "10px 14px", border: `1px solid ${qt.color}30` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: qt.color, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Framework</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: qt.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{qt.framework}</div>
          <div style={{ fontSize: 11, color: T.textSec }}>{qt.frameworkFull}</div>
        </div>
        <div style={{ background: qt.counter === "Rebuttal" ? "#FFEBEC" : "#E0F6F9", borderRadius: T.r1, padding: "10px 14px", border: `1px solid ${qt.counterColor}30` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: qt.counterColor, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Counter Approach</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: qt.counterColor, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{qt.counter}</div>
          <div style={{ fontSize: 11, color: T.textSec }}>Stand: {qt.stand}</div>
        </div>
      </div>

      {/* Warning */}
      <div style={{ background: "#FFF0D9", borderRadius: T.r1, padding: "8px 12px", marginBottom: 16, display: "flex", gap: 8, alignItems: "flex-start", border: "1px solid #E0780030" }}>
        <Warning size={14} color="#E07800" weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 12, color: "#7A4400", margin: 0, lineHeight: 1.5 }}>{qt.warning}</p>
      </div>

      {/* Paragraph structure */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Paragraph Structure</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {qt.paraStructure.map((p, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 100px 1fr", gap: 8, alignItems: "start", background: i % 2 === 0 ? "#F5F7FE" : "transparent", borderRadius: T.r1, padding: "7px 10px" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: qt.color }}>{p.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.textSec }}>{p.role}</span>
              <span style={{ fontSize: 11, color: T.text, lineHeight: 1.5 }}>{p.what}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#FB424E", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Common Mistakes to Avoid</div>
        {qt.mistakes.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
            <span style={{ fontSize: 14, lineHeight: 1, marginTop: 1 }}>✗</span>
            <span style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>{m}</span>
          </div>
        ))}
      </div>

      {/* Examiner reward */}
      <div style={{ background: "#E2FBF0", borderRadius: T.r1, padding: "8px 12px", marginBottom: 16, display: "flex", gap: 8, alignItems: "flex-start" }}>
        <Trophy size={14} color="#006840" weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 12, color: "#006840", margin: 0, lineHeight: 1.5 }}><strong>What Examiners Reward:</strong> {qt.reward}</p>
      </div>

      {/* Sample thesis toggle */}
      <div>
        <button onClick={() => setShowStrong(s => s === qt.id ? null : qt.id)}
          style={{ fontSize: 12, fontWeight: 600, color: qt.color, background: qt.bg, border: `1px solid ${qt.color}40`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <BookOpen size={13} /> {showStrong === qt.id ? "Hide" : "Show"} Sample Thesis
        </button>
        {showStrong === qt.id && (
          <div style={{ marginTop: 8, background: qt.bg, borderRadius: T.r1, padding: "10px 14px", border: `1px solid ${qt.color}30`, animation: "fadeSlideIn 0.15s ease" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: qt.color, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Sample Thesis Statement</div>
            <p style={{ fontSize: 13, color: T.text, margin: 0, lineHeight: 1.7, fontStyle: "italic" }}>{qt.thesis}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GP1Infographic() {
  const [selected, setSelected] = useState(null);
  const [showStrong, setShowStrong] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [activeFramework, setActiveFramework] = useState(null);
  const [showBands, setShowBands] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>

      {/* ── Two Master Structures ── */}
      <div style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: T.shadow1 }}>
        <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Two Master Structures</div>
          <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>Every GP Paper 1 question maps onto one of these two architectures — choosing wrong is a structural error</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {/* Refutation */}
          <div style={{ padding: "16px 20px", borderRight: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#E4EFFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={14} color="#216ef4" weight="fill" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#216ef4", fontFamily: "'Bricolage Grotesque', sans-serif" }}>REFUTATION</span>
            </div>
            <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6, marginBottom: 10 }}>
              Part A argues <strong>FOR</strong> your position.<br/>Part B presents opposing views and <strong>DEFEATS</strong> them through direct rebuttal.
            </div>
            <div style={{ fontSize: 11, background: "#E4EFFE", borderRadius: T.r1, padding: "8px 10px", marginBottom: 8 }}>
              <strong style={{ color: "#216ef4" }}>Stand:</strong> <span style={{ color: T.text }}>Absolute or strong qualified</span><br/>
              <strong style={{ color: "#216ef4" }}>Counter:</strong> <span style={{ color: T.text }}>Rebuttal — defeat the opposing view</span>
            </div>
            <div style={{ fontSize: 11, color: T.textSec }}>Best for: <span style={{ color: "#216ef4", fontWeight: 600 }}>Q01 Direct Assertion, Q05 Open Discussion (absolute stand)</span></div>
          </div>
          {/* Limitation */}
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#EEEAFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChartPie size={14} color="#6660B9" weight="fill" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#6660B9", fontFamily: "'Bricolage Grotesque', sans-serif" }}>LIMITATION</span>
            </div>
            <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6, marginBottom: 10 }}>
              Part A shows where the claim <strong>IS true</strong>.<br/>Part B shows where and when the claim <strong>BREAKS DOWN</strong>, using concession with evaluation.
            </div>
            <div style={{ fontSize: 11, background: "#EEEAFF", borderRadius: T.r1, padding: "8px 10px", marginBottom: 8 }}>
              <strong style={{ color: "#6660B9" }}>Stand:</strong> <span style={{ color: T.text }}>Qualified / calibrated / middleground</span><br/>
              <strong style={{ color: "#6660B9" }}>Counter:</strong> <span style={{ color: T.text }}>Concession — acknowledge, then weigh</span>
            </div>
            <div style={{ fontSize: 11, color: T.textSec }}>Best for: <span style={{ color: "#6660B9", fontWeight: 600 }}>Q02 Extent, Q03 Comparison, Q04 Cause/Solution, Q06 Evaluative Judgement</span></div>
          </div>
        </div>
        {/* The critical rule */}
        <div style={{ margin: "0 16px 16px", background: "#FFF0D9", borderRadius: T.r1, padding: "10px 14px", border: "1px solid #E0780030" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#E07800", marginBottom: 4 }}>THE CONCESSION vs REBUTTAL RULE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
            <div><strong style={{ color: "#216ef4" }}>Absolute stand</strong> <span style={{ color: T.text }}>→ opposing views need <strong>REBUTTAL</strong></span></div>
            <div><strong style={{ color: "#6660B9" }}>Qualified stand</strong> <span style={{ color: T.text }}>→ opposing views need <strong>CONCESSION ONLY</strong></span></div>
          </div>
          <div style={{ fontSize: 11, color: "#7A4400", marginTop: 6 }}>Rebutting within a middleground essay contradicts your own thesis — you would be rejecting a position you yourself endorsed.</div>
        </div>
      </div>

      {/* ── 6 Question Types ── */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>6 Essay Question Types — Click to Explore</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {GP1_QTYPES.map(qt => {
            const isOpen = selected === qt.id;
            return (
              <div key={qt.id} style={{ borderRadius: T.r2, border: `2px solid ${isOpen ? qt.color : T.border}`, background: T.bgCard, overflow: "hidden", transition: "border-color 0.2s", boxShadow: isOpen ? T.shadow2 : T.shadow1 }}>
                <button onClick={() => setSelected(s => s === qt.id ? null : qt.id)}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                  {/* Code badge */}
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: qt.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 18 }}>{qt.emoji}</span>
                  </div>
                  {/* Title */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: qt.color, background: qt.bg, padding: "1px 7px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.8 }}>Type {qt.code}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{qt.title}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: qt.structureColor, fontWeight: 600 }}>{qt.structure}</span>
                      <span style={{ fontSize: 11, color: T.textTer }}>·</span>
                      <span style={{ fontSize: 11, color: T.textSec }}>{qt.framework}: {qt.frameworkFull}</span>
                    </div>
                  </div>
                  {/* Expand */}
                  <div style={{ flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>
                    <CaretDown size={16} color={T.textTer} />
                  </div>
                </button>
                {isOpen && <GP1QTypeDetail qt={qt} showStrong={showStrong} setShowStrong={setShowStrong} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Paragraph Frameworks ── */}
      <div style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: T.shadow1 }}>
        <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Paragraph-Level Frameworks</div>
          <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>Use the right structure for each paragraph type — click to expand</div>
        </div>
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          {GP1_FRAMEWORKS.map(fw => {
            const isOpen = activeFramework === fw.id;
            return (
              <div key={fw.id} style={{ borderRadius: T.r1, border: `1px solid ${isOpen ? fw.color : T.border}`, overflow: "hidden", transition: "border-color 0.2s" }}>
                <button onClick={() => setActiveFramework(a => a === fw.id ? null : fw.id)}
                  style={{ width: "100%", background: isOpen ? fw.bg : "transparent", border: "none", cursor: "pointer", padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: fw.color, fontFamily: "'Bricolage Grotesque', sans-serif", minWidth: 60 }}>{fw.label}</span>
                  <span style={{ fontSize: 12, color: T.textSec, flex: 1 }}>{fw.when}</span>
                  <CaretDown size={14} color={T.textTer} style={{ flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {isOpen && (
                  <div style={{ padding: "0 14px 14px", animation: "fadeSlideIn 0.15s ease" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {fw.steps.map((s, i) => (
                        <div key={i} style={{ flex: "1 1 160px", background: "#F5F7FE", borderRadius: T.r1, padding: "10px 12px", borderTop: `3px solid ${fw.color}` }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: fw.color, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 2 }}>{s.abbr}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 4 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>{s.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ background: "#F5F7FE", borderRadius: T.r1, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textSec, marginBottom: 4 }}>KEY RULE: Topic sentences must be REASON-DRIVEN, not area-driven</div>
            <div style={{ fontSize: 12, color: T.text }}>
              <span style={{ color: "#FB424E" }}>✗ Weak:</span> "In terms of the economy…" (area-driven — describes a domain, not an argument)<br/>
              <span style={{ color: "#006840" }}>✓ Strong:</span> "Countries should host events because it generates needed revenue…" (reason-driven — Topic + Cause + Effect)
            </div>
          </div>
        </div>
      </div>

      {/* ── Planning & Evaluation Tools ── */}
      <div style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: T.shadow1 }}>
        <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Planning & Evaluation Tools</div>
          <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>Brainstorming tools for planning · evaluation tools for within paragraphs</div>
        </div>
        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {GP1_TOOLS.map(tool => {
            const isOpen = activeTool === tool.id;
            return (
              <div key={tool.id} onClick={() => setActiveTool(a => a === tool.id ? null : tool.id)}
                style={{ borderRadius: T.r1, border: `2px solid ${isOpen ? tool.color : T.border}`, padding: 14, cursor: "pointer", transition: "all 0.2s", background: isOpen ? tool.bg : T.bgCard }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: tool.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{tool.label}</span>
                  <span style={{ fontSize: 10, background: tool.bg, color: tool.color, padding: "1px 6px", borderRadius: 10, fontWeight: 700, border: `1px solid ${tool.color}30` }}>{tool.source}</span>
                </div>
                <div style={{ fontSize: 11, color: T.textSec, marginBottom: isOpen ? 10 : 0 }}>{tool.when}</div>
                {isOpen && (
                  <div style={{ animation: "fadeSlideIn 0.15s ease" }}>
                    {tool.letters.map((l, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: tool.color, fontFamily: "'Bricolage Grotesque', sans-serif", minWidth: 16 }}>{l.l}</span>
                        <span style={{ fontSize: 11, color: T.text }}>{l.full}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 8, fontSize: 11, color: T.textSec, lineHeight: 1.5, borderTop: `1px solid ${tool.color}20`, paddingTop: 8 }}>{tool.note}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Band Descriptors + Time ── */}
      <div style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: T.shadow1 }}>
        <button onClick={() => setShowBands(b => !b)}
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Band Descriptors & Time Management</div>
            <div style={{ fontSize: 12, color: T.textSec, marginTop: 2 }}>What separates Band 3 → 4 → 5, and how to pace 90 minutes</div>
          </div>
          <CaretDown size={16} color={T.textTer} style={{ flexShrink: 0, transition: "transform 0.2s", transform: showBands ? "rotate(180deg)" : "none" }} />
        </button>
        {showBands && (
          <div style={{ padding: "0 20px 20px", animation: "fadeSlideIn 0.18s ease" }}>
            {/* Band jumps */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "#FFF0D9", borderRadius: T.r1, padding: "12px 14px", border: "1px solid #E0780030" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#E07800", marginBottom: 6 }}>BAND 3 → 4 (Most Students)</div>
                <div style={{ fontSize: 11, color: T.text, lineHeight: 1.7 }}>
                  <strong>Band 3:</strong> Observations are 'generalised, assertive and/or descriptive.' Connections are 'implicit.'<br/>
                  <strong>Band 4:</strong> 'Some measured observations.' Connections are 'identified.' Shows 'analysis and evaluation.'<br/>
                  <strong style={{ color: "#E07800" }}>The difference: Band 4 students don't just state facts — they explain what they mean and why they matter.</strong>
                </div>
              </div>
              <div style={{ background: "#E2FBF0", borderRadius: T.r1, padding: "12px 14px", border: "1px solid #00684030" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#006840", marginBottom: 6 }}>BAND 4 → 5 (A-Grade Threshold)</div>
                <div style={{ fontSize: 11, color: T.text, lineHeight: 1.7 }}>
                  <strong>Band 4:</strong> 'Some engagement at conceptual level.' Examples are 'appropriate and frequent.'<br/>
                  <strong>Band 5:</strong> Engagement is 'clearly evident.' Examples are 'wide-ranging.' Connections 'identified AND explained.'<br/>
                  <strong style={{ color: "#006840" }}>The difference: Band 5 essays evaluate consistently and fully explain relationships between ideas.</strong>
                </div>
              </div>
            </div>
            {/* Time management */}
            <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 8 }}>90-Minute Exam Plan</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { phase: "Selection", time: "5–7 min", what: "Read all 8 questions. Shortlist 2–3. Run the ATQ test. Commit to one." },
                { phase: "Planning", time: "10–15 min", what: "Linear outline: thesis, FULL topic sentences (Topic+Cause+Effect), assigned examples. Identify question type and master structure." },
                { phase: "Writing", time: "55–65 min", what: "Intro (5–8 min), 3–4 body paragraphs (10–12 min each), conclusion (3–5 min)." },
                { phase: "Proofreading", time: "5–10 min", what: "Grammar, spelling, punctuation, coherence. Check thesis and conclusion align." },
              ].map((p, i) => (
                <div key={i} style={{ flex: "1 1 180px", background: "#F5F7FE", borderRadius: T.r1, padding: "10px 12px", borderTop: `3px solid #216ef4` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#216ef4" }}>{p.phase}</span>
                    <span style={{ fontSize: 11, background: "#E4EFFE", color: "#216ef4", padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>{p.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>{p.what}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, background: "#E4EFFE", borderRadius: T.r1, padding: "8px 12px", fontSize: 12, color: "#1250B0" }}>
              <strong>Cardinal Rule:</strong> A complete essay always beats an incomplete one. Plan conservatively and protect time for the conclusion. Aim for 600–800 words. Three deeply developed paragraphs beat five shallow ones.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━ INFO PACKS — CURATED EXAMPLES BY 8881 SYLLABUS THEME ━━━ */


