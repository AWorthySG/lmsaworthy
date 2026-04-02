// Essay data
export const ESSAY_RUBRICS = {
  eng: {
    name: "O-Level English Argumentative Essay",
    criteria: [
      { name: "Content & Task Fulfilment", weight: 30, levels: [
        { level: "L4 (25-30)", desc: "Fully addresses the topic. Strong, sustained argument with convincing examples. Ideas are well-developed and nuanced." },
        { level: "L3 (19-24)", desc: "Addresses the topic well. Clear argument with relevant examples. Some ideas could be more developed." },
        { level: "L2 (13-18)", desc: "Partially addresses the topic. Argument is present but may wander. Examples are generic or limited." },
        { level: "L1 (0-12)", desc: "Barely addresses the topic. No clear argument. Examples are absent or irrelevant." },
      ]},
      { name: "Language & Accuracy", weight: 30, levels: [
        { level: "L4 (25-30)", desc: "Band 5 vocabulary. Varied sentence structures. Minimal errors. Sophisticated expression." },
        { level: "L3 (19-24)", desc: "Good vocabulary range. Generally accurate grammar. Occasional lapses." },
        { level: "L2 (13-18)", desc: "Limited vocabulary. Frequent grammatical errors. Meaning sometimes unclear." },
        { level: "L1 (0-12)", desc: "Poor vocabulary. Persistent errors obscure meaning." },
      ]},
      { name: "Organisation & Structure", weight: 20, levels: [
        { level: "L4 (17-20)", desc: "Clear PEEL paragraphs. Strong introduction with thesis. Logical flow. Effective conclusion." },
        { level: "L3 (13-16)", desc: "Paragraphs present. Reasonable flow. Introduction and conclusion exist." },
        { level: "L2 (9-12)", desc: "Weak paragraphing. Some flow issues. Introduction or conclusion may be weak." },
        { level: "L1 (0-8)", desc: "No clear structure. Ideas are jumbled." },
      ]},
      { name: "Persuasion & Evidence", weight: 20, levels: [
        { level: "L4 (17-20)", desc: "Acknowledges counter-arguments. Evidence is specific and evaluated. Rebuttals are strong." },
        { level: "L3 (13-16)", desc: "Some counter-arguments considered. Evidence is relevant but could be more specific." },
        { level: "L2 (9-12)", desc: "One-sided. Evidence is vague or anecdotal." },
        { level: "L1 (0-8)", desc: "No evidence or counter-arguments." },
      ]},
    ],
  },
  gp: {
    name: "A-Level GP Paper 1 Essay",
    criteria: [
      { name: "Content & Argument", weight: 35, levels: [
        { level: "L4 (28-35)", desc: "Perceptive and insightful. Arguments are well-supported with specific, evaluated examples. Nuanced analysis. Addresses multiple perspectives." },
        { level: "L3 (21-27)", desc: "Good understanding. Arguments are relevant with adequate support. Some evaluation but could be deeper." },
        { level: "L2 (14-20)", desc: "Limited analysis. Arguments lack depth. Examples are general or under-developed." },
        { level: "L1 (0-13)", desc: "Superficial treatment. Assertions without evidence. Off-topic or irrelevant." },
      ]},
      { name: "Language & Expression", weight: 30, levels: [
        { level: "L4 (25-30)", desc: "Mature, fluent expression. Varied vocabulary. Precise and effective use of language." },
        { level: "L3 (19-24)", desc: "Generally fluent. Good range of vocabulary. Occasional lapses in precision." },
        { level: "L2 (13-18)", desc: "Adequate expression. Limited vocabulary. Some awkward phrasing." },
        { level: "L1 (0-12)", desc: "Weak expression. Frequent errors impede communication." },
      ]},
      { name: "Structure & Coherence", weight: 20, levels: [
        { level: "L4 (17-20)", desc: "Clear thesis. Well-organized with logical progression. Effective use of signposting. Strong conclusion." },
        { level: "L3 (13-16)", desc: "Thesis present. Reasonable organization. Paragraphs are linked." },
        { level: "L2 (9-12)", desc: "Weak thesis. Some organizational issues. Ideas may not flow logically." },
        { level: "L1 (0-8)", desc: "No clear structure or thesis." },
      ]},
      { name: "Critical Thinking", weight: 15, levels: [
        { level: "L4 (12-15)", desc: "Evaluates assumptions. Identifies limitations. Considers counter-arguments thoughtfully." },
        { level: "L3 (9-11)", desc: "Some evaluation. Counter-arguments mentioned but not fully explored." },
        { level: "L2 (5-8)", desc: "Limited critical engagement. One-sided perspective." },
        { level: "L1 (0-4)", desc: "No critical thinking evident." },
      ]},
    ],
  },
};

