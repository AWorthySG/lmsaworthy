// Game data
export const GAME_INSTRUCTIONS = {
  "vocab-blitz": {
    objective: "Match falling vocabulary words to their correct definitions before time runs out. Build combos for bonus points!",
    rules: [
      "A word appears at the top of the screen with a countdown timer (8 seconds per word).",
      "Four definition options are shown below. Tap the correct definition before time runs out.",
      "Correct answers earn points and build your combo streak (🔥). Higher combos = more points per answer.",
      "Wrong answers or timeouts break your combo and cost you one of 3 lives (❤️).",
      "Words get progressively harder across 15 rounds — from common vocab to Band 5 essay words.",
      "Speed bonus: answering in under 3 seconds doubles your points for that round.",
    ],
    tips: "Read all four options before choosing — distractors are designed to be close. Root words can help: 'bene-' means good, 'mal-' means bad, '-ous' often means 'full of'.",
    scoring: "Points per correct answer × combo multiplier × speed bonus. Grade: S (90%+), A (75%+), B (60%+), C (40%+), D (<40%)."
  },
  "thesis-defence": {
    objective: "Build a strong thesis statement for a GP essay question, then defend it against waves of counter-arguments by selecting the best rebuttal.",
    rules: [
      "A GP essay question is presented (e.g., 'Is technology making us less human?').",
      "Phase 1 — BUILD: Choose your stand (Agree/Disagree), a qualifier, and 2 key arguments to form your thesis.",
      "Phase 2 — DEFEND: 5 counter-arguments attack your thesis. For each, select the strongest rebuttal from 3 options.",
      "Strong rebuttals earn 2 points. Acceptable rebuttals earn 1 point. Weak rebuttals earn 0 and your thesis takes damage.",
      "Your thesis has 3 HP (🛡️). If it reaches 0, your argument crumbles!",
      "After all 5 rounds, you get a grade and feedback on your argumentative strategy.",
    ],
    tips: "The strongest rebuttals acknowledge the counter-argument before refuting it ('While it is true that... however...'). Avoid rebuttals that ignore the counter-argument entirely or resort to ad hominem.",
    scoring: "10 points possible (2 per round). S = 9-10, A = 7-8, B = 5-6, C = 3-4, D = 0-2."
  },
  "inflation-fighter": {
    objective: "You're the central bank governor. Keep inflation in the 2-3% target range across 10 quarters while random economic shocks destabilise the economy.",
    rules: [
      "Inflation starts at 5% — above target. Your job is to bring it down and keep it stable.",
      "Each quarter, choose ONE policy tool: raise/lower interest rates, or tighten/loosen fiscal policy.",
      "Each tool has a different effect on inflation, GDP growth, and unemployment — visible before you choose.",
      "After your action, a random economic event may occur (oil shock, tech boom, pandemic, etc.).",
      "You earn 1 point for each quarter inflation stays within the 2-3% target band.",
      "Bonus: keep unemployment below 6% and GDP growth positive for extra points.",
      "The game runs for 10 quarters.",
    ],
    tips: "Raising interest rates is the most powerful anti-inflation tool but hurts GDP. Fiscal tightening is slower but less damaging to growth. Don't over-correct — policy effects carry into the next quarter.",
    scoring: "Grade based on quarters in target: S (8+), A (6-7), B (4-5), C (2-3), D (0-1). Bonus points for balanced growth."
  },
  "price-wars": {
    objective: "Run a firm in a 3-player oligopoly. Set prices each round to maximise your cumulative profit over 8 rounds. AI rivals react to your strategy!",
    rules: [
      "You and 2 AI firms sell identical products. Each round, everyone simultaneously sets a price: Low ($5), Medium ($8), or High ($12).",
      "If all firms price HIGH: everyone earns moderate profit (collusion). Market share is split equally.",
      "If you price LOW while others price HIGH: you steal customers and earn huge profit, but they earn almost nothing.",
      "If everyone prices LOW: a price war — everyone earns minimal profit.",
      "AI firms remember your past behaviour. If you betray their trust, they may retaliate with low prices.",
      "After 8 rounds, the firm with the highest cumulative profit wins.",
      "This is the Prisoner's Dilemma — cooperation pays long-term, but defection is tempting!",
    ],
    tips: "Start cooperative (High) to build trust. If an AI defects, consider tit-for-tat: match their price next round to signal consequences. Constant low pricing triggers an unwinnable price war.",
    scoring: "Your total profit vs AI firms. S = highest profit + no one went bankrupt. D = lowest profit. Bonus for sustained cooperation."
  },
  "shrink-ray": {
    objective: "Condense a paragraph to its essential meaning by removing redundant words — just like writing a summary under a word limit.",
    rules: [
      "You'll see a paragraph with many redundant words and phrases.",
      "Click on any word you think is unnecessary to remove it. Removed words appear crossed out.",
      "Your goal is to reach the target word count shown at the top.",
      "Be careful: some words are essential key points. Removing an essential word costs you one of your 3 lives (❤️).",
      "If you lose all 3 lives, the game ends — the essential words will be highlighted in green so you can learn.",
      "Build combos by removing multiple redundant words in a row without hitting an essential one. Combos show as 🔥 multipliers.",
      "You can click a removed word again to restore it if you change your mind.",
    ],
    tips: "Start by identifying obvious filler phrases like 'in order to', 'the fact that', 'and also'. Pairs of synonyms ('provide and offer', 'difficult and challenging') are usually redundant — one word is enough.",
    scoring: "Reach the target word count with all 3 lives intact for a perfect score. Combo streaks earn bonus points."
  },
  "market-playground": {
    objective: "Find the market equilibrium price where quantity demanded equals quantity supplied — then adapt when economic shocks hit.",
    rules: [
      "Use the price slider to set the market price for a good (between $10 and $100).",
      "The live graph shows the Demand curve (blue, slopes downward) and Supply curve (green, slopes upward).",
      "Buyers (🛒) appear based on quantity demanded at your price — lower price = more buyers.",
      "Sellers (🏭) appear based on quantity supplied at your price — higher price = more sellers.",
      "When Qd = Qs (within $3), you've found the EQUILIBRIUM — the status badge turns green and pulses.",
      "Click '🎲 Random Shock' to introduce a real-world event that shifts the demand or supply curve.",
      "After each shock, you must readjust the price to find the new equilibrium.",
      "You earn 1 point for each shock you survive while at equilibrium.",
    ],
    tips: "If there's a shortage (Qd > Qs), raise the price. If there's a surplus (Qs > Qd), lower it. After a demand shock, the equilibrium price moves in the same direction as demand.",
    scoring: "Score 1 point per round if you're at equilibrium when the shock hits. Try to maintain equilibrium across as many rounds as possible."
  },
  "headline-sifter": {
    objective: "Develop media literacy by correctly classifying news headlines as Reliable, Biased, Misleading, or Satire.",
    rules: [
      "You'll see 10 news headlines one at a time, each from a different 'source'.",
      "For each headline, choose one of four categories: ✅ Reliable, ⚠️ Biased, 🚫 Misleading, or 😂 Satire.",
      "After choosing, you'll see whether you were right, an explanation of the tell-tale signs, and 🚩 red flag markers on suspicious phrases.",
      "Reliable: specific data, named sources, neutral tone, established publications.",
      "Biased: generalisations, emotionally loaded language, one-sided framing, but may contain some truth.",
      "Misleading: clickbait, ALL CAPS, conspiracy framing, absolute claims ('cures ALL diseases'), unverified sources.",
      "Satire: absurd premises, humorous tone, parody publication names, impossible scenarios.",
      "Build a streak (🔥) by getting consecutive correct answers.",
    ],
    tips: "Always check the source name — parody outlets often have punny names. Look for hedging language ('may', 'critics warn') as a sign of reliability. ALL CAPS words and exclamation marks are red flags for misleading content.",
    scoring: "Earn a letter grade from S (90%+) to D (<40%). Streak multipliers reward consistency. Perfect score = Master Media Analyst."
  },
  "debate-builder": {
    objective: "Sort argument cards into FOR or AGAINST columns for a debate topic.",
    rules: [
      "A debate topic is presented with shuffled argument cards.",
      "Drag or click each card to place it in the FOR or AGAINST column.",
      "After placing all cards, see which ones you got right.",
      "Each correct placement earns 1 point.",
    ],
    tips: "Look for keywords like 'however', 'despite', 'critics argue' for AGAINST arguments. Evidence-based claims with statistics tend to be FOR.",
    scoring: "Score is based on percentage of correctly placed cards."
  },
  "story-architect": {
    objective: "Arrange scrambled story scenes into the correct narrative arc — Exposition through Resolution.",
    rules: [
      "Six story scenes from a narrative are presented in random order.",
      "Click a scene to select it, then click the narrative arc slot where it belongs.",
      "Slots follow the classic arc: Exposition → Rising Action → Rising Action → Climax → Falling Action → Resolution.",
      "Click a filled slot to remove the scene and try again.",
      "Submit when all slots are filled to see which you got right.",
    ],
    tips: "Start by identifying the Exposition (sets the scene) and Resolution (wraps up). The Climax is usually the most dramatic moment.",
    scoring: "Each correctly placed scene earns 1 point. Get all 6 right for a perfect score."
  },
  "device-spotter": {
    objective: "Find and identify literary devices hidden in a prose passage.",
    rules: [
      "A prose passage is displayed with several literary devices embedded in it.",
      "Click on a phrase you think contains a literary device.",
      "A menu appears — select the correct device type (Metaphor, Simile, Personification, etc.).",
      "Correct identification earns a point. Wrong guesses are noted but don't cost lives.",
      "Find all devices in the passage to complete the game.",
    ],
    tips: "Look for comparisons (similes use 'like'/'as', metaphors don't), human qualities given to non-human things (personification), and exaggeration (hyperbole).",
    scoring: "Earn points for each correctly identified device. Perfect score = all devices found and correctly named."
  },
  "tone-painter": {
    objective: "Paint each line of a poem with the mood colour that best matches its tone.",
    rules: [
      "A poem is displayed line by line.",
      "Select a mood colour from the palette: Blue (melancholy), Red (anger/desperation), Green (hope), Gold (joy).",
      "Click each line to paint it with your selected colour.",
      "Once all lines are painted, submit to compare with the model answer.",
      "Lines matching the model mood are marked correct.",
    ],
    tips: "Read each line aloud — the emotional weight of the words often reveals the mood. Dark imagery → melancholy, urgent words → anger, light imagery → hope.",
    scoring: "Each correctly painted line earns 1 point. Try to match all lines with the model answer."
  },
  "scene-breakdown": {
    objective: "Identify the primary motivation driving each character in a dramatic scene.",
    rules: [
      "A scene from a play or prose is presented with key characters highlighted.",
      "For each character, select their primary motivation from a list of options.",
      "Submit to see the correct motivations and a relationship analysis.",
    ],
    tips: "Pay attention to what characters say AND what they do — actions often reveal true motivation more than dialogue.",
    scoring: "Earn points for each correctly identified motivation."
  },
  "policy-lab": {
    objective: "You're a policy advisor. Balance four competing priorities over 5 rounds by choosing the right policy levers.",
    rules: [
      "You manage four meters: Affordability, Sustainability, Approval, and Budget.",
      "Each round, choose one of six available policies. Each policy affects the meters differently.",
      "Your goal: keep all four meters above 40% by the end of the game.",
      "The effects of each policy are shown before you choose — plan strategically.",
      "There are 5 rounds total.",
    ],
    tips: "Don't let any single meter drop too low — it's harder to recover than to maintain. Balance short-term gains against long-term sustainability.",
    scoring: "Win by keeping all meters above 40%. The higher your lowest meter, the better your performance."
  },
  "argument-mapper": {
    objective: "Classify arguments as FOR, AGAINST, or LOGICAL FALLACY for a controversial claim.",
    rules: [
      "A controversial claim is presented (e.g., about AI, social media, or technology).",
      "10 argument cards are shown one at a time.",
      "Classify each card as: FOR (supports the claim), AGAINST (opposes the claim), or FALLACY (contains a logical error).",
      "Fallacies include Ad Hominem, Straw Man, Appeal to Authority, Slippery Slope, and Anecdotal Evidence.",
      "After each card, you'll see if you were right and an explanation of why.",
      "Build streaks by getting consecutive correct answers.",
    ],
    tips: "Watch for personal attacks (Ad Hominem), extreme exaggeration of a position (Straw Man), and single-case generalisation (Anecdotal). Valid arguments cite evidence and address the claim directly.",
    scoring: "Earn a grade from S (90%+) to D (<40%). Streak multipliers reward consistency."
  },
  "externality-city": {
    objective: "Build a city on a 3×3 grid, balancing GDP and welfare to meet specific goals across 5 rounds.",
    rules: [
      "Each round has a specific goal (e.g., 'Achieve welfare ≥ 30 while keeping GDP ≥ 10').",
      "Place buildings on the grid: Factories (GDP), Schools (welfare), Parks (welfare), Housing (both).",
      "Each building costs budget. You start each round with $100.",
      "Adjacency bonuses: Park next to School = +5 welfare. Factory next to Housing = -5 welfare.",
      "Click a building to place it. Click an occupied cell to remove it and reclaim the budget.",
      "Submit when ready to check if you met the round's goal.",
    ],
    tips: "Place parks adjacent to schools for welfare bonuses. Keep factories away from housing. Plan your grid layout before spending budget.",
    scoring: "Pass or fail each of 5 rounds. Final grade based on rounds passed."
  },
  "policy-tug": {
    objective: "Keep the economy in the balanced zone through 8 rounds of policy decisions and random economic shocks.",
    rules: [
      "The economy starts in recession (left side). Your goal is to move it to the centre (balanced zone, ±15).",
      "Choose fiscal or monetary policy tools. Each shifts the economy by a fixed amount.",
      "After each round, a random economic shock hits — oil prices spike, consumer confidence crashes, etc.",
      "You have 8 rounds. Track how many rounds you keep the economy in the balanced zone.",
      "Expansionary tools (increase spending, cut taxes, lower rates) push right. Contractionary tools push left.",
    ],
    tips: "Don't over-correct — a strong push in one direction may leave you vulnerable to a shock in the same direction. Aim to stay near centre.",
    scoring: "Grade based on how many of 8 rounds the economy stays balanced. 7+ = S, 5+ = A, 4 = B."
  },
  "dd-ss-shifter": {
    objective: "Identify whether real-world events shift the Demand curve, the Supply curve, or both — then predict the effect on equilibrium price and quantity.",
    rules: [
      "A real-world event is described (e.g., 'A new tax is imposed on coffee producers').",
      "First, decide WHICH curve shifts: Demand (D), Supply (S), or Both.",
      "Then decide the DIRECTION: does the curve shift LEFT (decrease) or RIGHT (increase)?",
      "Finally, predict what happens to EQUILIBRIUM PRICE and EQUILIBRIUM QUANTITY — do they rise, fall, or is it indeterminate?",
      "You earn points for each correct component: curve identification (+1), shift direction (+1), price prediction (+1), quantity prediction (+1).",
      "There are 10 scenarios, each testing a different demand or supply shifter.",
      "Remember: Demand shifters include income, tastes, price of related goods, expectations, population. Supply shifters include input costs, technology, government policy, number of firms, weather.",
    ],
    tips: "Ask yourself: does the event affect BUYERS (demand) or SELLERS (supply)? A tax on producers shifts supply left. A rise in consumer income shifts demand right for normal goods. When both curves shift, one variable (P or Q) becomes indeterminate.",
    scoring: "Each scenario is worth 4 points (curve + direction + price + quantity). Maximum score: 40. Score 32+ for an A grade."
  },
  "elasticity-lab": {
    objective: "Explore how price changes affect quantity demanded and revenue for goods with different elasticities — then test your knowledge in Challenge mode.",
    rules: [
      "EXPLORE mode: Select a product (Insulin, Handbag, Rice, Streaming) and adjust the price slider.",
      "Watch quantity demanded, revenue, and PED change in real-time.",
      "CHALLENGE mode: Answer 8 MCQ questions about PED calculations, elastic vs inelastic goods, and revenue effects.",
      "Each correct answer earns 1 point. See explanations after each question.",
    ],
    tips: "Remember: PED = %ΔQd / %ΔP. If PED < 1, demand is inelastic (price hike raises revenue). If PED > 1, demand is elastic (price hike lowers revenue).",
    scoring: "Challenge mode grades from S (90%+) to D (<40%). Explore mode is unscored — use it to build intuition."
  },
  "market-mogul": {
    objective: "Identify the correct market structure from real-world scenarios and economic descriptions.",
    rules: [
      "10 questions describe a firm, industry, or market characteristic.",
      "Choose the correct market structure: Perfect Competition, Monopolistic Competition, Oligopoly, or Monopoly.",
      "After answering, see an explanation of why that structure fits.",
      "Questions cover both scenario-based and theory-based identification.",
    ],
    tips: "Key distinctions: many firms + identical product = PC. Many firms + differentiated = Monopolistic. Few dominant firms + interdependent = Oligopoly. Single seller + barriers = Monopoly.",
    scoring: "Grade from S (90%+) to D (<40%) based on correct identifications."
  },
  "trade-winds": {
    objective: "Master international trade through 5 structured challenges — specialisation, gains from trade, tariffs, and productivity changes.",
    rules: [
      "Two countries each have a PPF (Production Possibility Frontier) of 100 units total.",
      "Adjust production sliders to set how much each country produces of goods vs services.",
      "Enable trading to allow countries to exchange goods and consume beyond their PPF.",
      "Each round has a specific goal — meet it to earn a point.",
      "Round 3 introduces a 30% tariff. Round 4 doubles Country A's productivity.",
    ],
    tips: "Specialise each country in what they're best at (Country A = goods, Country B = services), then trade the surplus. Higher trade volume amplifies gains.",
    scoring: "Pass or fail each of 5 challenges. Grade based on total passed."
  },
};

