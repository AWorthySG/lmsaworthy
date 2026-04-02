import React, { useState } from 'react';
import { T } from '../theme/theme.js';
import { GraduationCap, Star } from '../icons/icons.jsx';
import { Btn, Input } from '../components/ui';
import { firebaseAuth, firebaseDb, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, ref, set } from '../config/firebase.js';

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      // onAuthStateChanged in parent will handle the rest
    } catch (err) {
      setError(err.code === "auth/invalid-credential" ? "Invalid email or password." : err.code === "auth/user-not-found" ? "No account found with this email." : err.code === "auth/wrong-password" ? "Incorrect password." : err.message);
    }
    setLoading(false);
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // Save user profile to database
      await set(ref(firebaseDb, `users/${cred.user.uid}`), {
        name, email, role: "student", createdAt: new Date().toISOString(),
        subjects: [], avatar: null,
      });
    } catch (err) {
      setError(err.code === "auth/email-already-in-use" ? "An account with this email already exists." : err.code === "auth/weak-password" ? "Password is too weak — use at least 6 characters." : err.message);
    }
    setLoading(false);
  }

  const FEATURES = [
    { icon: "🎯", title: "Practice Drills", desc: "Structured question-type frameworks" },
    { icon: "🎮", title: "20+ Games", desc: "Gamified learning for every subject" },
    { icon: "📊", title: "Live Analytics", desc: "Track progress across all subjects" },
    { icon: "🏆", title: "Leaderboard", desc: "Compete and celebrate achievements" },
  ];

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#0B0F1A", position: "relative", overflow: "hidden" }}>
      <style>{`@media(min-width:768px){.login-layout{flex-direction:row!important;}}`}</style>
      <style>{`
        @keyframes loginFloat { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-18px) rotate(3deg); } }
        @keyframes loginPulse { 0%,100% { opacity: 0.04; transform: scale(1); } 50% { opacity: 0.09; transform: scale(1.05); } }
        @keyframes loginFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-feature-card { transition: transform 0.2s ease, background 0.2s ease; }
        .login-feature-card:hover { transform: translateY(-2px); background: rgba(255,255,255,0.07) !important; }
        .login-input:focus { border-color: rgba(79,91,213,0.7) !important; box-shadow: 0 0 0 3px rgba(45,58,140,0.2) !important; outline: none !important; }
        .login-btn-primary { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .login-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(45,58,140,0.45) !important; }
        .login-btn-primary:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      {/* Deep atmospheric background */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 15%, rgba(45,58,140,0.18), transparent 55%), radial-gradient(ellipse at 80% 85%, rgba(212,162,84,0.08), transparent 50%), radial-gradient(ellipse at 60% 40%, rgba(13,148,136,0.05), transparent 45%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      {/* Floating decorative orbs */}
      <div style={{ position: "absolute", top: "8%", left: "5%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,58,140,0.12), transparent 70%)", animation: "loginPulse 8s ease infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,162,84,0.08), transparent 70%)", animation: "loginPulse 10s ease infinite 2s", pointerEvents: "none" }} />

      {/* Floating geometric accents */}
      <div style={{ position: "absolute", top: "18%", left: "12%", width: 60, height: 60, borderRadius: 12, border: "1px solid rgba(79,91,213,0.15)", animation: "loginFloat 9s ease-in-out infinite", transform: "rotate(15deg)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "22%", left: "18%", width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(212,162,84,0.12)", animation: "loginFloat 11s ease-in-out infinite 3s", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "65%", right: "15%", width: 50, height: 50, borderRadius: 8, border: "1px solid rgba(13,148,136,0.12)", animation: "loginFloat 7s ease-in-out infinite 1s", transform: "rotate(-10deg)", pointerEvents: "none" }} />

      <div className="login-layout" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      {/* Left panel — brand + features */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 1, animation: "loginFadeUp 0.6s ease both" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <img src="/logo-aworthy.jpeg" alt="A Worthy" style={{ height: 44, objectFit: "contain", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#FEFEFE", fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.02em" }}>A Worthy</div>
            <div style={{ fontSize: 9, fontWeight: 500, color: "rgba(254,254,254,0.35)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Learning Platform</div>
          </div>
        </div>

        {/* Hero headline */}
        <h1 style={{ fontSize: 52, fontWeight: 800, color: "#FEFEFE", fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 18px" }}>
          Learn with<br />
          <span style={{ background: "linear-gradient(135deg, #E8C078, #D4A254, #B8860B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>purpose.</span>
        </h1>
        <p style={{ fontSize: 17, fontWeight: 300, color: "rgba(254,254,254,0.5)", fontFamily: "'Fraunces', serif", fontStyle: "italic", lineHeight: 1.7, maxWidth: 380, margin: "0 0 40px" }}>
          Singapore’s most engaging platform for O-Level English, General Paper, H1 &amp; H2 Economics.
        </p>

        {/* Social proof stats */}
        <div style={{ display: "flex", gap: 32, marginBottom: 44 }}>
          {[{ n: "150+", l: "Resources" }, { n: "20+", l: "Games" }, { n: "4", l: "Subjects" }, { n: "100%", l: "Cambridge" }].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#D4A254", fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.03em" }}>{s.n}</div>
              <div style={{ fontSize: 9, fontWeight: 500, color: "rgba(254,254,254,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Bricolage Grotesque', sans-serif", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 420 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="login-feature-card" style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(254,254,254,0.85)", marginBottom: 2 }}>{f.title}</div>
              <div style={{ fontSize: 10, color: "rgba(254,254,254,0.35)", lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — auth form */}
      <div style={{ width: "100%", maxWidth: 440, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", zIndex: 1, animation: "loginFadeUp 0.6s ease 0.1s both", margin: "0 auto" }}>
        <div style={{ width: "100%", background: "rgba(254,254,254,0.04)", borderRadius: 20, padding: "36px 32px", border: "1px solid rgba(254,254,254,0.09)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>

          {/* Form header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(254,254,254,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 6 }}>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#FEFEFE", fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.03em" }}>
              {mode === "login" ? "Sign in" : "Get started"}
            </div>
          </div>

          {/* Mode tabs */}
          <div style={{ display: "flex", marginBottom: 26, borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.05)", padding: 3, gap: 3 }}>
            {[{ id: "login", label: "Sign In" }, { id: "register", label: "Register" }].map(tab => (
              <button key={tab.id} onClick={() => { setMode(tab.id); setError(""); }}
                style={{ flex: 1, padding: "9px", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", borderRadius: 8, background: mode === tab.id ? T.accent : "transparent", color: mode === tab.id ? "#fff" : "rgba(254,254,254,0.45)", transition: "all 0.2s", boxShadow: mode === tab.id ? "0 2px 8px rgba(45,58,140,0.4)" : "none" }}>
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
            {mode === "register" && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: "rgba(254,254,254,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sarah Chen" className="login-input"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid rgba(254,254,254,0.1)", background: "rgba(254,254,254,0.05)", fontSize: 14, boxSizing: "border-box", color: "#FEFEFE", transition: "border-color 0.2s, box-shadow 0.2s" }} />
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: "rgba(254,254,254,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="login-input"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid rgba(254,254,254,0.1)", background: "rgba(254,254,254,0.05)", fontSize: 14, boxSizing: "border-box", color: "#FEFEFE", transition: "border-color 0.2s, box-shadow 0.2s" }} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: "rgba(254,254,254,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === "register" ? "At least 6 characters" : "Your password"} required className="login-input"
                  style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: 10, border: "1.5px solid rgba(254,254,254,0.1)", background: "rgba(254,254,254,0.05)", fontSize: 14, boxSizing: "border-box", color: "#FEFEFE", transition: "border-color 0.2s, box-shadow 0.2s" }} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(254,254,254,0.35)", fontSize: 11, padding: 4, fontWeight: 600 }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ fontSize: 12, color: "#ff7b7b", marginBottom: 16, padding: "10px 14px", background: "rgba(255,107,107,0.1)", borderRadius: 10, border: "1px solid rgba(255,107,107,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="login-btn-primary"
              style={{ width: "100%", padding: "14px", borderRadius: 10, background: "linear-gradient(135deg, #2D3A8C, #4F5BD5)", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: loading ? "wait" : "pointer", letterSpacing: "-0.01em", boxShadow: "0 4px 16px rgba(45,58,140,0.3)", opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Please wait...
                </span>
              ) : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>

          {/* Switch mode */}
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "rgba(254,254,254,0.3)" }}>
            {mode === "login" ? (
              <>Don’t have an account? <button onClick={() => { setMode("register"); setError(""); }} style={{ background: "none", border: "none", color: "#818CF8", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Register free</button></>
            ) : (
              <>Already have an account? <button onClick={() => { setMode("login"); setError(""); }} style={{ background: "none", border: "none", color: "#818CF8", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Sign in</button></>
            )}
          </div>

          {/* Trust indicators */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "center", gap: 20 }}>
            {["🔒 Secure", "🇸🇬 Singapore", "📱 PWA"].map(t => (
              <span key={t} style={{ fontSize: 10, color: "rgba(254,254,254,0.2)", fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      </div>{/* end login-layout */}

      {/* Bottom attribution */}
      <div style={{ padding: "16px 24px", textAlign: "center", fontSize: 10, color: "rgba(254,254,254,0.15)", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 300, letterSpacing: "0.06em", position: "relative", zIndex: 1 }}>
        © {new Date().getFullYear()} A Worthy Learning Platform · Singapore
      </div>
    </div>
  );
}

/* ━━━ AUTH WRAPPER — gates the LMS behind login ━━━ */
/* ━━━ EXAM COUNTDOWN & DAILY CHALLENGES ━━━ */
const EXAM_DATES = [
  { name: "O-Level English Paper 1", date: "2026-10-19", subject: "eng", paper: "Paper 1" },
  { name: "O-Level English Paper 2", date: "2026-10-20", subject: "eng", paper: "Paper 2" },
  { name: "A-Level GP Paper 1", date: "2026-11-09", subject: "gp", paper: "Paper 1" },
  { name: "A-Level GP Paper 2", date: "2026-11-10", subject: "gp", paper: "Paper 2" },
  { name: "A-Level H1 Econ", date: "2026-11-16", subject: "h1econ", paper: "Paper 1" },
  { name: "A-Level H2 Econ Paper 1", date: "2026-11-17", subject: "h2econ", paper: "Paper 1" },
  { name: "A-Level H2 Econ Paper 2", date: "2026-11-18", subject: "h2econ", paper: "Paper 2" },
];


export default LoginScreen;
