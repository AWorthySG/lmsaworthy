// Past Papers data
export const PAST_PAPERS = [
  { id: 1, year: 2024, subject: "eng", paper: "Paper 1", title: "2024 O-Level English Paper 1 (Writing)", topics: ["Argumentative", "Narrative", "Descriptive"], difficulty: "Standard",
    modelHints: ["Q1 (Argumentative): 'Should schools ban mobile phones entirely?' — Strong essays took a nuanced stand (e.g., 'restrict, not ban') with specific evidence from education research.", "Q3 (Narrative): 'Write a story ending with ...they finally understood.' — Top scripts used a single pivotal scene with sensory detail and internal monologue."] },
  { id: 2, year: 2024, subject: "eng", paper: "Paper 2", title: "2024 O-Level English Paper 2 (Comprehension)", topics: ["Inference", "Summary", "Language Use"], difficulty: "Standard",
    modelHints: ["Summary Q: Focus on 5 reasons why urban green spaces improve mental health. Paraphrase carefully — lifting = 0 language marks.", "Language Q: 'The city devoured everything' — identify personification, explain predatory/consuming imagery."] },
  { id: 3, year: 2023, subject: "eng", paper: "Paper 1", title: "2023 O-Level English Paper 1 (Writing)", topics: ["Argumentative", "Narrative", "Expository"], difficulty: "Standard",
    modelHints: ["Q2 (Argumentative): 'Technology does more harm than good for young people' — Counter-argument essential. Best essays acknowledged benefits before arguing net harm.", "Q5 (Narrative): Use of flashback structure earned high marks."] },
  { id: 4, year: 2024, subject: "gp", paper: "Paper 1", title: "2024 A-Level GP Paper 1 (Essay)", topics: ["Science & Tech", "Media", "Environment", "Education"], difficulty: "Standard",
    modelHints: ["Q3 (Media): 'Is censorship ever justified?' — L4 essays distinguished between content types (hate speech vs political dissent) rather than blanket yes/no.", "Q7 (Environment): Use the Paris Agreement and Singapore's Green Plan 2030 as SEER examples."] },
  { id: 5, year: 2024, subject: "gp", paper: "Paper 2", title: "2024 A-Level GP Paper 2 (Comprehension)", topics: ["Application Question", "Summary", "Language"], difficulty: "Standard",
    modelHints: ["AQ: The author argues technology isolates us. Strong answers referenced Singapore's Smart Nation initiative as a counter-example where tech builds community.", "Summary: 8 content points on reasons for distrust in media. Paraphrase 'echo chambers' as 'insulated information environments'."] },
  { id: 6, year: 2023, subject: "gp", paper: "Paper 1", title: "2023 A-Level GP Paper 1 (Essay)", topics: ["Politics", "Arts & Culture", "Social Issues"], difficulty: "Standard",
    modelHints: ["Q1 (Politics): 'Democracy is the best form of government.' — L4 required acknowledging Singapore's model (meritocratic authoritarianism with democratic elements).", "Q10 (Arts): Distinguish between intrinsic and economic value of the arts."] },
  { id: 7, year: 2024, subject: "h2econ", paper: "Paper 1", title: "2024 A-Level H2 Econ Paper 1 (Case Study)", topics: ["Market Failure", "Macroeconomic Policy"], difficulty: "Standard",
    modelHints: ["CSQ1: Carbon tax effectiveness — draw MSC/MPC diagram, explain Pigouvian tax mechanism, evaluate with government failure.", "CSQ2: Singapore's exchange rate policy — explain MAS NEER band, how appreciation fights imported inflation."] },
  { id: 8, year: 2024, subject: "h2econ", paper: "Paper 2", title: "2024 A-Level H2 Econ Paper 2 (Essays)", topics: ["Demand & Supply", "Market Structures", "International Trade"], difficulty: "Standard",
    modelHints: ["Essay Q2: Compare pricing strategies in oligopoly vs monopolistic competition — use game theory for oligopoly, product differentiation for MC.", "Essay Q5: Evaluate free trade — use comparative advantage theory, then discuss protectionism with SG examples (open trade policy)."] },
  { id: 9, year: 2024, subject: "h1econ", paper: "Paper 1", title: "2024 A-Level H1 Econ Paper 1 (Case Study)", topics: ["Market Mechanism", "Government Intervention", "Macroeconomy"], difficulty: "Standard",
    modelHints: ["Part (a): Draw DD-SS diagram for housing market, show effect of government cooling measures (tax = supply shift left).", "Part (d) Evaluate: Compare fiscal stimulus vs exchange rate depreciation for SG's economic recovery. Must mention small multiplier effect."] },
  { id: 10, year: 2023, subject: "h2econ", paper: "Paper 1", title: "2023 A-Level H2 Econ Paper 1 (Case Study)", topics: ["Elasticity", "Fiscal Policy"], difficulty: "Standard",
    modelHints: ["CSQ1: Calculate PED from data, classify elastic/inelastic, explain revenue implications for the firm.", "CSQ2: Evaluate effectiveness of expansionary fiscal policy — discuss multiplier, crowding out, time lags, and SG context."] },
  { id: 11, year: 2023, subject: "h1econ", paper: "Paper 1", title: "2023 A-Level H1 Econ Paper 1 (Case Study)", topics: ["Market Failure", "Exchange Rates"], difficulty: "Standard",
    modelHints: ["Part (b): Explain negative externality of production with MSC/MPC diagram. Must show welfare loss triangle.", "Part (e): Discuss whether exchange rate appreciation is always beneficial — consider exporters vs consumers."] },
  { id: 12, year: 2022, subject: "eng", paper: "Paper 1", title: "2022 O-Level English Paper 1 (Writing)", topics: ["Argumentative", "Narrative"], difficulty: "Standard",
    modelHints: ["Q1 (Argumentative): Strong opening hooks used statistics. Best conclusions offered a forward-looking recommendation, not just a summary.", "Q4 (Narrative): Dialogue was key — top scripts used dialogue to reveal character rather than narrating emotions directly."] },
];

/* ━━━ CONTENT TAGS — exam paper, question type, difficulty ━━━ */
export const CONTENT_TAGS = {
  eng: { papers: ["Paper 1 (Writing)", "Paper 2 (Comprehension)", "Paper 3 (Listening)", "Paper 4 (Oral)"], questionTypes: ["Argumentative", "Narrative", "Descriptive", "Expository", "Inference", "Summary", "Language Use", "Vocabulary"] },
  gp: { papers: ["Paper 1 (Essay)", "Paper 2 (Comprehension)"], questionTypes: ["Essay Planning", "Application Question", "Summary", "Critical Thinking", "Media Literacy", "Fallacy Identification"] },
  h1econ: { papers: ["Paper 1 (Case Study)"], questionTypes: ["Explain", "Analyse", "Evaluate", "Discuss", "Compare", "Diagram"] },
  h2econ: { papers: ["Paper 1 (Case Study)", "Paper 2 (Essays)"], questionTypes: ["Explain", "Analyse", "Evaluate", "Discuss", "Compare", "Diagram", "Calculate"] },
};
export const DIFFICULTY_LEVELS = ["Foundation", "Standard", "Challenging", "Exam-Level"];

/* ━━━ MICROLEARNING MODULES — 5-min bite-sized lessons ━━━ */
