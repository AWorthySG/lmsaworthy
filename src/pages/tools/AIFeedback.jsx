import React, { useState, useEffect, useRef } from 'react';
import { T } from '../../theme/theme.js';
import { Upload, Sparkle, Warning, Check, ArrowRight, X } from '../../icons/icons.jsx';
import { PageHeader } from '../../components/ui';
import { SUBJECTS, TOPICS } from '../../data/subjects.js';
import { pickDefaultTask, rubricToText } from './rubrics.js';
import { extractFromFile, mergeExtractions } from './extractText.js';
import { gradeSubmission } from './gradeClient.js';
import { getSubjectTheme } from '../../utils/helpers.js';

function ScoreBar({ label, score, max, comment }) {
  const pct = max ? Math.round((score / max) * 100) : 0;
  const barColor = pct >= 70 ? T.success : pct >= 50 ? T.warning : T.danger;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: barColor, fontVariantNumeric: 'tabular-nums' }}>{score}/{max}</span>
      </div>
      <div style={{ height: 6, background: T.bgMuted, borderRadius: 999, overflow: 'hidden', marginBottom: comment ? 5 : 0 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 999, transition: 'width 0.6s ease' }} />
      </div>
      {comment && <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{comment}</div>}
    </div>
  );
}

function FeedbackResult({ result, subject }) {
  const theme = getSubjectTheme(subject) || T.eng;
  const pct = typeof result.overallPercent === 'number' ? result.overallPercent : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeInUp 0.4s ease' }}>
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Grade header */}
      <div style={{ padding: '22px 24px', borderRadius: T.r3, background: `linear-gradient(135deg, #1C1B19, #2A2927)`, color: '#fff', display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.6, marginBottom: 4 }}>Estimated grade</div>
          <div style={{ fontSize: 40, fontWeight: 800, fontFamily: T.fontDisplay, lineHeight: 1, color: theme.accent }}>
            {result.grade}
          </div>
          {pct !== null && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{pct}%</div>}
        </div>
        <div style={{ width: 1, height: 60, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.5, marginBottom: 6 }}>Overall feedback</div>
          <div style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.9)' }}>{result.summary}</div>
        </div>
      </div>

      {/* Strengths + Improvements */}
      {(result.strengths?.length > 0 || result.improvements?.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {result.strengths?.length > 0 && (
            <div style={{ background: T.bgCard, borderRadius: T.r2, padding: '16px', border: `1px solid ${T.border}`, borderTop: `3px solid ${T.success}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.success, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>What's working</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {result.strengths.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: T.success + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Check size={9} color={T.success} />
                    </div>
                    <span style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {result.improvements?.length > 0 && (
            <div style={{ background: T.bgCard, borderRadius: T.r2, padding: '16px', border: `1px solid ${T.border}`, borderTop: `3px solid ${T.warning}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.warning, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>To improve</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {result.improvements.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: T.warning + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <ArrowRight size={9} color={T.warning} />
                    </div>
                    <span style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Criteria breakdown */}
      {result.criteria?.length > 0 && (
        <div style={{ background: T.bgCard, borderRadius: T.r2, padding: '18px 20px', border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: T.textSec, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>Breakdown by criteria</div>
          {result.criteria.map((c, i) => <ScoreBar key={i} label={c.label} score={c.score} max={c.max} comment={c.comment} />)}
        </div>
      )}

      {/* Full report */}
      {result.report && (
        <details style={{ background: T.bgCard, borderRadius: T.r2, border: `1px solid ${T.border}`, padding: '14px 18px' }}>
          <summary style={{ fontSize: 12, fontWeight: 700, color: T.textSec, cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowRight size={12} color={T.textSec} /> Full written report
          </summary>
          <div style={{ marginTop: 12, fontSize: 13, color: T.text, lineHeight: 1.7, whiteSpace: 'pre-wrap', borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>{result.report}</div>
        </details>
      )}

      <div style={{ fontSize: 11, color: T.textTer, textAlign: 'center' }}>
        AI feedback is a guide — check with your tutor before finalising. Model: {result.model || 'claude'}.
      </div>
    </div>
  );
}

export default function AIFeedback() {
  const [subject, setSubject] = useState('gp');
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [files, setFiles] = useState([]);
  const [pastedText, setPastedText] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const fileInputRef = useRef(null);

  const [taskKey, setTaskKey] = useState(() => pickDefaultTask('gp', ''));
  useEffect(() => { setTaskKey(pickDefaultTask(subject, topic)); }, [subject, topic]);

  const theme = getSubjectTheme(subject) || T.eng;

  function addFiles(list) { setFiles(prev => [...prev, ...Array.from(list)]); }
  function removeFile(i) { setFiles(prev => prev.filter((_, idx) => idx !== i)); }

  function onDrop(e) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  async function getFeedback() {
    setError(null); setResult(null); setWarnings([]); setBusy('Extracting your work…');
    try {
      const rubric = rubricToText(subject, taskKey);
      const extractions = await Promise.all(files.map(f => extractFromFile(f).catch(e => ({ warnings: [`Couldn't read ${f.name}: ${e.message}`] }))));
      const merged = mergeExtractions(extractions);
      const combinedText = [merged.text, pastedText.trim()].filter(Boolean).join('\n\n');
      if (!combinedText && (!merged.images || merged.images.length === 0)) throw new Error('Please upload a file or paste your essay first.');
      setWarnings(merged.warnings || []);
      setBusy('Getting AI feedback…');
      const res = await gradeSubmission({ subject, topic, question, rubric, text: combinedText, images: merged.images });
      setResult(res);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setBusy('');
    }
  }

  function reset() { setFiles([]); setPastedText(''); setQuestion(''); setResult(null); setError(null); setWarnings([]); }

  const canSubmit = (files.length > 0 || pastedText.trim().length > 0) && !busy;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <PageHeader
        title="AI Essay Feedback"
        subtitle="Submit your essay or answer and get instant, rubric-based feedback"
      />

      {!result ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Subject + topic row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 5, letterSpacing: 0.3, textTransform: 'uppercase' }}>Subject</label>
              <select value={subject} onChange={e => { setSubject(e.target.value); setTopic(''); }}
                style={{ width: '100%', padding: '9px 12px', borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, background: T.bgCard, color: T.text, fontFamily: T.fontBody }}>
                {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 5, letterSpacing: 0.3, textTransform: 'uppercase' }}>Topic <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
              <select value={topic} onChange={e => setTopic(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, background: T.bgCard, color: T.text, fontFamily: T.fontBody }}>
                <option value=''>Any topic</option>
                {(TOPICS[subject] || []).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Question */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 5, letterSpacing: 0.3, textTransform: 'uppercase' }}>
              Question / essay title <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional but helps)</span>
            </label>
            <input value={question} onChange={e => setQuestion(e.target.value)}
              placeholder='e.g. "To what extent should governments fund the arts?"'
              style={{ width: '100%', padding: '9px 12px', borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, background: T.bgCard, color: T.text, fontFamily: T.fontBody, boxSizing: 'border-box' }} />
          </div>

          {/* File drop zone */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 5, letterSpacing: 0.3, textTransform: 'uppercase' }}>Upload your work</label>
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '28px 20px', borderRadius: T.r2, border: `2px dashed ${theme.accent}40`, background: theme.bg, cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = theme.accent + '80'}
              onMouseLeave={e => e.currentTarget.style.borderColor = theme.accent + '40'}>
              <Upload size={20} color={theme.accent} />
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginTop: 8 }}>Drop files here or click to browse</div>
              <div style={{ fontSize: 11, color: T.textTer, marginTop: 3 }}>Supports PDF, DOCX, photos (.jpg, .png)</div>
            </div>
            <input ref={fileInputRef} type='file' multiple accept='.docx,.pdf,.png,.jpg,.jpeg,.webp,.txt'
              onChange={e => addFiles(e.target.files)} style={{ display: 'none' }} />
            {files.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {files.map((f, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r5, fontSize: 12, color: T.text }}>
                    {f.name}
                    <button onClick={e => { e.stopPropagation(); removeFile(i); }} aria-label={`Remove ${f.name}`}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textTer, padding: 0, display: 'flex' }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* OR paste */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: T.textSec, display: 'block', marginBottom: 5, letterSpacing: 0.3, textTransform: 'uppercase' }}>Or paste your essay directly</label>
            <textarea value={pastedText} onChange={e => setPastedText(e.target.value)} rows={8}
              placeholder='Paste your essay or answer here…'
              style={{ width: '100%', padding: '10px 12px', borderRadius: T.r1, border: `1px solid ${T.border}`, fontSize: 13, background: T.bgCard, color: T.text, fontFamily: T.fontBody, lineHeight: 1.6, resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: T.r1, background: T.dangerBg, color: T.danger, fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Warning size={14} color={T.danger} /> {error}
            </div>
          )}

          <button onClick={getFeedback} disabled={!canSubmit}
            style={{ padding: '14px 24px', borderRadius: T.r2, border: 'none', background: canSubmit ? T.accent : T.bgMuted, color: canSubmit ? '#fff' : T.textTer, fontWeight: 700, fontSize: 15, cursor: canSubmit ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s', fontFamily: T.fontBody }}>
            {busy
              ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />{busy}</>
              : <><Sparkle size={16} /> Get AI feedback</>
            }
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </button>

          {warnings.length > 0 && (
            <div style={{ padding: '8px 12px', borderRadius: T.r1, background: '#FFF4E8', color: T.warning, fontSize: 12 }}>
              {warnings.map((w, i) => <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Warning size={11} /> {w}</div>)}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button onClick={reset}
              style={{ padding: '7px 16px', borderRadius: T.r1, border: `1px solid ${T.border}`, background: T.bgCard, color: T.textSec, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              ← Try another essay
            </button>
          </div>
          <FeedbackResult result={result} subject={subject} />
        </div>
      )}
    </div>
  );
}
