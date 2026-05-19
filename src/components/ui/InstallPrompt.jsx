import React, { useState, useEffect } from "react";
import { T } from "../../theme/theme.js";

let deferredPrompt = null;

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const dismissed = sessionStorage.getItem("pwa-install-dismissed");
      if (!dismissed) setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setInstalled(true);
      setShow(false);
      deferredPrompt = null;
    };
    window.addEventListener("appinstalled", installedHandler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShow(false);
    }
    deferredPrompt = null;
  }

  function handleDismiss() {
    setShow(false);
    sessionStorage.setItem("pwa-install-dismissed", "true");
  }

  if (!show || installed) return null;

  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, background: T.bgCard, border: `1px solid ${T.border}`,
      borderRadius: T.r3, padding: "14px 20px", boxShadow: T.shadow3,
      display: "flex", alignItems: "center", gap: 14, maxWidth: 420, width: "calc(100% - 32px)",
      animation: "fadeSlideIn 0.3s ease",
    }}>
      <img src="/icon-96x96.png" alt="" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Install A Worthy</div>
        <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.4 }}>Add to your home screen for a full app experience</div>
      </div>
      <button onClick={handleInstall}
        style={{ padding: "8px 16px", borderRadius: T.r2, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
        Install
      </button>
      <button onClick={handleDismiss}
        style={{ background: "none", border: "none", color: T.textTer, fontSize: 16, cursor: "pointer", padding: 4, lineHeight: 1 }}>
        ×
      </button>
    </div>
  );
}
