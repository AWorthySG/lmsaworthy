// STUDIO — editorial / warm paper / serif headlines / calm focus
// Palette: cream paper, deep ink, oxblood accent. Spectral serif for display.
// No emojis. Iconography is restrained: small line glyphs or pure typography.

const studioColors = {
  paper: '#f1ebde',
  paperDeep: '#e7e0d0',
  ink: '#1d1916',
  inkSoft: '#5a5247',
  inkFaint: '#9c9384',
  rule: 'rgba(29,25,22,0.14)',
  oxblood: '#7a2418',
  oxbloodSoft: '#a8513d',
};

const studioStyles = {
  root: {
    width: '100%', height: '100%', background: studioColors.paper, color: studioColors.ink,
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontSize: 14, lineHeight: 1.45,
    display: 'grid', gridTemplateColumns: '240px 1fr', overflow: 'hidden',
  },
  side: {
    background: studioColors.paperDeep, borderRight: `1px solid ${studioColors.rule}`,
    padding: '28px 22px', display: 'flex', flexDirection: 'column', gap: 4,
  },
  brand: { display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 32 },
  brandMark: {
    fontFamily: 'Spectral, serif', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em',
    fontStyle: 'italic', color: studioColors.ink,
  },
  brandSub: { fontSize: 10, letterSpacing: '0.18em', color: studioColors.inkFaint, textTransform: 'uppercase' },
  navHead: { fontSize: 10, letterSpacing: '0.2em', color: studioColors.inkFaint, textTransform: 'uppercase', margin: '20px 0 6px' },
  navItem: { padding: '6px 8px', fontSize: 14, color: studioColors.inkSoft, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navItemActive: { padding: '6px 8px', fontSize: 14, color: studioColors.ink, borderRadius: 2, background: 'rgba(29,25,22,0.06)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navDot: (c) => ({ width: 6, height: 6, borderRadius: 6, background: c, display: 'inline-block', marginRight: 8 }),
  main: { padding: '32px 44px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 28 },
};

function StudioDashboard() {
  return (
    <div style={studioStyles.root}>
      {/* SIDEBAR */}
      <aside style={studioStyles.side}>
        <div style={studioStyles.brand}>
          <span style={studioStyles.brandMark}>A&nbsp;Worthy</span>
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', color: studioColors.inkFaint, textTransform: 'uppercase', marginBottom: 4 }}>est. Singapore</div>
        <div style={{ height: 1, background: studioColors.rule, margin: '4px 0 14px' }}></div>

        <div style={studioStyles.navItemActive}>Dashboard <span style={{ fontFamily: 'Spectral, serif', fontStyle: 'italic', color: studioColors.oxblood }}>·</span></div>
        <div style={studioStyles.navItem}>Live Classroom</div>
        <div style={studioStyles.navItem}>Notes</div>
        <div style={studioStyles.navItem}>Goals</div>
        <div style={studioStyles.navItem}>Mistake Journal</div>
        <div style={studioStyles.navItem}>Revision Checklist</div>

        <div style={studioStyles.navHead}>Subjects</div>
        <div style={studioStyles.navItem}><span><span style={studioStyles.navDot('#3b5bb5')}></span>O-Level English</span><span style={{ color: studioColors.inkFaint, fontSize: 11 }}>iv</span></div>
        <div style={studioStyles.navItem}><span><span style={studioStyles.navDot('#2f7a3e')}></span>H1 General Paper</span><span style={{ color: studioColors.inkFaint, fontSize: 11 }}>iii</span></div>
        <div style={studioStyles.navItem}><span><span style={studioStyles.navDot('#7a4a17')}></span>H1 Economics</span><span style={{ color: studioColors.inkFaint, fontSize: 11 }}>ii</span></div>
        <div style={studioStyles.navItem}><span><span style={studioStyles.navDot('#7a2418')}></span>H2 Economics</span><span style={{ color: studioColors.inkFaint, fontSize: 11 }}>v</span></div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, paddingTop: 18, borderTop: `1px solid ${studioColors.rule}` }}>
          <div style={{ width: 32, height: 32, borderRadius: 32, background: studioColors.ink, color: studioColors.paper, display: 'grid', placeItems: 'center', fontFamily: 'Spectral, serif', fontStyle: 'italic', fontSize: 16 }}>C</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Creator J.</div>
            <div style={{ fontSize: 10, color: studioColors.inkFaint, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Student · 2026</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={studioStyles.main}>
        {/* Masthead — newspaper style */}
        <header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `2px solid ${studioColors.ink}`, paddingBottom: 8, marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: studioColors.inkFaint }}>Vol. III · Thursday, 21 May 2026 · Singapore</div>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: studioColors.inkFaint }}>Study Hours: 0 · Coins: 0 · Streak: 0</div>
          </div>
          <h1 style={{ fontFamily: 'Spectral, serif', fontWeight: 400, fontSize: 56, lineHeight: 1.02, margin: 0, letterSpacing: '-0.02em' }}>
            One paper graded.<br />
            <em style={{ color: studioColors.oxblood, fontWeight: 400 }}>One essay overdue.</em>
          </h1>
          <div style={{ fontSize: 13, color: studioColors.inkSoft, marginTop: 10, maxWidth: 620 }}>
            A quiet evening. Begin where the work is heaviest — your Market Failure essay was due on the 28th of March.
          </div>
        </header>

        {/* Three-column editorial layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 32, borderTop: `1px solid ${studioColors.rule}`, paddingTop: 18 }}>
          {/* Column 1 — Daily Challenge as lede */}
          <article>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: studioColors.oxblood, fontWeight: 600 }}>Today's Challenge · Argumentative</div>
            <h2 style={{ fontFamily: 'Spectral, serif', fontWeight: 500, fontSize: 22, lineHeight: 1.15, margin: '8px 0 10px', letterSpacing: '-0.01em' }}>
              Should social media platforms be banned for under-16s?
            </h2>
            <p style={{ fontSize: 13, color: studioColors.inkSoft, margin: 0 }}>
              Draft a compelling opening paragraph. Stake a position by the second sentence; reserve evidence for the third. <span style={{ color: studioColors.inkFaint }}>Refreshes daily · earns 10 coins.</span>
            </p>
            <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, padding: '8px 14px', background: studioColors.ink, color: studioColors.paper, borderRadius: 2, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              Begin draft <span style={{ fontFamily: 'Spectral, serif', fontStyle: 'italic', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>→</span>
            </div>
          </article>

          {/* Column 2 — Word of the day, editorial */}
          <article>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: studioColors.inkFaint, fontWeight: 600 }}>Lexicon · O-Level English</div>
            <h2 style={{ fontFamily: 'Spectral, serif', fontWeight: 400, fontSize: 36, lineHeight: 1, margin: '8px 0 4px', letterSpacing: '-0.01em' }}>
              Ubiquitous
            </h2>
            <div style={{ fontFamily: 'Spectral, serif', fontStyle: 'italic', fontSize: 13, color: studioColors.inkFaint, marginBottom: 8 }}>
              /juːˈbɪkwɪtəs/ &nbsp;·&nbsp; adj.
            </div>
            <p style={{ fontSize: 13, color: studioColors.ink, margin: '0 0 8px' }}>Found everywhere; omnipresent.</p>
            <p style={{ fontFamily: 'Spectral, serif', fontStyle: 'italic', fontSize: 14, color: studioColors.inkSoft, margin: 0, borderLeft: `2px solid ${studioColors.oxblood}`, paddingLeft: 10 }}>
              Smartphones have become ubiquitous in modern classrooms, raising concerns about distraction.
            </p>
          </article>

          {/* Column 3 — Homework / Overdue */}
          <article>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: studioColors.inkFaint, fontWeight: 600 }}>On Your Desk</div>

            <div style={{ marginTop: 8, paddingBottom: 12, borderBottom: `1px solid ${studioColors.rule}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'Spectral, serif', fontSize: 17, lineHeight: 1.2, fontWeight: 500 }}>Market Failure Essay</div>
                <div style={{ fontSize: 10, color: studioColors.oxblood, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>Overdue</div>
              </div>
              <div style={{ fontSize: 12, color: studioColors.inkSoft, marginTop: 2 }}>H2 Economics · Externalities · 28 Mar</div>
            </div>

            <div style={{ marginTop: 12, paddingBottom: 12, borderBottom: `1px solid ${studioColors.rule}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'Spectral, serif', fontSize: 17, lineHeight: 1.2, fontWeight: 500 }}>GP Paper 1 Timed Essay</div>
                <div style={{ fontSize: 10, color: studioColors.inkSoft, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Graded · A−</div>
              </div>
              <div style={{ fontSize: 12, color: studioColors.inkSoft, marginTop: 2 }}>H1 General Paper · Technology · 18 May</div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'Spectral, serif', fontSize: 17, lineHeight: 1.2, fontWeight: 500 }}>Comprehension Drill, set 4</div>
                <div style={{ fontSize: 10, color: studioColors.inkSoft, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Due 24 May</div>
              </div>
              <div style={{ fontSize: 12, color: studioColors.inkSoft, marginTop: 2 }}>O-Level English · Paper 2</div>
            </div>
          </article>
        </div>

        {/* Exam countdown — typographic, no cards */}
        <section>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: studioColors.inkFaint, fontWeight: 600, marginBottom: 10 }}>Countdowns</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `1px solid ${studioColors.ink}`, borderBottom: `1px solid ${studioColors.ink}` }}>
            {[
              { d: 151, name: 'O-Level English', paper: 'Paper 1' },
              { d: 152, name: 'O-Level English', paper: 'Paper 2' },
              { d: 172, name: 'A-Level GP',      paper: 'Paper 1' },
            ].map((x, i) => (
              <div key={i} style={{ padding: '18px 22px 16px', borderLeft: i ? `1px solid ${studioColors.rule}` : 'none', display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <div style={{ fontFamily: 'Spectral, serif', fontSize: 64, lineHeight: 0.9, fontWeight: 400, letterSpacing: '-0.04em' }}>{x.d}</div>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: studioColors.inkFaint }}>Days remaining</div>
                  <div style={{ fontFamily: 'Spectral, serif', fontSize: 16, fontStyle: 'italic', marginTop: 2 }}>{x.name}, {x.paper}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

window.StudioDashboard = StudioDashboard;
