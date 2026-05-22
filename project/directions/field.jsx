// FIELD — Notion-minimal / very functional / mostly typography
// Palette: off-white, near-black, tiny accent dots. Sans only.
// Density without ornament. Tables not cards. No emojis. Microscopic line icons (SVG).

const fieldColors = {
  bg: '#fbfbfa',
  bgRow: '#f4f3f0',
  ink: '#1f1d1a',
  inkSoft: '#5e5a52',
  inkFaint: '#a09a8e',
  rule: 'rgba(31,29,26,0.10)',
  ruleStrong: 'rgba(31,29,26,0.20)',
  blue: '#3766c3',
  green: '#3f8c5b',
  amber: '#b07a1c',
  red: '#b8412a',
  violet: '#7050b8',
};

const fieldStyles = {
  root: {
    width: '100%', height: '100%', background: fieldColors.bg, color: fieldColors.ink,
    fontFamily: 'Manrope, system-ui, sans-serif', fontSize: 13, lineHeight: 1.45,
    display: 'grid', gridTemplateColumns: '230px 1fr', overflow: 'hidden',
  },
  side: {
    padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 1,
    borderRight: `1px solid ${fieldColors.rule}`,
  },
  navItem: (active) => ({
    padding: '5px 8px', borderRadius: 4, fontSize: 13.5,
    background: active ? 'rgba(31,29,26,0.06)' : 'transparent',
    color: fieldColors.ink, fontWeight: active ? 600 : 500,
    display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between',
  }),
  main: { padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
};

// Tiny line-icon set (12px). No emoji.
const Ico = {
  home:    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 6l5-4 5 4v6H2z"/></svg>,
  live:    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="2"/><path d="M3 7a4 4 0 014-4M11 7a4 4 0 01-4 4"/></svg>,
  doc:     <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 1h6l3 3v9H3z"/><path d="M9 1v3h3"/></svg>,
  target:  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5"/><circle cx="7" cy="7" r="2"/></svg>,
  book:    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 2h8a2 2 0 012 2v9H4a2 2 0 01-2-2z"/></svg>,
  check:   <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 7l3 3 5-6"/></svg>,
  chev:    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 3l4 3-4 3"/></svg>,
  plus:    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 2v8M2 6h8"/></svg>,
  flame:   <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M7 2c1 2 3 3 3 6a3 3 0 11-6 0c0-2 2-3 3-6z"/></svg>,
  arrow:   <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 6h6M6 3l3 3-3 3"/></svg>,
  search:  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="6" cy="6" r="4"/><path d="M9 9l3 3"/></svg>,
};

function FieldDashboard() {
  const SubjectDot = ({ c }) => <span style={{ width: 6, height: 6, borderRadius: 6, background: c, display: 'inline-block', flexShrink: 0 }}></span>;

  return (
    <div style={fieldStyles.root}>
      {/* SIDEBAR */}
      <aside style={fieldStyles.side}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 14px' }}>
          <div style={{ width: 22, height: 22, background: fieldColors.ink, color: fieldColors.bg, borderRadius: 5, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11, letterSpacing: '-0.02em' }}>Aw</div>
          <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>A Worthy</div>
          <div style={{ marginLeft: 'auto', color: fieldColors.inkFaint }}>{Ico.chev}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 5, background: fieldColors.bgRow, color: fieldColors.inkSoft, fontSize: 12.5, margin: '0 0 10px' }}>
          {Ico.search}<span>Search or jump to…</span><span style={{ marginLeft: 'auto', fontSize: 11, color: fieldColors.inkFaint, border: `1px solid ${fieldColors.rule}`, padding: '0 5px', borderRadius: 3 }}>⌘K</span>
        </div>

        <div style={fieldStyles.navItem(true)}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{Ico.home}Dashboard</span></div>
        <div style={fieldStyles.navItem(false)}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{Ico.live}Live Classroom</span><span style={{ color: fieldColors.inkFaint, fontSize: 11 }}>3</span></div>
        <div style={fieldStyles.navItem(false)}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{Ico.doc}Notes</span></div>
        <div style={fieldStyles.navItem(false)}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{Ico.target}Goals</span></div>
        <div style={fieldStyles.navItem(false)}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{Ico.book}Mistake Journal</span><span style={{ color: fieldColors.inkFaint, fontSize: 11 }}>4</span></div>
        <div style={fieldStyles.navItem(false)}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{Ico.check}Revision Checklist</span></div>

        <div style={{ fontSize: 11, color: fieldColors.inkFaint, padding: '14px 8px 4px', fontWeight: 600, letterSpacing: '0.02em' }}>SUBJECTS</div>
        <div style={fieldStyles.navItem(false)}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SubjectDot c={fieldColors.blue}/>O-Level English</span><span style={{ color: fieldColors.inkFaint }}>{Ico.chev}</span></div>
        <div style={fieldStyles.navItem(false)}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SubjectDot c={fieldColors.green}/>H1 General Paper</span><span style={{ color: fieldColors.inkFaint }}>{Ico.chev}</span></div>
        <div style={fieldStyles.navItem(false)}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SubjectDot c={fieldColors.amber}/>H1 Economics</span><span style={{ color: fieldColors.inkFaint }}>{Ico.chev}</span></div>
        <div style={fieldStyles.navItem(false)}><span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SubjectDot c={fieldColors.red}/>H2 Economics</span><span style={{ color: fieldColors.inkFaint }}>{Ico.chev}</span></div>

        <div style={{ fontSize: 11, color: fieldColors.inkFaint, padding: '14px 8px 4px', fontWeight: 600, letterSpacing: '0.02em' }}>ENGAGE</div>
        <div style={fieldStyles.navItem(false)}>Events & Prizes</div>
        <div style={fieldStyles.navItem(false)}>Leaderboard</div>
        <div style={fieldStyles.navItem(false)}>Peer Review</div>
        <div style={fieldStyles.navItem(false)}>Community</div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderTop: `1px solid ${fieldColors.rule}` }}>
          <div style={{ width: 24, height: 24, borderRadius: 5, background: fieldColors.violet, color: fieldColors.bg, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11 }}>C</div>
          <div style={{ fontSize: 12.5 }}>
            <div style={{ fontWeight: 600 }}>Creator J.</div>
            <div style={{ color: fieldColors.inkFaint, fontSize: 11 }}>Student · 4 subjects</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={fieldStyles.main}>
        {/* breadcrumb bar */}
        <div style={{ height: 38, borderBottom: `1px solid ${fieldColors.rule}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 8, fontSize: 12.5, color: fieldColors.inkSoft }}>
          <span>Workspace</span>
          <span style={{ color: fieldColors.inkFaint }}>/</span>
          <span style={{ color: fieldColors.ink, fontWeight: 600 }}>Dashboard</span>
          <span style={{ marginLeft: 'auto', color: fieldColors.inkFaint, fontSize: 11 }}>Thu 21 May · 20:57</span>
        </div>

        {/* page header */}
        <header style={{ padding: '28px 24px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: fieldColors.inkFaint, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.02em' }}>
            DASHBOARD · WEEK 21
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.025em', margin: '6px 0 4px' }}>
            Hi, Creator
          </h1>
          <div style={{ fontSize: 14, color: fieldColors.inkSoft, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>1 task waiting today.</span>
            <span style={{ color: fieldColors.red, fontWeight: 600 }}>· 1 essay overdue.</span>
          </div>

          {/* inline stat row — text-first */}
          <div style={{ display: 'flex', gap: 22, marginTop: 16, flexWrap: 'wrap', fontSize: 13 }}>
            <div><span style={{ color: fieldColors.inkFaint }}>Coins </span><b>0</b></div>
            <div style={{ width: 1, background: fieldColors.rule }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ color: fieldColors.inkFaint }}>Streak </span><b>0d</b> <span style={{ color: fieldColors.inkFaint }}>{Ico.flame}</span></div>
            <div style={{ width: 1, background: fieldColors.rule }}></div>
            <div><span style={{ color: fieldColors.inkFaint }}>Graded </span><b>2</b></div>
            <div style={{ width: 1, background: fieldColors.rule }}></div>
            <div><span style={{ color: fieldColors.inkFaint }}>Level </span><b>1</b> <span style={{ color: fieldColors.inkFaint, fontSize: 11 }}>· 40/200 xp</span></div>
            <div style={{ width: 1, background: fieldColors.rule }}></div>
            <div><span style={{ color: fieldColors.inkFaint }}>Rank </span><b>#847</b></div>
          </div>
        </header>

        {/* Today's brief — quiet call-to-action */}
        <section style={{ margin: '0 24px 18px', padding: '14px 18px', background: fieldColors.bgRow, borderRadius: 8, border: `1px solid ${fieldColors.rule}`, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 3, alignSelf: 'stretch', background: fieldColors.violet, borderRadius: 3 }}></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: fieldColors.violet, textTransform: 'uppercase' }}>Daily Challenge · Argumentative</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>
              Should social media platforms be banned for under-16s?
            </div>
            <div style={{ fontSize: 12.5, color: fieldColors.inkSoft, marginTop: 2 }}>
              Write a compelling opener · +10 coins · refreshes 24:00
            </div>
          </div>
          <button style={{ background: fieldColors.ink, color: fieldColors.bg, border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 600, fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            Begin {Ico.arrow}
          </button>
        </section>

        {/* Two-column: countdown table + agenda table */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 0, flex: 1, minHeight: 0, borderTop: `1px solid ${fieldColors.rule}` }}>
          {/* Countdown */}
          <div style={{ borderRight: `1px solid ${fieldColors.rule}` }}>
            <div style={{ padding: '12px 24px 6px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em', color: fieldColors.inkSoft }}>Exam Countdown</div>
              <button style={{ background: 'transparent', border: 'none', color: fieldColors.inkFaint, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>{Ico.plus} Add</button>
            </div>
            <div style={{ padding: '0 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 70px', fontSize: 10.5, color: fieldColors.inkFaint, fontWeight: 600, padding: '8px 0', borderBottom: `1px solid ${fieldColors.rule}`, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                <span>Paper</span><span style={{ textAlign: 'right' }}>Days</span><span style={{ textAlign: 'right' }}>Status</span>
              </div>
              {[
                { s: 'O-Level English · P1', d: 151, c: fieldColors.blue, st: 'On track', stc: fieldColors.green },
                { s: 'O-Level English · P2', d: 152, c: fieldColors.blue, st: 'On track', stc: fieldColors.green },
                { s: 'A-Level GP · P1',      d: 172, c: fieldColors.green, st: 'Early',    stc: fieldColors.amber },
                { s: 'H2 Econ · P1',         d: 215, c: fieldColors.red,   st: 'Early',    stc: fieldColors.amber },
              ].map((x, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 70px', padding: '11px 0', borderBottom: `1px solid ${fieldColors.rule}`, alignItems: 'center', fontSize: 13.5 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><SubjectDot c={x.c}/>{x.s}</span>
                  <span style={{ textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{x.d}<span style={{ color: fieldColors.inkFaint, fontWeight: 400, fontSize: 11.5, marginLeft: 3 }}>d</span></span>
                  <span style={{ textAlign: 'right', fontSize: 11.5, color: x.stc, fontWeight: 600 }}>{x.st}</span>
                </div>
              ))}
            </div>

            {/* Word of the day — inline, list-like */}
            <div style={{ padding: '18px 24px 0' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em', color: fieldColors.inkSoft, marginBottom: 8 }}>Word of the Day</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>ubiquitous</div>
                <div style={{ fontSize: 12, color: fieldColors.inkFaint }}>/juːˈbɪkwɪtəs/ · adj.</div>
              </div>
              <div style={{ fontSize: 13, color: fieldColors.inkSoft, marginTop: 4 }}>Found everywhere; omnipresent.</div>
              <div style={{ fontSize: 12.5, color: fieldColors.inkFaint, marginTop: 6, paddingLeft: 10, borderLeft: `2px solid ${fieldColors.rule}` }}>
                e.g. "Smartphones have become ubiquitous in modern classrooms."
              </div>
            </div>
          </div>

          {/* Agenda */}
          <div>
            <div style={{ padding: '12px 24px 6px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em', color: fieldColors.inkSoft }}>Up Next</div>
              <div style={{ fontSize: 11.5, color: fieldColors.inkFaint }}>Sort by due ↑</div>
            </div>
            <div style={{ padding: '0 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 90px 90px', fontSize: 10.5, color: fieldColors.inkFaint, fontWeight: 600, padding: '8px 0', borderBottom: `1px solid ${fieldColors.rule}`, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                <span>Due</span><span>Title</span><span style={{ textAlign: 'right' }}>Subject</span><span style={{ textAlign: 'right' }}>Status</span>
              </div>
              {[
                { due: '28 Mar', title: 'Market Failure Essay — Externalities', subj: 'H2 Econ',     sc: fieldColors.red,   st: 'Overdue',   stc: fieldColors.red,   w: 700 },
                { due: '24 May', title: 'Comprehension Drill, set 4',          subj: 'O-Lv Eng',    sc: fieldColors.blue,  st: 'In 3 days', stc: fieldColors.amber },
                { due: '26 May', title: 'Notes — Demand & Supply',             subj: 'H1 Econ',     sc: fieldColors.amber, st: 'In 5 days', stc: fieldColors.inkSoft },
                { due: '18 May', title: 'GP Paper 1 Timed Essay — Tech',       subj: 'H1 GP',       sc: fieldColors.green, st: 'A−',         stc: fieldColors.green },
                { due: '10 May', title: 'Vocab Quiz · set 17',                  subj: 'O-Lv Eng',    sc: fieldColors.blue,  st: '92%',        stc: fieldColors.green },
                { due: '08 May', title: 'GP Example Review · Tech topic',      subj: 'H1 GP',       sc: fieldColors.green, st: 'Done',       stc: fieldColors.inkFaint },
              ].map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 90px 90px', padding: '10px 0', borderBottom: `1px solid ${fieldColors.rule}`, alignItems: 'center', fontSize: 13.5 }}>
                  <span style={{ color: fieldColors.inkSoft, fontVariantNumeric: 'tabular-nums', fontWeight: r.w || 500 }}>{r.due}</span>
                  <span style={{ fontWeight: r.w || 500 }}>{r.title}</span>
                  <span style={{ textAlign: 'right', display: 'inline-flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, fontSize: 12, color: fieldColors.inkSoft }}>
                    <SubjectDot c={r.sc}/>{r.subj}
                  </span>
                  <span style={{ textAlign: 'right', color: r.stc, fontWeight: 600, fontSize: 12 }}>{r.st}</span>
                </div>
              ))}
              <div style={{ padding: '12px 0', fontSize: 12, color: fieldColors.inkFaint, display: 'flex', alignItems: 'center', gap: 6 }}>
                {Ico.plus} New task
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

window.FieldDashboard = FieldDashboard;
