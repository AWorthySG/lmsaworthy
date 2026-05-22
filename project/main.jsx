const W = 1240;
const H = 1000;

function App() {
  return (
    <DesignCanvas>
      <DCSection id="intro" title="A Worthy · Dashboard" subtitle="Five aesthetic directions — same data, very different feel. Pick one (or mix), and I'll build it out across the rest of the app.">
        <DCArtboard id="studio"  label="01 · Studio — editorial, warm paper, calm focus" width={W} height={H}><StudioDashboard /></DCArtboard>
        <DCArtboard id="atlas"   label="02 · Atlas — Swiss / typographic / single accent" width={W} height={H}><AtlasDashboard /></DCArtboard>
        <DCArtboard id="console" label="03 · Console — dense data, mono, dark mode" width={W} height={H}><ConsoleDashboard /></DCArtboard>
        <DCArtboard id="salon"   label="04 · Salon — modern academic / prep school" width={W} height={H}><SalonDashboard /></DCArtboard>
        <DCArtboard id="field"   label="05 · Field — Notion-minimal, very functional" width={W} height={H}><FieldDashboard /></DCArtboard>

        <DCPostIt top={-40} left={120} rotate={-3} width={220}>
          None of these use emoji as iconography. Each uses real typography + restraint instead.
        </DCPostIt>
        <DCPostIt top={-40} left={460} rotate={2} width={220}>
          Same content / data — only the visual system changes. The hero greeting, exam countdown, daily challenge, study plan and homework block appear in each.
        </DCPostIt>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
