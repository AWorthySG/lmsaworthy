import React, { useState, useEffect, useCallback } from "react";
import { T } from "../theme/theme.js";
import { Icon } from "@iconify/react";
import PageHeader from "../components/ui/PageHeader.jsx";
import {
  isCanvaConnected, startCanvaAuth, exchangeCanvaCode, clearCanvaTokens,
  listTemplates, getTemplateFields, createAutofill, checkAutofillStatus,
  exportDesign, checkExportStatus, pollJob,
} from "../config/canva.js";

const CERT_TYPES = [
  { id: "completion", label: "Course Completion", icon: "fluent-emoji-flat:graduation-cap", desc: "Awarded for completing a subject module" },
  { id: "achievement", label: "Achievement Award", icon: "fluent-emoji-flat:trophy", desc: "For outstanding quiz or exam performance" },
  { id: "streak", label: "Streak Champion", icon: "fluent-emoji-flat:fire", desc: "Maintained a study streak milestone" },
  { id: "participation", label: "Participation", icon: "fluent-emoji-flat:star", desc: "Active engagement in community & events" },
];

export default function Certificates({ state, dispatch }) {
  const [connected, setConnected] = useState(isCanvaConnected());
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateFields, setTemplateFields] = useState(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [certType, setCertType] = useState("completion");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [exportUrl, setExportUrl] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cert_history")) || []; }
    catch { return []; }
  });

  const students = state.students || [];

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code && !connected) {
      setLoading("Connecting to Canva...");
      exchangeCanvaCode(code)
        .then(() => {
          setConnected(true);
          setLoading("");
          // Clean URL
          window.history.replaceState({}, "", window.location.pathname);
        })
        .catch(e => { setError("Failed to connect: " + e.message); setLoading(""); });
    }
  }, [connected]);

  // Load templates on connect
  useEffect(() => {
    if (connected && templates.length === 0) {
      setLoading("Loading templates...");
      listTemplates()
        .then(data => {
          setTemplates(data.items || []);
          setLoading("");
        })
        .catch(e => {
          // If token expired or invalid, disconnect
          if (e.message.includes("Not connected")) {
            setConnected(false);
            clearCanvaTokens();
          }
          setError("Failed to load templates: " + e.message);
          setLoading("");
        });
    }
  }, [connected, templates.length]);

  const selectTemplate = useCallback(async (tmpl) => {
    setSelectedTemplate(tmpl);
    setTemplateFields(null);
    setLoading("Loading template fields...");
    try {
      const data = await getTemplateFields(tmpl.id);
      setTemplateFields(data.dataset || data);
      setLoading("");
    } catch (e) {
      setError("Failed to load fields: " + e.message);
      setLoading("");
    }
  }, []);

  const getStudentName = () => {
    if (!selectedStudent) return "";
    const s = students.find(st => String(st.id) === selectedStudent);
    return s?.name || "";
  };

  const buildAutofillData = () => {
    const studentName = getStudentName();
    const ct = CERT_TYPES.find(c => c.id === certType);
    const today = new Date().toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" });
    const fields = {};

    // Map common field names — Canva brand templates use text fields
    if (templateFields) {
      for (const [key] of Object.entries(templateFields)) {
        const k = key.toLowerCase();
        if (k.includes("name") || k.includes("student") || k.includes("recipient")) {
          fields[key] = { type: "text", text: studentName };
        } else if (k.includes("title") || k.includes("award") || k.includes("certificate")) {
          fields[key] = { type: "text", text: customTitle || ct.label };
        } else if (k.includes("date")) {
          fields[key] = { type: "text", text: today };
        } else if (k.includes("subtitle") || k.includes("desc") || k.includes("reason") || k.includes("for")) {
          fields[key] = { type: "text", text: customSubtitle || ct.desc };
        } else if (k.includes("tutor") || k.includes("teacher") || k.includes("instructor") || k.includes("signed")) {
          fields[key] = { type: "text", text: "A Worthy Learning" };
        }
      }
    }
    return fields;
  };

  const generateCertificate = async () => {
    if (!selectedTemplate) { setError("Please select a template"); return; }
    if (!selectedStudent) { setError("Please select a student"); return; }

    setLoading("Generating certificate...");
    setError("");
    setGeneratedDesign(null);
    setExportUrl(null);

    try {
      const autofillData = buildAutofillData();
      const ct = CERT_TYPES.find(c => c.id === certType);
      const title = `${customTitle || ct.label} - ${getStudentName()}`;

      const job = await createAutofill({
        brand_template_id: selectedTemplate.id,
        title,
        data: autofillData,
      });

      const jobId = job.job?.id || job.id;
      const result = await pollJob(checkAutofillStatus, jobId);
      const design = result.job?.result?.design || result.design || result;
      setGeneratedDesign(design);
      setLoading("Exporting as PNG...");

      const designId = design.id || design.design_id;
      const expJob = await exportDesign(designId, "png");
      const expId = expJob.job?.id || expJob.id;
      const expResult = await pollJob(checkExportStatus, expId);
      const urls = expResult.job?.result?.urls || expResult.urls || [];
      const url = urls[0] || expResult.job?.result?.url || expResult.url;

      setExportUrl(url);

      // Save to history
      const entry = {
        id: Date.now(),
        studentName: getStudentName(),
        certType: ct.label,
        title,
        date: new Date().toISOString(),
        designId,
        exportUrl: url,
        templateName: selectedTemplate.title,
      };
      const newHistory = [entry, ...history].slice(0, 50);
      setHistory(newHistory);
      localStorage.setItem("cert_history", JSON.stringify(newHistory));

      setLoading("");
    } catch (e) {
      setError("Generation failed: " + e.message);
      setLoading("");
    }
  };

  const disconnect = () => {
    clearCanvaTokens();
    setConnected(false);
    setTemplates([]);
    setSelectedTemplate(null);
    setTemplateFields(null);
  };

  // ─── Render ───
  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      <PageHeader
        title="Certificates & Awards"
        subtitle="Generate personalised certificates using Canva templates"
        action={connected ? (
          <button onClick={disconnect} style={styles.btnOutline}>
            <Icon icon="mdi:link-variant-off" width={16} /> Disconnect Canva
          </button>
        ) : null}
      />

      {error && (
        <div style={{ ...styles.alert, background: T.dangerBg, color: T.danger, borderColor: T.danger + "33" }}>
          <Icon icon="mdi:alert-circle" width={18} /> {error}
          <button onClick={() => setError("")} style={{ marginLeft: "auto", background: "none", border: "none", color: T.danger, cursor: "pointer", fontWeight: 700 }}>×</button>
        </div>
      )}

      {loading && (
        <div style={{ ...styles.alert, background: T.accentLight, color: T.accent, borderColor: T.accent + "33" }}>
          <Icon icon="mdi:loading" width={18} style={{ animation: "spin 1s linear infinite" }} /> {loading}
        </div>
      )}

      {/* Not connected — show connect prompt */}
      {!connected && (
        <div style={styles.connectCard}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: "0 0 8px", fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Connect to Canva
          </h2>
          <p style={{ fontSize: 14, color: T.textSec, margin: "0 0 24px", maxWidth: 420, lineHeight: 1.6 }}>
            Link your Canva account to generate beautiful certificates from your brand templates.
            Students receive personalised certificates with their name, achievement, and date — all auto-filled.
          </p>
          <button onClick={startCanvaAuth} style={styles.btnPrimary}>
            <Icon icon="simple-icons:canva" width={18} /> Connect Canva Account
          </button>
        </div>
      )}

      {/* Connected — certificate builder */}
      {connected && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left column — form */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Certificate Details</h3>

            {/* Certificate type */}
            <label style={styles.label}>Certificate Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {CERT_TYPES.map(ct => (
                <button
                  key={ct.id}
                  onClick={() => setCertType(ct.id)}
                  style={{
                    ...styles.typeBtn,
                    borderColor: certType === ct.id ? T.accent : T.border,
                    background: certType === ct.id ? T.accentLight : "#fff",
                  }}
                >
                  <Icon icon={ct.icon} width={24} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: certType === ct.id ? T.accent : T.text }}>{ct.label}</span>
                </button>
              ))}
            </div>

            {/* Student */}
            <label style={styles.label}>Student</label>
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              style={styles.select}
            >
              <option value="">Select a student...</option>
              {students.map(s => (
                <option key={s.id} value={String(s.id)}>{s.name}</option>
              ))}
            </select>

            {/* Custom title */}
            <label style={styles.label}>Custom Title (optional)</label>
            <input
              type="text"
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder={CERT_TYPES.find(c => c.id === certType)?.label}
              style={styles.input}
            />

            {/* Custom subtitle */}
            <label style={styles.label}>Description (optional)</label>
            <input
              type="text"
              value={customSubtitle}
              onChange={e => setCustomSubtitle(e.target.value)}
              placeholder={CERT_TYPES.find(c => c.id === certType)?.desc}
              style={styles.input}
            />

            {/* Template selection */}
            <label style={styles.label}>Canva Template</label>
            {templates.length === 0 && !loading ? (
              <div style={{ fontSize: 13, color: T.textTer, padding: "12px 0" }}>
                No certificate templates found. Create a brand template in Canva with "certificate" in its name.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {templates.map(tmpl => (
                  <button
                    key={tmpl.id}
                    onClick={() => selectTemplate(tmpl)}
                    style={{
                      ...styles.templateBtn,
                      borderColor: selectedTemplate?.id === tmpl.id ? T.accent : T.border,
                      background: selectedTemplate?.id === tmpl.id ? T.accentLight : "#fff",
                    }}
                  >
                    {tmpl.thumbnail?.url && (
                      <img src={tmpl.thumbnail.url} alt="" style={{ width: 48, height: 34, objectFit: "cover", borderRadius: 4 }} />
                    )}
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{tmpl.title || "Untitled"}</div>
                      <div style={{ fontSize: 11, color: T.textTer }}>
                        {tmpl.updated_at ? new Date(tmpl.updated_at * 1000).toLocaleDateString() : ""}
                      </div>
                    </div>
                    {selectedTemplate?.id === tmpl.id && <Icon icon="mdi:check-circle" width={20} style={{ color: T.accent }} />}
                  </button>
                ))}
              </div>
            )}

            {/* Template fields preview */}
            {templateFields && (
              <div style={{ marginBottom: 16 }}>
                <label style={styles.label}>Detected Fields</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {Object.keys(templateFields).map(key => (
                    <span key={key} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: T.bgMuted, color: T.textSec, fontWeight: 600 }}>
                      {key}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={generateCertificate}
              disabled={!!loading || !selectedTemplate || !selectedStudent}
              style={{
                ...styles.btnPrimary,
                width: "100%",
                opacity: loading || !selectedTemplate || !selectedStudent ? 0.5 : 1,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              <Icon icon="mdi:auto-fix" width={18} />
              {loading ? "Generating..." : "Generate Certificate"}
            </button>
          </div>

          {/* Right column — preview & history */}
          <div>
            {/* Preview / Result */}
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Preview</h3>

              {!generatedDesign && !exportUrl && (
                <div style={{ textAlign: "center", padding: "40px 20px", color: T.textTer }}>
                  <Icon icon="fluent-emoji-flat:framed-picture" width={56} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    Select a template and student, then generate to see the preview
                  </div>
                </div>
              )}

              {exportUrl && (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={exportUrl}
                    alt="Generated certificate"
                    style={{ width: "100%", borderRadius: T.r2, border: `1px solid ${T.border}`, marginBottom: 12 }}
                  />
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <a
                      href={exportUrl}
                      download={`certificate-${getStudentName().replace(/\s+/g, "-")}.png`}
                      style={styles.btnPrimary}
                    >
                      <Icon icon="mdi:download" width={16} /> Download PNG
                    </a>
                    {generatedDesign?.id && (
                      <button
                        onClick={async () => {
                          setLoading("Exporting PDF...");
                          try {
                            const job = await exportDesign(generatedDesign.id, "pdf");
                            const id = job.job?.id || job.id;
                            const result = await pollJob(checkExportStatus, id);
                            const url = result.job?.result?.urls?.[0] || result.job?.result?.url || result.url;
                            if (url) window.open(url, "_blank");
                            setLoading("");
                          } catch (e) { setError("PDF export failed: " + e.message); setLoading(""); }
                        }}
                        style={styles.btnOutline}
                      >
                        <Icon icon="mdi:file-pdf-box" width={16} /> Export PDF
                      </button>
                    )}
                  </div>
                </div>
              )}

              {generatedDesign && !exportUrl && (
                <div style={{ textAlign: "center", padding: 20, color: T.textSec, fontSize: 13 }}>
                  Design created. Exporting...
                </div>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div style={{ ...styles.card, marginTop: 16 }}>
                <h3 style={styles.sectionTitle}>Recent Certificates</h3>
                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                  {history.slice(0, 10).map(h => (
                    <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.border}22` }}>
                      <Icon icon="mdi:certificate" width={20} style={{ color: T.gold, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {h.studentName}
                        </div>
                        <div style={{ fontSize: 11, color: T.textTer }}>
                          {h.certType} · {new Date(h.date).toLocaleDateString()}
                        </div>
                      </div>
                      {h.exportUrl && (
                        <a href={h.exportUrl} target="_blank" rel="noreferrer" style={{ color: T.accent, flexShrink: 0 }}>
                          <Icon icon="mdi:open-in-new" width={16} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

const styles = {
  card: {
    background: T.bgCard,
    borderRadius: T.r3,
    border: `1px solid ${T.border}`,
    padding: 24,
    boxShadow: T.shadow1,
  },
  connectCard: {
    background: T.bgCard,
    borderRadius: T.r4,
    border: `1px solid ${T.border}`,
    padding: "48px 32px",
    textAlign: "center",
    boxShadow: T.shadow2,
  },
  sectionTitle: {
    fontSize: 15, fontWeight: 800, color: T.text, margin: "0 0 16px",
    fontFamily: "'Bricolage Grotesque', sans-serif",
  },
  label: {
    display: "block", fontSize: 12, fontWeight: 700, color: T.textSec,
    marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5,
  },
  select: {
    width: "100%", padding: "10px 12px", borderRadius: T.r2,
    border: `1px solid ${T.border}`, fontSize: 13, fontWeight: 600,
    color: T.text, background: "#fff", marginBottom: 16,
    outline: "none", cursor: "pointer",
  },
  input: {
    width: "100%", padding: "10px 12px", borderRadius: T.r2,
    border: `1px solid ${T.border}`, fontSize: 13, fontWeight: 500,
    color: T.text, background: "#fff", marginBottom: 16, outline: "none",
    boxSizing: "border-box",
  },
  typeBtn: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 6, padding: "12px 8px", borderRadius: T.r2,
    border: `1.5px solid`, cursor: "pointer", transition: "all 0.15s",
  },
  templateBtn: {
    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
    borderRadius: T.r2, border: `1.5px solid`, cursor: "pointer",
    transition: "all 0.15s",
  },
  btnPrimary: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "12px 24px", borderRadius: T.r2,
    background: T.accent, color: "#fff", fontWeight: 700, fontSize: 13,
    border: "none", cursor: "pointer", textDecoration: "none",
  },
  btnOutline: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 16px", borderRadius: T.r2,
    background: "transparent", color: T.accent, fontWeight: 700, fontSize: 12,
    border: `1.5px solid ${T.accent}44`, cursor: "pointer",
  },
  alert: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 16px", borderRadius: T.r2,
    border: "1px solid", fontSize: 13, fontWeight: 600, marginBottom: 16,
  },
};
