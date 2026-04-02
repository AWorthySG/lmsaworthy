import React, { useState } from 'react';
import { T } from '../../theme/theme.js';

function EssayGrader() {
  const [essay, setEssay] = useState("");
  const [question, setQuestion] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analysing, setAnalysing] = useState(false);

  function analyseEssay() {
    if (!essay.trim() || essay.trim().split(/\s+/).length < 50) return;
    setAnalysing(true);
    setTimeout(() => {
      const words = essay.trim().split(/\s+/);
      const wordCount = words.length;
      const sentences = essay.split(/[.!?]+/).filter(s => s.trim().length > 5);
      const avgSentenceLen = sentences.length > 0 ? Math.round(wordCount / sentences.length) : 0;
      const paragraphs = essay.split(/\n\s*\n/).filter(p => p.trim().length > 20);

      const firstPara = paragraphs[0] || "";
      const hasThesis = /agree|argue|contend|believe|extent|position|view|assert/i.test(firstPara);
      const thesisScore = hasThesis ? (firstPara.length > 80 ? 5 : 3) : 1;

      const paraCount = paragraphs.length;
      const structureScore = paraCount >= 5 ? 5 : paraCount >= 4 ? 4 : paraCount >= 3 ? 3 : 2;
      const hasConclusion = paragraphs.length > 2 && /conclusion|therefore|overall|in summary|ultimately|in light/i.test(paragraphs[paragraphs.length - 1]);

      const exampleIndicators = (essay.match(/for example|for instance|such as|e\.g\.|according to|research|study|statistic|percent|%|\d{4}/gi) || []).length;
      const exampleScore = exampleIndicators >= 6 ? 5 : exampleIndicators >= 4 ? 4 : exampleIndicators >= 2 ? 3 : exampleIndicators >= 1 ? 2 : 1;

      const sophisticatedWords = (essay.match(/notwithstanding|paradoxically|exacerbate|ubiquitous|disproportionately|corroborate|precipitate|mitigate|untenable|ostensibly|conversely|moreover|furthermore|nevertheless|consequently|juxtaposition|dichotomy|nuanced|multifaceted|paradigm/gi) || []).length;
      const vocabScore = sophisticatedWords >= 6 ? 5 : sophisticatedWords >= 4 ? 4 : sophisticatedWords >= 2 ? 3 : sophisticatedWords >= 1 ? 2 : 1;

      const hasCounter = /however|on the other hand|critics|opponents|counter|alternatively|admittedly|while it is true|conversely/i.test(essay);
      const counterScore = hasCounter ? 4 : 2;

      const topicSentenceStrong = paragraphs.filter(p => {
        const first = p.trim().split(/[.!?]/)[0] || "";
        return first.length > 30 && /because|as a result|this demonstrates|this is due|the reason/i.test(first);
      }).length;
      const topicScore = topicSentenceStrong >= 3 ? 5 : topicSentenceStrong >= 2 ? 4 : topicSentenceStrong >= 1 ? 3 : 2;

      const lengthScore = wordCount >= 600 && wordCount <= 800 ? 5 : wordCount >= 500 ? 4 : wordCount >= 400 ? 3 : 2;

      const totalScore = thesisScore + structureScore + exampleScore + vocabScore + counterScore + topicScore + lengthScore;
      const maxScore = 35;
      const pct = Math.round((totalScore / maxScore) * 100);
      const band = pct >= 80 ? 5 : pct >= 65 ? 4 : pct >= 50 ? 3 : pct >= 35 ? 2 : 1;

      setAnalysis({
        wordCount, sentenceCount: sentences.length, avgSentenceLen, paraCount,
        scores: [
          { label: "Thesis Clarity", score: thesisScore, max: 5, feedback: hasThesis ? "Thesis detected in introduction. " + (firstPara.length > 80 ? "Clear and developed." : "Could be more developed.") : "No clear thesis statement found in the first paragraph. State your position explicitly." },
          { label: "Essay Structure", score: structureScore, max: 5, feedback: `${paraCount} paragraphs detected. ${hasConclusion ? "Conclusion present." : "Conclusion may be missing or weak — ensure it synthesises, not summarises."}` },
          { label: "Evidence & Examples", score: exampleScore, max: 5, feedback: `${exampleIndicators} evidence markers found. ${exampleScore >= 4 ? "Good use of specific evidence." : "Add more specific, named examples with data/dates. Avoid generic claims."}` },
          { label: "Vocabulary", score: vocabScore, max: 5, feedback: `${sophisticatedWords} sophisticated terms found. ${vocabScore >= 4 ? "Strong evaluative language." : "Upgrade phrases: 'bad' → 'detrimental', 'important' → 'indispensable', 'many' → 'a significant proportion'."}` },
          { label: "Counter-Argument", score: counterScore, max: 5, feedback: hasCounter ? "Counter-argument handling detected. Ensure you're using concession for qualified stands and rebuttal for absolute stands." : "No counter-argument detected. Band 4+ requires engaging with opposing views." },
          { label: "Topic Sentences", score: topicScore, max: 5, feedback: `${topicSentenceStrong} reason-driven topic sentences found. ${topicScore >= 4 ? "Good use of Topic + Cause + Effect." : "Make topic sentences reason-driven: 'X is true because Y, resulting in Z.'"}` },
          { label: "Word Count", score: lengthScore, max: 5, feedback: `${wordCount} words. ${lengthScore >= 4 ? "Good length." : wordCount < 500 ? "Too short — aim for 600-800 words." : "Slightly long — tighten your prose."}` },
        ],
        band, pct, totalScore, maxScore,
      });
      setAnalysing(false);
    }, 1500);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #1A1816, #544F48)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>Essay Grader</h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0", fontWeight: 400 }}>Paste your essay for framework-based analysis against GP Band descriptors</p>
      </div>

      <div style={{ display: "flex", gap: 14, flex: 1, minHeight: 0, flexDirection: typeof window !== "undefined" && window.innerWidth < 768 ? "column" : "row", overflowY: typeof window !== "undefined" && window.innerWidth < 768 ? "auto" : "hidden" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Essay question (optional)"
            style={{ padding: "8px 12px", borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, boxSizing: "border-box" }} />
          <textarea value={essay} onChange={e => setEssay(e.target.value)} placeholder="Paste your essay here (minimum 50 words)..."
            style={{ flex: 1, padding: "14px 16px", borderRadius: T.r2, border: `1px solid ${T.border}`, fontSize: 14, lineHeight: 1.8, resize: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: T.textTer }}>{essay.trim() ? essay.trim().split(/\s+/).length : 0} words</span>
            <button onClick={analyseEssay} disabled={analysing || essay.trim().split(/\s+/).length < 50}
              style={{ padding: "10px 24px", borderRadius: T.r2, background: essay.trim().split(/\s+/).length >= 50 ? T.accent : T.bgMuted, color: essay.trim().split(/\s+/).length >= 50 ? "#fff" : T.textTer, fontWeight: 600, fontSize: 13, border: "none", cursor: essay.trim().split(/\s+/).length >= 50 ? "pointer" : "not-allowed" }}>
              {analysing ? "Analysing..." : "Analyse Essay"}
            </button>
          </div>
        </div>

        {analysis && (
          <div style={{ width: typeof window !== "undefined" && window.innerWidth < 768 ? "100%" : 320, flexShrink: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "20px", border: `1px solid ${T.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 200, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 6 }}>Estimated Band</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: analysis.band >= 4 ? T.success : analysis.band >= 3 ? T.warning : T.danger, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{analysis.band}</div>
              <div style={{ fontSize: 12, color: T.textSec }}>{analysis.totalScore}/{analysis.maxScore} points ({analysis.pct}%)</div>
              <div style={{ fontSize: 11, color: T.textTer, marginTop: 4 }}>
                {analysis.wordCount} words · {analysis.paraCount} paragraphs · {analysis.sentenceCount} sentences
              </div>
            </div>

            {analysis.scores.map((s, i) => (
              <div key={i} style={{ background: T.bgCard, borderRadius: T.r2, padding: "12px 14px", border: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.score >= 4 ? T.success : s.score >= 3 ? T.warning : T.danger }}>{s.score}/{s.max}</span>
                </div>
                <div style={{ height: 4, background: T.bgMuted, borderRadius: 4, marginBottom: 6 }}>
                  <div style={{ height: "100%", borderRadius: 4, background: s.score >= 4 ? T.success : s.score >= 3 ? T.warning : T.danger, width: `${(s.score / s.max) * 100}%`, transition: "width 0.3s" }} />
                </div>
                <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>{s.feedback}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EssayGrader;
