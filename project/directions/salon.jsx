// SALON — modern academic / prep school / sophisticated
// Palette: warm cream, deep forest green, brass accent, ink. Caslon serif + Manrope sans.
// Feels like a fine sixth-form prospectus. Considered, calm, expensive.

const salonColors = {
  bg: '#f6f1e7',
  bgSoft: '#ece4d2',
  bgDeep: '#1b2a23',         // forest panel
  ink: '#1a1814',
  inkSoft: '#5d544a',
  inkFaint: '#9a8f7c',
  green: '#2c4d3a',
  greenSoft: '#476757',
  brass: '#a07a2e',
  brassSoft: '#c79a45',
  rule: 'rgba(26,24,20,0.16)',
};

const salonStyles = {
  root: {
    width: '100%', height: '100%', background: salonColors.bg, color: salonColors.ink,
    fontFamily: 'Manrope, system-ui, sans-serif', fontSize: 13, lineHeight: 1.5,
    display: 'grid', gridTemplateColumns: '260px 1fr', overflow: 'hidden',
  },
  side: {
    background: salonColors.bgDeep, color: '#e9e2ce', padding: '24px 22px',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  navItem: (active) => ({
    padding: '7px 10px', borderRadius: 6, fontSize: 13,
    background: active ? 'rgba(199,154,69,0.16)' : 'transparent',
    color: active ? '#f6e9c8' : 'rgba(233,226,206,0.78)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderLeft: active ? `2px solid ${salonColors.brassSoft}` : '2px solid transparent',
    fontWeight: active ? 600 : 500,
  }),
  main: { padding: '28px 40px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 22 },
};

function SalonDashboard() {
  return (
    <div style={salonStyles.root}>
      {/* SIDEBAR */}
      <aside style={salonStyles.side}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: 22, color: '#f6e9c8', letterSpacing: '-0.005em' }}>A&thinsp;Worthy</div>
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: salonColors.brassSoft, marginBottom: 20 }}>Singapore · MMXX</div>

        <div style={salonStyles.navItem(true)}><span>Dashboard</span></div>
        <div style={salonStyles.navItem(false)}><span>Live Classroom</span><span style={{ fontSize: 11, color: salonColors.brassSoft }}>3</span></div>
        <div style={salonStyles.navItem(false)}><span>Notes</span></div>
        <div style={salonStyles.navItem(false)}><span>Goals</span></div>
        <div style={salonStyles.navItem(false)}><span>Mistake Journal</span><span style={{ fontSize: 11, color: 'rgba(233,226,206,0.5)' }}>4</span></div>
        <div style={salonStyles.navItem(false)}><span>Revision Checklist</span></div>

        <div style={{ fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: 13, color: salonColors.brassSoft, padding: '20px 10px 6px', borderTop: '1px solid rgba(233,226,206,0.12)', marginTop: 18 }}>
          Reading List
        </div>
        <div style={salonStyles.navItem(false)}><span>O-Level English</span></div>
        <div style={salonStyles.navItem(false)}><span>H1 General Paper</span></div>
        <div style={salonStyles.navItem(false)}><span>H1 Economics</span></div>
        <div style={salonStyles.navItem(false)}><span>H2 Economics</span></div>

        <div style={{ marginTop: 'auto', padding: '16px 0 4px', borderTop: '1px solid rgba(233,226,206,0.12)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 38, background: salonColors.brassSoft, color: salonColors.bgDeep, display: 'grid', placeItems: 'center', fontFamily: '"Libre Caslon Text", serif', fontSize: 18, fontWeight: 700 }}>C</div>
          <div>
            <div style={{ fontWeight: 600, color: '#f6e9c8' }}>Creator J.</div>
            <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: salonColors.brassSoft }}>Form V · Student</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={salonStyles.main}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: `1px solid ${salonColors.rule}`, paddingBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: salonColors.brass, fontWeight: 700 }}>Term III · Week 21 · Thursday</div>
            <h1 style={{ fontFamily: '"Libre Caslon Text", serif', fontWeight: 400, fontSize: 44, lineHeight: 1.05, margin: '8px 0 0', letterSpacing: '-0.015em' }}>
              Welcome back, <em>Creator</em>.
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={{ background: 'transparent', border: `1px solid ${salonColors.rule}`, padding: '8px 14px', borderRadius: 999, fontSize: 12, fontFamily: 'inherit', color: salonColors.inkSoft }}>Search ⌘K</button>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${salonColors.rule}`, display: 'grid', placeItems: 'center', color: salonColors.inkSoft }}>◐</div>
              <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: 10, background: salonColors.brass, border: `2px solid ${salonColors.bg}` }}></div>
            </div>
          </div>
        </header>

        {/* Featured row: today's brief + countdown */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 28 }}>
          {/* Today's brief — green panel */}
          <div style={{ background: salonColors.bgDeep, color: '#e9e2ce', borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 16, right: 22, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: salonColors.brassSoft, fontWeight: 700 }}>
              Today's Brief · 21 May
            </div>
            <div style={{ fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: 16, color: salonColors.brassSoft, marginTop: 22 }}>Daily Challenge</div>
            <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: 30, lineHeight: 1.15, marginTop: 4, letterSpacing: '-0.01em' }}>
              "Should social media platforms be banned for under-16s?"
            </div>
            <div style={{ fontSize: 13, color: 'rgba(233,226,206,0.7)', marginTop: 12, maxWidth: 480 }}>
              An argumentative opener — your strongest device this week has been concession. Try leading with the strongest objection, then turning it.
            </div>
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <button style={{ background: salonColors.brassSoft, color: salonColors.bgDeep, border: 'none', padding: '11px 22px', borderRadius: 999, fontWeight: 700, fontSize: 13, fontFamily: 'inherit', letterSpacing: '0.02em' }}>
                Begin the Brief
              </button>
              <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: salonColors.brassSoft }}>+10 coins · refreshes 24:00</div>
            </div>

            {/* Decorative monogram corner */}
            <div style={{ position: 'absolute', right: -20, bottom: -50, fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: 220, lineHeight: 1, color: 'rgba(199,154,69,0.10)', userSelect: 'none' }}>aw</div>
          </div>

          {/* Countdown stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: salonColors.brass, fontWeight: 700 }}>Examinations</div>
            {[
              { d: 151, name: 'O-Level English', p: 'Paper 1', tone: salonColors.green },
              { d: 152, name: 'O-Level English', p: 'Paper 2', tone: salonColors.green },
              { d: 172, name: 'A-Level GP',      p: 'Paper 1', tone: salonColors.brass },
            ].map((x, i) => (
              <div key={i} style={{ background: salonColors.bgSoft, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, border: `1px solid ${salonColors.rule}` }}>
                <div style={{ width: 4, alignSelf: 'stretch', background: x.tone, borderRadius: 4 }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: 16, lineHeight: 1.1 }}>{x.name}</div>
                  <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: salonColors.inkFaint, marginTop: 2 }}>{x.p}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: '"Libre Caslon Text", serif', fontWeight: 700, fontSize: 32, lineHeight: 1, color: salonColors.green, letterSpacing: '-0.02em' }}>{x.d}</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: salonColors.inkFaint, marginTop: 2 }}>days</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lower row — Word + Homework */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 28, flex: 1, minHeight: 0 }}>
          {/* Word of the day */}
          <div style={{ background: salonColors.bgSoft, borderRadius: 16, padding: 24, border: `1px solid ${salonColors.rule}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: salonColors.brass, fontWeight: 700 }}>From the Lexicon</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
              <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: 46, lineHeight: 1, letterSpacing: '-0.02em' }}>Ubiquitous</div>
            </div>
            <div style={{ fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: 14, color: salonColors.inkFaint, marginTop: 4 }}>
              /juːˈbɪkwɪtəs/ · adj.
            </div>
            <div style={{ fontSize: 14, color: salonColors.ink, marginTop: 10 }}>
              Found everywhere; omnipresent.
            </div>
            <div style={{ fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: 14, color: salonColors.inkSoft, marginTop: 14, paddingLeft: 12, borderLeft: `2px solid ${salonColors.brassSoft}` }}>
              "Smartphones have become ubiquitous in modern classrooms, raising concerns about distraction."
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['prevalent', 'pervasive', 'omnipresent', 'rife'].map((s, i) => (
                <span key={i} style={{ padding: '4px 10px', background: salonColors.bg, border: `1px solid ${salonColors.rule}`, borderRadius: 999, fontSize: 11, color: salonColors.inkSoft, fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Homework agenda */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <h3 style={{ fontFamily: '"Libre Caslon Text", serif', fontWeight: 400, fontSize: 22, margin: 0, letterSpacing: '-0.01em' }}>Your Agenda</h3>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: salonColors.brass, fontWeight: 700 }}>4 entries</div>
            </div>
            <div style={{ background: salonColors.bgSoft, border: `1px solid ${salonColors.rule}`, borderRadius: 14, overflow: 'hidden' }}>
              {[
                { date: '28 Mar', subject: 'H2 Economics', title: 'Market Failure Essay — Externalities', status: 'Overdue', tone: '#9c2e1f', bold: true },
                { date: '24 May', subject: 'O-Level Eng',  title: 'Comprehension Drill, set 4',         status: 'Due in 3 days', tone: salonColors.brass },
                { date: '18 May', subject: 'H1 GP',        title: 'GP Paper 1 Timed Essay — Tech',       status: 'Graded · A−', tone: salonColors.green },
                { date: '10 May', subject: 'O-Level Eng',  title: 'Vocab Quiz · set 17',                 status: 'Graded · 92%', tone: salonColors.green },
              ].map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 130px', alignItems: 'center', gap: 16, padding: '14px 18px', borderTop: i ? `1px solid ${salonColors.rule}` : 'none' }}>
                  <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: 18, color: salonColors.green, fontWeight: r.bold ? 700 : 400, letterSpacing: '-0.01em' }}>{r.date}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                    <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: salonColors.inkFaint, marginTop: 2 }}>{r.subject}</div>
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', textAlign: 'right', color: r.tone, fontWeight: 700 }}>{r.status}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

window.SalonDashboard = SalonDashboard;
