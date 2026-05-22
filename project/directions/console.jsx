// CONSOLE — terminal / monospace / dense data / dark mode
// Palette: near-black bg, off-white text, green & amber signal colors.
// Tabular data, ASCII-ish dividers, no decorative elements.

const consoleColors = {
  bg: '#0d100f',
  bgPanel: '#13171a',
  bgRow: '#181c20',
  ink: '#e6e8e1',
  inkSoft: '#94a0a8',
  inkFaint: '#5e6a70',
  rule: 'rgba(230,232,225,0.10)',
  green: '#7fbf6a',
  amber: '#e3a93a',
  red: '#e35d4a',
  blue: '#6aa9e3',
  violet: '#a48ce3',
};

const consoleStyles = {
  root: {
    width: '100%', height: '100%', background: consoleColors.bg, color: consoleColors.ink,
    fontFamily: '"JetBrains Mono", ui-monospace, Menlo, monospace', fontSize: 12, lineHeight: 1.45,
    display: 'grid', gridTemplateColumns: '220px 1fr', overflow: 'hidden',
    fontFeatureSettings: '"liga", "calt"',
  },
  side: {
    background: consoleColors.bgPanel, borderRight: `1px solid ${consoleColors.rule}`,
    padding: 14, display: 'flex', flexDirection: 'column', gap: 2, fontSize: 12,
  },
  navItem: (active, color) => ({
    padding: '4px 8px', color: active ? consoleColors.ink : consoleColors.inkSoft,
    background: active ? consoleColors.bgRow : 'transparent',
    borderLeft: `2px solid ${active ? (color || consoleColors.green) : 'transparent'}`,
    display: 'flex', justifyContent: 'space-between', gap: 8,
  }),
  main: { padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
};

function Row({ cells, kind }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cells.map(c => c.w).join(' '), padding: '6px 18px', borderBottom: `1px solid ${consoleColors.rule}`, background: kind === 'alt' ? consoleColors.bgRow : 'transparent', alignItems: 'center', gap: 12 }}>
      {cells.map((c, i) => (
        <div key={i} style={{ color: c.color || consoleColors.ink, fontWeight: c.bold ? 600 : 400, fontSize: c.size || 12, textAlign: c.align || 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {c.v}
        </div>
      ))}
    </div>
  );
}