/* ━━━ PAST-YEAR PAPER BANK ━━━ */

export const MODEL_ESSAYS = [
  { id: 1, subject: "eng", type: "Argumentative", title: "'Social media does more harm than good for young people.' Do you agree?", grade: "A", band: 5,
    essay: "In an era where the average teenager spends over four hours daily scrolling through curated feeds and algorithmically-driven content, the question of social media's impact on young people has become not merely academic, but urgent. While social media undeniably offers certain benefits — including connectivity and access to information — this essay argues that its detrimental effects on mental health, social development, and academic performance far outweigh its advantages.\n\nFirstly, the psychological toll of social media on young people is both well-documented and alarming. A landmark 2023 report by the US Surgeon General classified social media as a 'significant contributor to the youth mental health crisis', noting that teenagers who spend three or more hours daily on these platforms are twice as likely to experience symptoms of depression and anxiety. This is not coincidental; the very architecture of these platforms — infinite scroll, notification loops, and appearance-based validation through 'likes' — is engineered to exploit adolescent vulnerability. The relentless exposure to curated, idealised lives fosters a corrosive culture of comparison that erodes self-esteem during the most psychologically formative years.\n\nAdmittedly, proponents of social media argue that it provides a vital lifeline for isolated or marginalised young people, offering community and connection that may be absent in their physical environment. This is a valid consideration — platforms like Discord and Reddit have indeed fostered supportive communities for LGBTQ+ youth and those with niche interests. However, this argument conflates digital interaction with genuine human connection. Research by MIT sociologist Sherry Turkle demonstrates that heavy social media users report greater feelings of loneliness, not fewer, precisely because shallow online exchanges displace the deeper, face-to-face relationships essential for psychological wellbeing. The connection social media provides is, at best, a pale imitation of authentic human bonds.\n\nFurthermore, social media's impact on academic performance cannot be overlooked. The constant interruption of notifications fragments attention, training young brains for distraction rather than sustained focus. A 2024 study by the University of Chicago found that the mere presence of a smartphone on a student's desk reduced cognitive capacity by 10%, even when the device was face-down and silent. In an education system that demands deep reading, analytical writing, and extended concentration, social media's attention economy is directly at odds with academic excellence.\n\nIn conclusion, while social media is not without its merits, the weight of evidence points decisively toward net harm for young people. Its engineered addictiveness, its corrosion of mental health, and its fragmentation of attention represent a triple threat that no amount of community-building or information access can adequately offset. The question is no longer whether social media harms young people, but what society is prepared to do about it.",
    feedback: "Band 5 qualities: Strong thesis with qualifier. SEER examples (Surgeon General report, Turkle research). Counter-argument acknowledged and rebutted. Sophisticated vocabulary throughout. Clear PEEL structure in every paragraph." },
  { id: 2, subject: "gp", type: "Essay", title: "'Science always improves the quality of human life.' How far do you agree?", grade: "A", band: 4,
    essay: "The narrative of scientific progress as an unqualified good is deeply embedded in modern consciousness. From penicillin to the internet, the trajectory of human civilisation appears inextricably linked to scientific advancement. However, to claim that science 'always' improves quality of life requires us to ignore a more complex reality — one in which scientific progress often creates new problems even as it solves old ones.\n\nScience has, without question, delivered transformative improvements to human existence. The development of vaccines has eradicated smallpox and dramatically reduced the burden of infectious diseases worldwide. Between 1900 and 2020, global life expectancy more than doubled, from 31 to 73 years, driven primarily by advances in medicine, sanitation, and agricultural science. In Singapore, the healthcare system — built on scientific research and technological innovation — provides one of the world's highest life expectancies at 84 years. These achievements represent genuine, measurable improvements in quality of life that would have been inconceivable without science.\n\nYet the same scientific enterprise that has extended our lives has also created existential threats to our continued existence. The development of nuclear weapons — a direct product of physics research — introduced the possibility of instantaneous civilisational annihilation. Climate change, driven by the industrial technologies that science enabled, threatens to undo centuries of progress through rising seas, extreme weather, and ecological collapse. The IPCC's 2024 report warns that without dramatic intervention, global temperatures will exceed 2°C above pre-industrial levels by 2050, with catastrophic consequences for food security and human displacement. Science gave us the internal combustion engine; it also gave us the crisis that engine produced.\n\nMoreover, scientific advancement does not distribute its benefits equally. The digital revolution has created unprecedented wealth and convenience for those with access, while simultaneously widening the gap between the technologically connected and the technologically excluded. In Singapore, while Smart Nation initiatives bring AI and data analytics to public services, the elderly and digitally illiterate risk being left behind in an increasingly automated society. Science improves quality of life — but primarily for those positioned to benefit from it.\n\nOn balance, it is more accurate to say that science has the potential to improve quality of life, but whether it does so depends on how its applications are governed, distributed, and regulated. Science itself is morally neutral; it is the human systems around it — politics, economics, ethics — that determine whether a given advancement becomes a blessing or a curse. The challenge of our era is not to produce more science, but to produce wiser stewardship of the science we already have.",
    feedback: "L4 content: Balanced argument with specific examples (IPCC, Singapore Smart Nation). Strong evaluation with nuanced conclusion. Could reach L5 with one more deeply analysed example." },
  { id: 3, subject: "h2econ", type: "Essay", title: "Discuss whether a government should use fiscal policy or monetary policy to address a recession.", grade: "A", band: null,
    essay: "A recession — characterised by two consecutive quarters of negative real GDP growth — requires deliberate government intervention to restore aggregate demand and economic stability. Both fiscal policy (government spending and taxation) and monetary policy (interest rates and money supply) offer tools to combat recession, but their effectiveness depends on the specific economic context.\n\nFiscal policy operates through changes in government spending (G) and taxation (T). During a recession, expansionary fiscal policy — increasing G or reducing T — directly injects spending into the circular flow of income. An increase in government spending on infrastructure, for example, creates jobs, generates income, and triggers a multiplier effect as that income is re-spent in the economy. If the marginal propensity to consume (MPC) is 0.8, the multiplier is 1/(1-0.8) = 5, meaning a $10 billion increase in G could potentially raise GDP by $50 billion. The advantage of fiscal policy is its directness — G is a component of AD, so changes feed immediately into aggregate demand.\n\nHowever, fiscal policy has significant limitations. The implementation lag can be substantial — government budgets require parliamentary approval, public consultation, and administrative planning, meaning the stimulus may arrive after the recession has ended or worsened. Furthermore, if the government finances increased spending through borrowing, it may drive up interest rates (crowding out), reducing private investment and partially offsetting the expansionary effect. In the context of Singapore, the multiplier is relatively small due to the high marginal propensity to save and high marginal propensity to import, which means fiscal spending leaks out of the domestic economy quickly.\n\nMonetary policy, typically conducted by the central bank, lowers interest rates during a recession to encourage consumption and investment. Lower interest rates reduce the cost of borrowing for firms and households, stimulating investment (I) and consumption (C), both components of AD. Monetary policy can be implemented faster than fiscal policy, as central banks can adjust rates without parliamentary approval. Additionally, quantitative easing — purchasing government bonds to increase money supply — can provide further stimulus when rates are already low.\n\nYet monetary policy also faces constraints. In a severe recession, the economy may face a liquidity trap — where interest rates are already near zero and further cuts have no effect because consumers and firms are too pessimistic to borrow regardless of the rate. Japan's 'lost decades' illustrate this limitation. Moreover, monetary policy is an indirect tool: it creates conditions for borrowing, but cannot force firms to invest or consumers to spend.\n\nIn Singapore's case, the situation is unique. The Monetary Authority of Singapore (MAS) conducts monetary policy through the exchange rate rather than interest rates, managing the Singapore Dollar Nominal Effective Exchange Rate (S$NEER) within a policy band. To combat recession, MAS would depreciate the S$NEER, making exports cheaper and imports more expensive, thereby boosting net exports (X-M) and aggregate demand. This approach is particularly effective for Singapore given its high trade openness (trade exceeds 300% of GDP).\n\nIn conclusion, neither fiscal nor monetary policy alone is sufficient to address a recession comprehensively. Fiscal policy provides direct, targeted stimulus but suffers from implementation lags and crowding out. Monetary policy acts faster but may be ineffective in a liquidity trap. The optimal approach is a coordinated policy mix — using monetary policy for immediate stabilisation and fiscal policy for targeted, structural intervention. In Singapore's context, exchange rate policy plays the primary role, supplemented by fiscal measures such as the Jobs Support Scheme and Resilience Budget during economic downturns.",
    feedback: "Strong L3 essay: Clear comparison structure, economic rigour with multiplier calculation, Singapore context applied throughout. To reach L4: deeper evaluation of policy interaction effects." },
];

