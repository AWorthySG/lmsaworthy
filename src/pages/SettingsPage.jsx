import React, { useState, useEffect } from "react";
import { T } from "../theme/theme.js";

/* ━━━ HELPERS ━━━ */

const FONT_SIZE_KEY = "aworthy-font-size";
const NOTIF_PREFS_KEY = "aworthy-notif-prefs";

const DEFAULT_NOTIF_PREFS = {
  homeworkReminders: true,
  streakReminders: true,
  communityActivity: true,
};

function loadFontSize() {
  try {
    return localStorage.getItem(FONT_SIZE_KEY) || "medium";
  } catch {
    return "medium";
  }
}

function loadNotifPrefs() {
  try {
    const saved = localStorage.getItem(NOTIF_PREFS_KEY);
    return saved ? { ...DEFAULT_NOTIF_PREFS, ...JSON.parse(saved) } : DEFAULT_NOTIF_PREFS;
  } catch {
    return DEFAULT_NOTIF_PREFS;
  }
}

/* ━━━ REUSABLE STYLES ━━━ */

const sectionCard = {
  background: T.bgCard,
  borderRadius: T.r3,
  border: `1px solid ${T.border}`,
  padding: "24px 28px",
  boxShadow: T.shadow1,
};

const sectionTitle = {
  fontSize: 18,
  fontWeight: 800,
  color: T.text,
  margin: "0 0 16px 0",
  fontFamily: "'Bricolage Grotesque', sans-serif",
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: `1px solid ${T.border}`,
};

const labelStyle = {
  fontSize: 14,
  fontWeight: 600,
  color: T.text,
};

const descStyle = {
  fontSize: 12,
  color: T.textTer,
  marginTop: 2,
};

/* ━━━ TOGGLE SWITCH ━━━ */

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        background: checked ? T.accent : T.bgMuted,
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          background: "#fff",
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

/* ━━━ SETTINGS PAGE ━━━ */

