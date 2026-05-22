// ATLAS — Swiss / typographic / massive scale / single accent
// Palette: paper white, deep black, single signal red. Space Grotesk throughout.
// Grid-strict, big numerals as design elements, lots of horizontal rules.

const atlasColors = {
  bg: '#fafaf7',
  bgPanel: '#ffffff',
  ink: '#0a0a0a',
  inkSoft: '#525250',
  inkFaint: '#a3a39f',
  rule: '#0a0a0a',
  ruleSoft: 'rgba(10,10,10,0.12)',
  signal: '#e63a1a',
};

const atlasStyles = {
  root: {
    width: '100%', height: '100%', background: atlasColors.bg, color: atlasColors.ink,
    fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 13, lineHeight: 1.35,
    display: 'grid', gridTemplateColumns: '72px 1fr', overflow: 'hidden',
    fontFeatureSettings: '"ss01", "ss02", "tnum"',
  },
  rail: {
    background: atlasColors.bgPanel, borderRight: `1px solid ${atlasColors.rule}`,
    padding: '14px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  },
  railItem: (active) => ({
    width: 44, height: 44, display: 'grid', placeItems: 'center',
    fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
    color: active ? atlasColors.bg : atlasColors.ink,
    background: active ? atlasColors.ink : 'transparent',
  }),
  main: { padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  topbar: {
    height: 48, borderBottom: `1px solid ${atlasColors.rule}`,
    display: 'flex', alignItems: 'center', padding: '0 20px', gap: 24,
  },
};

function AtlasDashboard() {
  return (
    <div style={atlasStyles.root}>
      {/* Icon rail — letter-mark navigation, ultra-minimal */}
      <aside style={atlasStyles.rail}>
        <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 22, padding: '6px 0 18px', letterSpacing: '-0.04em' }}>A/W</div>
        <div style={atlasStyles.railItem(true)}>DSH</div>
        <div style={atlasStyles.railItem(false)}>LIV</div>
        <div style={atlasStyles.railItem(false)}>NTS</div>
        <div style={atlasStyles.railItem(false)}>GLS</div>
        <div style={atlasStyles.railItem(false)}>MST</div>
        <div style={atlasStyles.railItem(false)}>RVS</div>
        <div style={{ height: 1, width: 28, background: atlasColors.ruleSoft, margin: '10px 0' }}></div>
        <div style={atlasStyles.railItem(false)}>ENG</div>
        <div style={atlasStyles.railItem(false)}>GPR</div>
        <div style={atlasStyles.railItem(false)}>EC1</div>
        <div style={atlasStyles.railItem(false)}>EC2</div>
        <div style={{ marginTop: 'auto', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', writingMode: 'vertical-rl', transform: 'rotate(180deg)', padding: '14px 0', color: atlasColors.inkFaint }}>
          CREATOR · J · 26
        </div>
      </aside>

      {/* MAIN */}
      <main style={atlasStyles.main}>
        {/* Topbar */}
        <div style={atlasStyles.topbar}>
          <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Dashboard</div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18, fontSize: 12, color: atlasColors.inkSoft }}>
            <span>Thu 21 May 2026 · 20:57 SGT</span>
            <span>·</span>
            <span style={{ fontWeight: 700, color: atlasColors.ink }}>SEARCH ⌘K</span>
            <span style={{ width: 1, height: 24, background: atlasColors.rule }}></span>
            <span style={{ fontWeight: 700 }}>1 PENDING</span>
            <span style={{ width: 8, height: 8, background: atlasColors.signal, display: 'inline-block' }}></span>
          </div>
        </div>

        {/* HERO — massive numerals */}
        <section style={{ padding: '28px 24px 16px', borderBottom: `1px solid ${atlasColors.rule}`, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 36, alignItems: 'end' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: atlasColors.inkSoft }}>
              Student · Creator J · Wk 21 / 52
            </div>
            <div style={{ fontWeight: 700, fontSize: 96, lineHeight: 0.92, letterSpacing: '-0.045em', marginTop: 14 }}>
              Good evening.<br />
              <span style={{ color: atlasColors.signal }}>1 task</span> waiting.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: `1px solid ${atlasColors.rule}` }}>
            {[
              { v: '0',   k: 'COINS' },
              { v: '0',   k: 'STREAK' },
              { v: '2',   k: 'GRADED' },
              { v: 'L1',  k: 'LEVEL' },
            ].map((x, i) => (
              <div key={i} style={{ padding: '14px 10px 10px', borderLeft: i ? `1px solid ${atlasColors.ruleSoft}` : 'none' }}>
                <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>{x.v}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', marginTop: 6, color: atlasColors.inkSoft }}>{x.k}</div>
              </div>
            ))}
          </div>
        </section>

        {/* COUNTDOWN — huge number band */}
        <section style={{ borderBottom: `1px solid ${atlasColors.rule}` }}>
          <div style={{ padding: '12px 24px', borderBottom: `1px solid ${atlasColors.ruleSoft}`, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Countdown / National Exam Boards</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: atlasColors.inkSoft }}>Updated daily · MOE</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { d: 151, ex: 'O-LV ENG', p: 'Paper 1' },
              { d: 152, ex: 'O-LV ENG', p: 'Paper 2' },
              { d: 172, ex: 'A-LV GP',  p: 'Paper 1' },
            ].map((x, i) => (
              <div key={i} style={{ padding: '22px 24px 24px', borderLeft: i ? `1px solid ${atlasColors.ruleSoft}` : 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 150 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em' }}>{x.ex} / {x.p.toUpperCase()}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 110, lineHeight: 0.88, letterSpacing: '-0.05em' }}>{x.d}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em' }}>DAYS</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lower row — Challenge | Plan */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', flex: 1, minHeight: 0 }}>
          {/* Challenge */}
          <div style={{ padding: '20px 24px', borderRight: `1px solid ${atlasColors.rule}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, background: atlasColors.signal, display: 'inline-block' }}></span>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Daily Challenge · ARG</div>
              <div style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: atlasColors.inkSoft }}>+10 COINS</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.025em' }}>
              "Should social media platforms be banned for under-16s?"
            </div>
            <div style={{ fontSize: 13, color: atlasColors.inkSoft, maxWidth: 460 }}>
              Write a compelling opening paragraph. Refreshes at midnight SGT.
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', gap: 0 }}>
              <button style={{ background: atlasColors.ink, color: atlasColors.bg, border: 'none', padding: '12px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
                Begin →
              </button>
              <button style={{ background: 'transparent', color: atlasColors.ink, border: `1px solid ${atlasColors.ink}`, borderLeft: 'none', padding: '12px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
                Skip
              </button>
            </div>
          </div>

          {/* Plan */}
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>This Week · Plan</div>
            {[
              { day: 'THU 21', sub: 'ENG', items: 'Drills 25m / Essay 45m', tone: atlasColors.ink },
              { day: 'FRI 22', sub: 'GPR', items: 'Example review / Lesson 20m', tone: atlasColors.ink },
              { day: 'SAT 23', sub: 'EC1', items: 'Essay 45m / Game 15m',       tone: atlasColors.ink },
              { day: 'SUN 24', sub: 'EC2', items: 'Lesson 20m / Past paper 60m', tone: atlasColors.signal },
              { day: 'MON 25', sub: 'ENG', items: 'Game 15m / Drills 25m',     tone: atlasColors.ink },
            ].map((x, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '72px 56px 1fr', alignItems: 'center', gap: 12, padding: '7px 0', borderBottom: i < 4 ? `1px solid ${atlasColors.ruleSoft}` : 'none' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>{x.day}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: x.tone, padding: '2px 6px', border: `1px solid ${x.tone}`, textAlign: 'center', width: 'fit-content' }}>{x.sub}</div>
                <div style={{ fontSize: 13, color: atlasColors.inkSoft }}>{x.items}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

window.AtlasDashboard = AtlasDashboard;