/* ━━━ PERSONAL NOTES SYSTEM ━━━ */
function NotesPage({ state, dispatch }) {
  const [filterSubj, setFilterSubj] = useState("all");
  const [editingNote, setEditingNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteSubject, setNoteSubject] = useState("eng");
  const [searchQ, setSearchQ] = useState("");

  const notes = (state.notes || []).filter(n => {
    if (filterSubj !== "all" && n.subject !== filterSubj) return false;
    if (searchQ && !n.title.toLowerCase().includes(searchQ.toLowerCase()) && !n.content.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  function saveNote() {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    if (editingNote) {
      dispatch({ type: "UPDATE_NOTE", payload: { id: editingNote.id, title: noteTitle, content: noteContent, subject: noteSubject } });
      dispatch({ type: "ADD_TOAST", payload: { message: "Note updated", variant: "success" } });
    } else {
      dispatch({ type: "ADD_NOTE", payload: { title: noteTitle, content: noteContent, subject: noteSubject } });
      dispatch({ type: "ADD_TOAST", payload: { message: "Note saved", variant: "success" } });
    }
    setEditingNote(null); setNoteTitle(""); setNoteContent(""); setNoteSubject("eng");
  }

  function startEdit(note) {
    setEditingNote(note); setNoteTitle(note.title); setNoteContent(note.content); setNoteSubject(note.subject);
  }

  function cancelEdit() { setEditingNote(null); setNoteTitle(""); setNoteContent(""); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, background: T.gradPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>My Notes</h1>
          <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>Personal study notes organised by subject</p>
        </div>
        {!editingNote && !noteTitle && (
          <button onClick={() => setNoteTitle(" ")} style={{ padding: "8px 18px", borderRadius: T.r2, background: T.gradPrimary, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: T.shadowAccent }}>
            <Plus size={15} /> New Note
          </button>
        )}
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgCard }}>
          <MagnifyingGlass size={14} color={T.textTer} />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search notes..." style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: T.text }} />
        </div>
        {["all", ...SUBJECTS.map(s => s.id)].map(s => (
          <button key={s} onClick={() => setFilterSubj(s)} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === s ? T.accent : T.border}`, background: filterSubj === s ? T.accentLight : T.bgCard, color: filterSubj === s ? T.accent : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>
            {s === "all" ? "All" : getSubject(s)?.name?.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* New/Edit note form */}
      {(noteTitle || editingNote) && (
        <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "18px", border: `1px solid ${T.accent}33`, boxShadow: T.shadow2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 10 }}>
            <input value={noteTitle === " " ? "" : noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Note title..." style={{ padding: "10px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 14, fontWeight: 600, boxSizing: "border-box" }} autoFocus />
            <select value={noteSubject} onChange={e => setNoteSubject(e.target.value)} style={{ padding: "10px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 12, boxSizing: "border-box" }}>
              {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} rows={6} placeholder="Type your notes here... You can write formulas, key concepts, exam tips, anything you want to remember." style={{ width: "100%", padding: "12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, resize: "vertical", boxSizing: "border-box", lineHeight: 1.8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={saveNote} disabled={!noteTitle.trim() || noteTitle === " " || !noteContent.trim()} style={{ padding: "8px 20px", borderRadius: T.r2, background: noteTitle.trim() && noteTitle !== " " && noteContent.trim() ? T.gradPrimary : T.bgMuted, color: noteTitle.trim() && noteTitle !== " " && noteContent.trim() ? "#fff" : T.textTer, fontWeight: 700, fontSize: 13, border: "none", cursor: noteTitle.trim() && noteTitle !== " " && noteContent.trim() ? "pointer" : "not-allowed" }}>
              {editingNote ? "Update Note" : "Save Note"}
            </button>
            <button onClick={cancelEdit} style={{ padding: "8px 16px", borderRadius: T.r2, background: T.bgMuted, border: `1px solid ${T.border}`, color: T.textSec, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {notes.length === 0 && !noteTitle && (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <EmptyStateIllustration type="default" size={100} />
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginTop: 12, fontFamily: "'Bricolage Grotesque', sans-serif" }}>No notes yet</div>
          <div style={{ fontSize: 13, color: T.textTer, marginTop: 4 }}>Start taking notes to build your personal study resource.</div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {notes.map(n => {
          const theme = T[n.subject] || T.eng;
          return (
            <div key={n.id} className="card-hover" style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}`, borderLeft: `3px solid ${theme.accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{n.title}</div>
                  <div style={{ fontSize: 10, color: T.textTer }}>{getSubject(n.subject)?.name} · {n.updatedAt}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => startEdit(n)} style={{ padding: "4px 10px", borderRadius: T.r1, background: T.bgMuted, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, color: T.textSec }}>Edit</button>
                  <button onClick={() => { dispatch({ type: "DELETE_NOTE", payload: n.id }); dispatch({ type: "ADD_TOAST", payload: { message: "Note deleted", variant: "success" } }); }} style={{ padding: "4px 10px", borderRadius: T.r1, background: T.dangerBg, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, color: T.danger }}>Delete</button>
                </div>
              </div>
              <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 120, overflow: "hidden", maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)" }}>{n.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ━━━ MODEL ESSAY BANK PAGE ━━━ */
function ModelEssayBank({ state, dispatch }) {
  const [filterSubj, setFilterSubj] = useState("all");
  const [activeEssay, setActiveEssay] = useState(null);
  const filtered = filterSubj === "all" ? MODEL_ESSAYS : MODEL_ESSAYS.filter(e => e.subject === filterSubj);

  if (activeEssay) {
    const theme = T[activeEssay.subject] || T.eng;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
        <button onClick={() => setActiveEssay(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.textSec, padding: 0 }}>
          <ArrowLeft size={14} color={T.textSec} /> Back to essay bank
        </button>
        {/* Essay header */}
        <div style={{ background: theme.bg, borderRadius: T.r3, padding: "20px 22px", border: `1px solid ${theme.accent}22` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent, background: "#fff", padding: "2px 8px", borderRadius: 20 }}>{getSubject(activeEssay.subject)?.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.success, background: T.successBg, padding: "2px 8px", borderRadius: 20 }}>Grade {activeEssay.grade}</span>
            {activeEssay.band && <span style={{ fontSize: 10, fontWeight: 700, color: T.gold, background: T.goldLight, padding: "2px 8px", borderRadius: 20 }}>Band {activeEssay.band}</span>}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1.4 }}>{activeEssay.title}</div>
        </div>
        {/* Essay text */}
        <div style={{ background: "#FFFEF8", borderRadius: T.r3, padding: "28px 26px", border: "1px solid #E8E4D8", fontSize: 14, lineHeight: 2, color: T.text, whiteSpace: "pre-wrap", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {activeEssay.essay}
        </div>
        {/* Examiner feedback */}
        <div style={{ background: T.goldLight, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.gold}22` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.goldDark, marginBottom: 6 }}>📝 Why This Essay Scored Well</div>
          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>{activeEssay.feedback}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: T.gradPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Model Essay Bank</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>Study A-grade essays with examiner feedback to learn what excellence looks like</p>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button onClick={() => setFilterSubj("all")} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === "all" ? T.accent : T.border}`, background: filterSubj === "all" ? T.accentLight : T.bgCard, color: filterSubj === "all" ? T.accent : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>All</button>
        {SUBJECTS.map(s => (
          <button key={s.id} onClick={() => setFilterSubj(s.id)} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterSubj === s.id ? (T[s.id]?.accent || T.accent) : T.border}`, background: filterSubj === s.id ? (T[s.id]?.bg || T.accentLight) : T.bgCard, color: filterSubj === s.id ? (T[s.id]?.accent || T.accent) : T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>{s.name}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(e => {
          const theme = T[e.subject] || T.eng;
          return (
            <button key={e.id} onClick={() => setActiveEssay(e)} className="card-hover" style={{ display: "flex", gap: 14, padding: "16px 18px", background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, cursor: "pointer", textAlign: "left", borderLeft: `3px solid ${theme.accent}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent, background: theme.bg, padding: "2px 8px", borderRadius: 20 }}>{e.type}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.success, background: T.successBg, padding: "2px 8px", borderRadius: 20 }}>Grade {e.grade}</span>
                  {e.band && <span style={{ fontSize: 10, fontWeight: 700, color: T.gold, background: T.goldLight, padding: "2px 8px", borderRadius: 20 }}>Band {e.band}</span>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, lineHeight: 1.4, marginBottom: 4 }}>{e.title}</div>
                <div style={{ fontSize: 11, color: T.textTer }}>{e.essay.split(/\s+/).length} words · {getSubject(e.subject)?.name}</div>
              </div>
              <CaretRight size={16} color={T.textTer} style={{ alignSelf: "center", flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
      <div style={{ padding: "12px 16px", background: T.accentLight, borderRadius: T.r2, fontSize: 12, color: T.accentText, lineHeight: 1.6 }}>
        💡 <strong>Study tip:</strong> Don't just read model essays — actively annotate them. Identify the thesis, mark each PEEL paragraph, highlight the counter-argument, and note the vocabulary. Then try writing your own version of the same question.
      </div>
    </div>
  );
}

/* ━━━ WEEKLY PROGRESS SUMMARY ━━━ */