function ConsoleDashboard() {
  return (
    <div style={consoleStyles.root}>
      {/* SIDEBAR */}
      <aside style={consoleStyles.side}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 12px', borderBottom: `1px solid ${consoleColors.rule}`, marginBottom: 8 }}>
          <span style={{ color: consoleColors.green }}>▶</span>
          <span style={{ fontWeight: 700 }}>a-worthy</span>
          <span style={{ color: consoleColors.inkFaint }}>v2.1</span>
        </div>

        <div style={{ color: consoleColors.inkFaint, fontSize: 11, padding: '6px 4px 4px' }}>── core ──</div>
        <div style={consoleStyles.navItem(true,  consoleColors.green)}>$ dashboard <span style={{ color: consoleColors.inkFaint }}>1↑</span></div>
        <div style={consoleStyles.navItem(false)}>$ live <span style={{ color: consoleColors.inkFaint }}>·</span></div>
        <div style={consoleStyles.navItem(false)}>$ notes</div>
        <div style={consoleStyles.navItem(false)}>$ goals</div>
        <div style={consoleStyles.navItem(false)}>$ mistakes <span style={{ color: consoleColors.amber }}>4</span></div>
        <div style={consoleStyles.navItem(false)}>$ checklist</div>

        <div style={{ color: consoleColors.inkFaint, fontSize: 11, padding: '14px 4px 4px' }}>── subjects ──</div>
        <div style={consoleStyles.navItem(false, consoleColors.blue)}><span><span style={{ color: consoleColors.blue }}>●</span> o-level/eng</span><span style={{ color: consoleColors.inkFaint }}>4</span></div>
        <div style={consoleStyles.navItem(false, consoleColors.green)}><span><span style={{ color: consoleColors.green }}>●</span> h1/gp</span><span style={{ color: consoleColors.inkFaint }}>3</span></div>
        <div style={consoleStyles.navItem(false, consoleColors.amber)}><span><span style={{ color: consoleColors.amber }}>●</span> h1/econ</span><span style={{ color: consoleColors.inkFaint }}>2</span></div>
        <div style={consoleStyles.navItem(false, consoleColors.red)}><span><span style={{ color: consoleColors.red }}>●</span> h2/econ</span><span style={{ color: consoleColors.inkFaint }}>5</span></div>

        <div style={{ color: consoleColors.inkFaint, fontSize: 11, padding: '14px 4px 4px' }}>── engage ──</div>
        <div style={consoleStyles.navItem(false)}>$ events</div>
        <div style={consoleStyles.navItem(false)}>$ leaderboard</div>
        <div style={consoleStyles.navItem(false)}>$ peer-review</div>
        <div style={consoleStyles.navItem(false)}>$ community</div>

        <div style={{ marginTop: 'auto', padding: '12px 4px 0', borderTop: `1px solid ${consoleColors.rule}`, color: consoleColors.inkFaint, fontSize: 11 }}>
          <div>user: <span style={{ color: consoleColors.ink }}>creator_j</span></div>
          <div>role: student</div>
          <div>uptime: 0d 00:00 <span style={{ color: consoleColors.amber }}>⚠ low</span></div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={consoleStyles.main}>
        {/* status bar */}
        <div style={{ height: 30, borderBottom: `1px solid ${consoleColors.rule}`, display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 11, gap: 18 }}>
          <span style={{ color: consoleColors.green }}>● connected</span>
          <span style={{ color: consoleColors.inkSoft }}>creator_j@a-worthy:~/dashboard$</span>
          <span style={{ marginLeft: 'auto', color: consoleColors.inkSoft }}>Thu 21-May-2026 20:57:34 SGT</span>
          <span style={{ color: consoleColors.amber }}>● 1 pending</span>
        </div>

        {/* greeting / stats block */}
        <section style={{ padding: '20px 18px 12px', borderBottom: `1px solid ${consoleColors.rule}` }}>
          <pre style={{ margin: 0, color: consoleColors.green, fontSize: 12, lineHeight: 1.25 }}>{`┌─ session ─────────────────────────────────────────────────────────────────┐
│  >> hello creator. evening session #001.                                 │
│  >> 1 task waiting · 1 essay overdue · streak resets at 24:00 SGT.       │
└──────────────────────────────────────────────────────────────────────────┘`}</pre>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, marginTop: 14, border: `1px solid ${consoleColors.rule}` }}>
            {[
              { l: 'COINS',   v: '0',     c: consoleColors.amber },
              { l: 'STREAK',  v: '0d',    c: consoleColors.red },
              { l: 'GRADED',  v: '2',     c: consoleColors.green },
              { l: 'LEVEL',   v: 'L1',    c: consoleColors.violet },
              { l: 'XP / NXT', v: '40/200', c: consoleColors.blue },
              { l: 'RANK',    v: '#847',  c: consoleColors.inkSoft },
            ].map((x, i) => (
              <div key={i} style={{ padding: '8px 12px', borderRight: i < 5 ? `1px solid ${consoleColors.rule}` : 'none' }}>
                <div style={{ fontSize: 10, color: consoleColors.inkFaint }}>{x.l}</div>
                <div style={{ fontSize: 22, color: x.c, fontWeight: 600, letterSpacing: '-0.02em' }}>{x.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* countdown — terminal table */}
        <section style={{ borderBottom: `1px solid ${consoleColors.rule}` }}>
          <div style={{ padding: '10px 18px 6px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: consoleColors.green }}>$ exam --countdown --upcoming</span>
            <span style={{ color: consoleColors.inkFaint }}>3 results · 0.04s</span>
          </div>
          <Row cells={[
            { v: 'PAPER',     w: '2fr', size: 10, color: consoleColors.inkFaint, bold: true },
            { v: 'SUBJECT',   w: '1.2fr', size: 10, color: consoleColors.inkFaint, bold: true },
            { v: 'BOARD',     w: '1fr', size: 10, color: consoleColors.inkFaint, bold: true },
            { v: 'DAYS',      w: '0.8fr', size: 10, color: consoleColors.inkFaint, bold: true, align: 'right' },
            { v: 'STATUS',    w: '1fr', size: 10, color: consoleColors.inkFaint, bold: true, align: 'right' },
          ]} />
          <Row cells={[
            { v: 'O-Level English · Paper 1',  w: '2fr' },
            { v: 'eng/p1',                     w: '1.2fr', color: consoleColors.blue },
            { v: 'MOE/SEAB',                   w: '1fr',   color: consoleColors.inkSoft },
            { v: '151',                        w: '0.8fr', align: 'right', color: consoleColors.green, bold: true, size: 14 },
            { v: '── on track',                w: '1fr',   align: 'right', color: consoleColors.green },
          ]} kind="alt" />
          <Row cells={[
            { v: 'O-Level English · Paper 2',  w: '2fr' },
            { v: 'eng/p2',                     w: '1.2fr', color: consoleColors.blue },
            { v: 'MOE/SEAB',                   w: '1fr',   color: consoleColors.inkSoft },
            { v: '152',                        w: '0.8fr', align: 'right', color: consoleColors.green, bold: true, size: 14 },
            { v: '── on track',                w: '1fr',   align: 'right', color: consoleColors.green },
          ]} />
          <Row cells={[
            { v: 'A-Level GP · Paper 1',       w: '2fr' },
            { v: 'gp/p1',                      w: '1.2fr', color: consoleColors.green },
            { v: 'CAIE',                       w: '1fr',   color: consoleColors.inkSoft },
            { v: '172',                        w: '0.8fr', align: 'right', color: consoleColors.amber, bold: true, size: 14 },
            { v: '── light work',              w: '1fr',   align: 'right', color: consoleColors.amber },
          ]} kind="alt" />
        </section>

        {/* dual table — homework + plan */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', flex: 1, minHeight: 0 }}>
          <div style={{ borderRight: `1px solid ${consoleColors.rule}` }}>
            <div style={{ padding: '10px 18px 6px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: consoleColors.green }}>$ homework --status</span>
              <span style={{ color: consoleColors.inkFaint }}>tail -n 4</span>
            </div>
            <Row cells={[
              { v: 'TITLE', w: '2fr', size: 10, color: consoleColors.inkFaint, bold: true },
              { v: 'DUE',   w: '1fr', size: 10, color: consoleColors.inkFaint, bold: true },
              { v: 'STATUS', w: '1fr', size: 10, color: consoleColors.inkFaint, bold: true, align: 'right' },
            ]} />
            <Row cells={[
              { v: 'Market Failure Essay — Externalities', w: '2fr' },
              { v: '2026-03-28', w: '1fr', color: consoleColors.inkSoft },
              { v: '!! OVERDUE', w: '1fr', color: consoleColors.red, align: 'right', bold: true },
            ]} kind="alt" />
            <Row cells={[
              { v: 'Comprehension Drill, set 4', w: '2fr' },
              { v: '2026-05-24', w: '1fr', color: consoleColors.inkSoft },
              { v: 'due in 3d', w: '1fr', color: consoleColors.amber, align: 'right' },
            ]} />
            <Row cells={[
              { v: 'GP Paper 1 Timed Essay — Tech', w: '2fr' },
              { v: '2026-05-18', w: '1fr', color: consoleColors.inkSoft },
              { v: 'graded A-', w: '1fr', color: consoleColors.green, align: 'right' },
            ]} kind="alt" />
            <Row cells={[
              { v: 'Vocab Quiz — set 17', w: '2fr' },
              { v: '2026-05-10', w: '1fr', color: consoleColors.inkSoft },
              { v: 'graded 92%', w: '1fr', color: consoleColors.green, align: 'right' },
            ]} />

            <div style={{ padding: '14px 18px', color: consoleColors.green, fontSize: 12 }}>
              <span style={{ color: consoleColors.inkFaint }}>// daily challenge</span><br/>
              <span style={{ color: consoleColors.amber }}>$</span> challenge --run<br/>
              <span style={{ color: consoleColors.ink }}>&gt; "Should social media platforms be banned for under-16s?"</span><br/>
              <span style={{ color: consoleColors.inkSoft }}>&gt; write opening · reward +10 coins · </span>
              <span style={{ color: consoleColors.green, borderBottom: `1px solid ${consoleColors.green}` }}>[begin]</span>
              <span style={{ color: consoleColors.inkFaint }}> &nbsp;_</span>
            </div>
          </div>

          <div>
            <div style={{ padding: '10px 18px 6px' }}>
              <span style={{ color: consoleColors.green }}>$ plan --week</span>
            </div>
            {[
              { d: 'thu/21', s: 'eng', c: consoleColors.blue,   t: 'drills 25m · essay 45m' },
              { d: 'fri/22', s: 'gp',  c: consoleColors.green,  t: 'example 15m · video 20m' },
              { d: 'sat/23', s: 'ec1', c: consoleColors.amber,  t: 'essay 45m · game 15m' },
              { d: 'sun/24', s: 'ec2', c: consoleColors.red,    t: 'video 20m · paper 60m' },
              { d: 'mon/25', s: 'eng', c: consoleColors.blue,   t: 'game 15m · drills 25m' },
              { d: 'tue/26', s: 'gp',  c: consoleColors.green,  t: 'planning 30m' },
              { d: 'wed/27', s: 'ec2', c: consoleColors.red,    t: 'mock 90m' },
            ].map((x, i) => (
              <Row key={i} cells={[
                { v: x.d, w: '60px', color: consoleColors.inkSoft },
                { v: x.s, w: '50px', color: x.c, bold: true },
                { v: x.t, w: '1fr',  color: consoleColors.ink },
              ]} kind={i % 2 ? 'alt' : ''} />
            ))}
            <div style={{ padding: '10px 18px', fontSize: 11, color: consoleColors.inkFaint }}>
              ─ 7 days · 4h 30m planned · <span style={{ color: consoleColors.green }}>[ + ] add slot</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

window.ConsoleDashboard = ConsoleDashboard;
