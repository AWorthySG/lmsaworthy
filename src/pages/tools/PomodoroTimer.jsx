import React, { useState, useEffect, useRef } from 'react';
import { T } from '../../theme/theme.js';

function PomodoroTimer({ dispatch }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus"); // focus | break
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s === 0) {
          setMinutes(m => {
            if (m === 0) {
              clearInterval(intervalRef.current);
              setIsRunning(false);
              if (mode === "focus") {
                setSessions(s => s + 1);
                dispatch?.({ type: "LOG_STUDY_TIME", payload: { minutes: 25, activity: "pomodoro" } });
                dispatch?.({ type: "ADD_TOAST", payload: { message: "Focus session complete! Take a break. 🎉", variant: "success" } });
                setMode("break"); setMinutes(5); setSeconds(0);
              } else {
                dispatch?.({ type: "ADD_TOAST", payload: { message: "Break over! Ready for another session?", variant: "info" } });
                setMode("focus"); setMinutes(25); setSeconds(0);
              }
              return 0;
            }
            return m - 1;
          });
          return 59;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  function toggle() { setIsRunning(r => !r); }
  function reset() { clearInterval(intervalRef.current); setIsRunning(false); setMinutes(mode === "focus" ? 25 : 5); setSeconds(0); }

  const pct = mode === "focus" ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100 : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  return (
    <div style={{ background: mode === "focus" ? "linear-gradient(135deg, #0F172A, #1E2A4A)" : "linear-gradient(135deg, #0F2A1A, #1E4A2A)", borderRadius: T.r3, padding: "24px", textAlign: "center", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `conic-gradient(${mode === "focus" ? "#4F5BD5" : "#16A34A"} ${pct}%, transparent ${pct}%)`, opacity: 0.08 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          {mode === "focus" ? "🎯 Focus Time" : "☕ Break Time"} · Session {sessions + 1}
        </div>
        <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2 }}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
          <button onClick={toggle} style={{ padding: "10px 24px", borderRadius: T.r5, background: isRunning ? "rgba(255,255,255,0.15)" : mode === "focus" ? T.gradPrimary : "linear-gradient(135deg, #16A34A, #22C55E)", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
            {isRunning ? "⏸ Pause" : "▶ Start"}
          </button>
          <button onClick={reset} style={{ padding: "10px 16px", borderRadius: T.r5, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer" }}>Reset</button>
        </div>
        {sessions > 0 && <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{sessions} session{sessions > 1 ? "s" : ""} completed today</div>}
      </div>
    </div>
  );
}

export default PomodoroTimer;