export const SUBJECT_GAMES = {
  eng: [
    { id: "vocab-blitz", title: "Vocab Blitz", emoji: "⚡", topic: "Vocabulary & Comprehension", color: "#E05262", desc: "Words fall from the sky! Match each word to its definition before it hits the ground. Speed + accuracy = mega combos.", difficulty: "Medium" },
    { id: "shrink-ray", title: "Shrink Ray", emoji: "🔬", topic: "Summary Writing", color: "#3D7DD6", desc: "Shrink a paragraph by removing redundant words — but keep all key points! Hit the target word count.", difficulty: "Medium" },
    { id: "debate-builder", title: "Debate Arena", emoji: "⚔️", topic: "Argumentative Writing", color: "#EF8354", desc: "Build argument towers: stack Claim + Evidence + Reasoning blocks. Weak combos wobble and fall!", difficulty: "Hard" },
    { id: "story-architect", title: "Story Architect", emoji: "🏗️", topic: "Narrative Writing", color: "#7C6FDB", desc: "Arrange scrambled story blocks onto a story arc — exposition, rising action, climax, falling action, resolution.", difficulty: "Easy" },
  ],
  gp: [
    { id: "thesis-defence", title: "Thesis Defence", emoji: "🛡️", topic: "Essay Writing", color: "#7C6FDB", desc: "Build a thesis for a GP question, then defend it against counter-arguments. Every rebuttal earns points — weak defences crumble!", difficulty: "Hard" },
    { id: "headline-sifter", title: "Headline Sifter", emoji: "📰", topic: "Media", color: "#E05262", desc: "Sort news headlines: Reliable, Biased, Misleading, or Satire. Spot the telltale signs of each.", difficulty: "Medium" },
    { id: "policy-lab", title: "Policy Lab", emoji: "🏛️", topic: "Politics & Governance", color: "#2D3A8C", desc: "You're a policy advisor. Choose policy levers and balance Affordability, Sustainability, Approval, and Budget.", difficulty: "Hard" },
    { id: "argument-mapper", title: "Argument Mapper", emoji: "🧩", topic: "Science & Technology", color: "#D4940A", desc: "Classify arguments as FOR, AGAINST, or LOGICAL FALLACY for a controversial claim. Spot Ad Hominem, Straw Man, and more.", difficulty: "Medium" },
  ],
  h1econ: [
    { id: "inflation-fighter", title: "Inflation Fighter", emoji: "🔥", topic: "Macroeconomic Policy", color: "#E05262", desc: "CPI is spiralling! Use monetary and fiscal tools to keep inflation in the 2-3% target range while random shocks hit the economy.", difficulty: "Hard" },
    { id: "market-playground", title: "Market Playground", emoji: "📊", topic: "Market Mechanism", color: "#3D7DD6", desc: "Set the price and watch buyers and sellers react. Find the equilibrium — then handle demand/supply shocks!", difficulty: "Easy" },
    { id: "externality-city", title: "Externality City", emoji: "🏙️", topic: "Market Failure", color: "#3BAA8B", desc: "Manage a city grid: factories cause pollution, schools spread literacy. Use taxes and subsidies to maximize welfare.", difficulty: "Hard" },
    { id: "policy-tug", title: "Policy Tug-of-War", emoji: "🪢", topic: "Fiscal & Monetary Policy", color: "#EF8354", desc: "The economy is in recession. Pull the right fiscal and monetary levers to centre the economy without over-correcting.", difficulty: "Medium" },
  ],
  h2econ: [
    { id: "price-wars", title: "Price Wars", emoji: "💰", topic: "Market Structures & Game Theory", color: "#E05262", desc: "Run a firm in an oligopoly. Set prices against AI rivals. Collude or compete? Every decision shapes the market. Game theory in action.", difficulty: "Hard" },
    { id: "dd-ss-shifter", title: "Shift & Solve", emoji: "📉", topic: "Demand & Supply", color: "#2B7A5B", desc: "Real-world events hit the market. Decide: does this shift Demand, Supply, or both? Then predict what happens to equilibrium price and quantity.", difficulty: "Medium" },
    { id: "elasticity-lab", title: "Elasticity Lab", emoji: "🧪", topic: "Elasticity", color: "#7C6FDB", desc: "Run a shop: adjust prices for different goods and watch demand respond. Calculate PED and see revenue change.", difficulty: "Medium" },
    { id: "market-mogul", title: "Market Mogul", emoji: "🏢", topic: "Market Structures", color: "#D4940A", desc: "Identify the correct market structure from real-world scenarios. Test your knowledge of PC, monopolistic competition, oligopoly, and monopoly.", difficulty: "Hard" },
    { id: "trade-winds", title: "Trade Winds", emoji: "🌊", topic: "International Trade", color: "#3D7DD6", desc: "Two countries, two goods. Find comparative advantage, set up trade, and watch consumption expand beyond the PPF.", difficulty: "Medium" },
  ],
};

/* ── Vocab Blitz (English — Timed vocabulary matching) ── */