function SettingsPage({ darkMode, setDarkMode, authUser, userProfile }) {
  const [fontSize, setFontSize] = useState(loadFontSize);
  const [notifPrefs, setNotifPrefs] = useState(loadNotifPrefs);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Persist font size
  useEffect(() => {
    try {
      localStorage.setItem(FONT_SIZE_KEY, fontSize);
    } catch { /* silently fail */ }
  }, [fontSize]);

  // Persist notification prefs
  useEffect(() => {
    try {
      localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(notifPrefs));
    } catch { /* silently fail */ }
  }, [notifPrefs]);

  function updateNotifPref(key, value) {
    setNotifPrefs((prev) => ({ ...prev, [key]: value }));
  }

  function handleClearData() {
    try {
      localStorage.removeItem("aworthy-lms-state");
      localStorage.removeItem(FONT_SIZE_KEY);
      localStorage.removeItem(NOTIF_PREFS_KEY);
      localStorage.removeItem("aworthy-dark");
    } catch { /* silently fail */ }
    setShowClearConfirm(false);
    window.location.reload();
  }

  function handleExportData() {
    try {
      const raw = localStorage.getItem("aworthy-lms-state");
      const data = raw ? JSON.parse(raw) : {};
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aworthy-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("Export failed:", err);
    }
  }

  const roleBadgeColor =
    userProfile?.role === "tutor"
      ? { bg: T.accentLight, text: T.accent }
      : userProfile?.role === "admin"
        ? { bg: T.goldLight, text: T.goldDark }
        : { bg: T.successBg, text: T.success };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>
      {/* Page header */}
      <div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            background: T.gradPrimary,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          Settings
        </h1>
        <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0" }}>
          Manage your preferences, notifications, and account
        </p>
      </div>

      {/* ━━━ 1. Appearance ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>Appearance</h2>

        {/* Dark mode */}
        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Dark Mode</div>
            <div style={descStyle}>Switch between light and dark themes</div>
          </div>
          <ToggleSwitch checked={darkMode} onChange={setDarkMode} />
        </div>

        {/* Font size */}
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div>
            <div style={labelStyle}>Font Size</div>
            <div style={descStyle}>Adjust the text size across the app</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["small", "medium", "large"].map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                style={{
                  padding: "6px 14px",
                  borderRadius: T.r1,
                  border: `1px solid ${fontSize === size ? T.accent : T.border}`,
                  background: fontSize === size ? T.accentLight : "transparent",
                  color: fontSize === size ? T.accent : T.textSec,
                  fontWeight: fontSize === size ? 700 : 500,
                  fontSize: size === "small" ? 11 : size === "large" ? 15 : 13,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.15s",
                }}
              >
                {size === "small" ? "A" : size === "medium" ? "A" : "A"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━ 2. Notifications ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>Notifications</h2>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Homework Reminders</div>
            <div style={descStyle}>Get notified about upcoming homework deadlines</div>
          </div>
          <ToggleSwitch
            checked={notifPrefs.homeworkReminders}
            onChange={(v) => updateNotifPref("homeworkReminders", v)}
          />
        </div>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Streak Reminders</div>
            <div style={descStyle}>Daily reminders to maintain your login streak</div>
          </div>
          <ToggleSwitch
            checked={notifPrefs.streakReminders}
            onChange={(v) => updateNotifPref("streakReminders", v)}
          />
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div>
            <div style={labelStyle}>Community Activity</div>
            <div style={descStyle}>Notifications for comments and reactions on your posts</div>
          </div>
          <ToggleSwitch
            checked={notifPrefs.communityActivity}
            onChange={(v) => updateNotifPref("communityActivity", v)}
          />
        </div>
      </div>

      {/* ━━━ 3. Account ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>Account</h2>

        <div style={rowStyle}>
          <div style={labelStyle}>Email</div>
          <div style={{ fontSize: 13, color: T.textSec }}>{authUser?.email || "—"}</div>
        </div>

        <div style={rowStyle}>
          <div style={labelStyle}>Display Name</div>
          <div style={{ fontSize: 13, color: T.textSec }}>{userProfile?.name || "—"}</div>
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div style={labelStyle}>Role</div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "4px 12px",
              borderRadius: T.r1,
              background: roleBadgeColor.bg,
              color: roleBadgeColor.text,
            }}
          >
            {userProfile?.role || "student"}
          </span>
        </div>
      </div>

      {/* ━━━ 4. Data ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>Data</h2>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {/* Clear Local Data */}
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              style={{
                padding: "10px 20px",
                borderRadius: T.r2,
                border: `1px solid ${T.danger}`,
                background: "transparent",
                color: T.danger,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.dangerBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Clear Local Data
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                borderRadius: T.r2,
                background: T.dangerBg,
                border: `1px solid ${T.danger}33`,
              }}
            >
              <span style={{ fontSize: 13, color: T.danger, fontWeight: 600 }}>
                Are you sure? This cannot be undone.
              </span>
              <button
                onClick={handleClearData}
                style={{
                  padding: "6px 14px",
                  borderRadius: T.r1,
                  border: "none",
                  background: T.danger,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Yes, clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{
                  padding: "6px 14px",
                  borderRadius: T.r1,
                  border: `1px solid ${T.border}`,
                  background: "transparent",
                  color: T.textSec,
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Export My Data */}
          <button
            onClick={handleExportData}
            style={{
              padding: "10px 20px",
              borderRadius: T.r2,
              border: `1px solid ${T.border}`,
              background: "transparent",
              color: T.text,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = T.bgMuted;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Export My Data
          </button>
        </div>
      </div>

      {/* ━━━ 5. About ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>About</h2>

        <div style={rowStyle}>
          <div style={labelStyle}>Version</div>
          <div style={{ fontSize: 13, color: T.textSec, fontFamily: "'JetBrains Mono', monospace" }}>
            1.0.0
          </div>
        </div>

        <div style={rowStyle}>
          <div style={labelStyle}>Made with</div>
          <div style={{ fontSize: 13, color: T.textSec }}>Built with ❤ in Singapore</div>
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div style={labelStyle}>Privacy Policy</div>
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              color: T.accent,
              fontWeight: 600,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            View Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
