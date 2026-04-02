import React from 'react';
import { T } from '../../theme/theme.js';
import { CheckCircle, XCircle, Sparkle, X } from '../../icons/icons.jsx';

export default function ToastItem({ toast, dispatch }) {
  const DURATION = 3500;
  const [progress, setProgress] = React.useState(100);
  React.useEffect(() => {
    const dismiss = setTimeout(() => dispatch({ type: "REMOVE_TOAST", payload: toast.id }), DURATION);
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(0, 100 - (elapsed / DURATION) * 100));
    }, 50);
    return () => { clearTimeout(dismiss); clearInterval(tick); };
  }, [toast.id, dispatch]);

  const meta = {
    success: { color: T.success, bg: T.successBg, icon: <CheckCircle size={18} weight="fill" /> },
    error:   { color: T.danger,  bg: T.dangerBg,  icon: <XCircle size={18} weight="fill" /> },
    info:    { color: T.accent,  bg: T.accentLight, icon: <Sparkle size={18} weight="fill" /> },
  };
  const { color, bg, icon } = meta[toast.variant] || meta.info;

  return (
    <div className="scale-pop" style={{ borderRadius: T.r2, background: bg, boxShadow: T.shadow3, border: `1px solid ${color}25`, minWidth: 260, maxWidth: 340, overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px 10px" }}>
        <span style={{ color, flexShrink: 0 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color, flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
        <button onClick={() => dispatch({ type: "REMOVE_TOAST", payload: toast.id })} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: color + "80", flexShrink: 0 }}>
          <X size={14} />
        </button>
      </div>
      {/* Progress bar */}
      <div style={{ height: 3, background: color + "20" }}>
        <div style={{ height: "100%", background: color, width: `${progress}%`, transition: "width 0.05s linear", borderRadius: 2 }} />
      </div>
    </div>
  );
}
