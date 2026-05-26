import React, { useState, useEffect } from "react";
import { T } from "../theme/theme.js";
import { PageHeader, Select } from "../components/ui";
import { AvatarPicker, AvatarDisplay } from "../components/gamification/StudentAvatar.jsx";
import { firebaseDb, ref, set, updateProfile } from "../config/firebase.js";

/* ━━━ STORAGE KEYS ━━━ */
const FONT_SIZE_KEY = "aworthy-font-size";
const NOTIF_PREFS_KEY = "aworthy-notif-prefs";
const SIDEBAR_KEY = "aworthy-sidebar-collapsed";
const POMODORO_KEY = "aworthy-pomodoro-prefs";
const HIDE_HW_KEY = "aworthy-hide-completed-hw";
const DEFAULT_PAGE_KEY = "aworthy-default-page";

const DEFAULT_NOTIF_PREFS = { homeworkReminders: true, communityActivity: true };
const DEFAULT_POMODORO = { workMin: 25, breakMin: 5 };

const WORK_MIN_OPTIONS = [15, 20, 25, 30, 35, 45, 50, 60];
const BREAK_MIN_OPTIONS = [5, 10, 15, 20];

const LANDING_OPTIONS = [
  { value: "dashboard", label: "Dashboard" },
  { value: "homework", label: "Homework" },
  { value: "community", label: "Community" },
  { value: "attendance", label: "Attendance" },
  { value: "progress", label: "Progress Tracker" },
  { value: "events", label: "Events" },
];

/* ━━━ LOAD HELPERS ━━━ */
function loadFontSize() {
  try { return localStorage.getItem(FONT_SIZE_KEY) || "medium"; } catch { return "medium"; }
}
function loadNotifPrefs() {
  try { const s = localStorage.getItem(NOTIF_PREFS_KEY); return s ? { ...DEFAULT_NOTIF_PREFS, ...JSON.parse(s) } : DEFAULT_NOTIF_PREFS; } catch { return DEFAULT_NOTIF_PREFS; }
}
function loadBool(key) {
  try { const v = localStorage.getItem(key); return v === "true"; } catch { return false; }
}
function loadPomodoroPrefs() {
  try { const s = localStorage.getItem(POMODORO_KEY); return s ? { ...DEFAULT_POMODORO, ...JSON.parse(s) } : DEFAULT_POMODORO; } catch { return DEFAULT_POMODORO; }
}
function loadDefaultPage() {
  try { return localStorage.getItem(DEFAULT_PAGE_KEY) || "dashboard"; } catch { return "dashboard"; }
}

/* ━━━ SHARED STYLES ━━━ */
const sectionCard = {
  background: T.bgCard, borderRadius: T.r3,
  border: `1px solid ${T.border}`, padding: "24px 28px", boxShadow: T.shadow1,
};
const sectionTitle = { fontSize: 18, fontWeight: 800, color: T.text, margin: "0 0 16px 0", fontFamily: T.fontDisplay };
const rowStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${T.border}` };
const labelStyle = { fontSize: 14, fontWeight: 600, color: T.text };
const descStyle = { fontSize: 12, color: T.textTer, marginTop: 2 };

/* ━━━ TOGGLE ━━━ */
function ToggleSwitch({ checked, onChange, "aria-describedby": ariaDescribedBy, "aria-label": ariaLabel }) {
  return (
    <button role="switch" aria-checked={checked} aria-describedby={ariaDescribedBy} aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: checked ? T.accent : T.bgMuted, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 3, left: checked ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

/* ━━━ PILL PICKER ━━━ */
function PillPicker({ value, options, onChange, format }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)}
          style={{ padding: "5px 12px", borderRadius: T.r1, border: `1px solid ${value === opt ? T.accent : T.border}`, background: value === opt ? T.accentLight : "transparent", color: value === opt ? T.accent : T.textSec, fontWeight: value === opt ? 700 : 500, fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
          {format ? format(opt) : opt}
        </button>
      ))}
    </div>
  );
}

/* ━━━ SETTINGS PAGE ━━━ */
function SettingsPage({ darkMode, setDarkMode, authUser, userProfile, state, dispatch }) {
  const [fontSize, setFontSize] = useState(loadFontSize);
  const [notifPrefs, setNotifPrefs] = useState(loadNotifPrefs);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Display name editing
  const [nameValue, setNameValue] = useState(() => userProfile?.name || authUser?.displayName || "");
  const [editingName, setEditingName] = useState(false);
  const [nameSaving, setNameSaving] = useState(false);

  // Appearance prefs
  const [sidebarDefault, setSidebarDefault] = useState(() => loadBool(SIDEBAR_KEY));

  // Study tools prefs
  const [pomodoroPrefs, setPomodoroPrefs] = useState(loadPomodoroPrefs);
  const [hideCompletedHw, setHideCompletedHw] = useState(() => loadBool(HIDE_HW_KEY));

  // Default landing page
  const [defaultPage, setDefaultPage] = useState(loadDefaultPage);

  // Sync nameValue when userProfile loads
  useEffect(() => {
    if (userProfile?.name && !editingName) setNameValue(userProfile.name); // eslint-disable-line react-hooks/set-state-in-effect -- sync the editable name field when the profile loads
  }, [userProfile?.name]); // eslint-disable-line react-hooks/exhaustive-deps -- re-sync only when the profile name changes, not while the user is editing

  useEffect(() => { try { localStorage.setItem(FONT_SIZE_KEY, fontSize); } catch { /* ignore */ } }, [fontSize]);
  useEffect(() => { try { localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(notifPrefs)); } catch { /* ignore */ } }, [notifPrefs]);
  useEffect(() => { try { localStorage.setItem(SIDEBAR_KEY, sidebarDefault ? "true" : "false"); } catch { /* ignore */ } }, [sidebarDefault]);
  useEffect(() => { try { localStorage.setItem(POMODORO_KEY, JSON.stringify(pomodoroPrefs)); } catch { /* ignore */ } }, [pomodoroPrefs]);
  useEffect(() => { try { localStorage.setItem(HIDE_HW_KEY, hideCompletedHw ? "true" : "false"); } catch { /* ignore */ } }, [hideCompletedHw]);
  useEffect(() => { try { localStorage.setItem(DEFAULT_PAGE_KEY, defaultPage); } catch { /* ignore */ } }, [defaultPage]);

  function updateNotifPref(key, value) { setNotifPrefs(p => ({ ...p, [key]: value })); }

  async function handleSaveName() {
    const trimmed = nameValue.trim();
    if (!trimmed || !authUser) return;
    setNameSaving(true);
    try {
      await updateProfile(authUser, { displayName: trimmed });
      await set(ref(firebaseDb, `users/${authUser.uid}/name`), trimmed);
      dispatch({ type: "ADD_TOAST", payload: { message: "Display name updated", variant: "success" } });
      setEditingName(false);
    } catch {
      dispatch({ type: "ADD_TOAST", payload: { message: "Failed to save name", variant: "error" } });
    }
    setNameSaving(false);
  }

  function handleCancelName() {
    setEditingName(false);
    setNameValue(userProfile?.name || authUser?.displayName || "");
  }

  function handleClearData() {
    try {
      localStorage.removeItem("aworthy-lms-state");
      [FONT_SIZE_KEY, NOTIF_PREFS_KEY, SIDEBAR_KEY, POMODORO_KEY, HIDE_HW_KEY, DEFAULT_PAGE_KEY, "aworthy-dark"].forEach(k => localStorage.removeItem(k));
    } catch { /* ignore */ }
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
    } catch (err) { console.error("Export failed:", err); }
  }

  const roleBadgeColor =
    userProfile?.role === "tutor" ? { bg: T.accentLight, text: T.accent }
    : userProfile?.role === "admin" ? { bg: T.goldLight, text: T.goldDark }
    : { bg: T.successBg, text: T.success };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>
      <PageHeader title="Settings" subtitle="Manage your preferences, notifications, and account" />

      {/* ━━━ 0. Profile ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>Your Profile</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 16, borderBottom: `1px solid ${T.border}`, marginBottom: 16 }}>
          {state?.myAvatar
            ? <AvatarDisplay avatarKey={state.myAvatar} size={56} radius={T.r2} />
            : <div style={{ width: 56, height: 56, borderRadius: T.r2, background: `linear-gradient(135deg, ${T.accent}, #B45309)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 20 }}>
                {(userProfile?.name || authUser?.displayName || "U").charAt(0).toUpperCase()}
              </div>
          }
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{nameValue || userProfile?.name || authUser?.displayName || "User"}</div>
            <div style={{ fontSize: 12, color: T.textTer, marginTop: 2 }}>{authUser?.email}</div>
          </div>
          <button onClick={() => setShowAvatarPicker(v => !v)}
            style={{ padding: "7px 16px", borderRadius: T.r5, border: `1px solid ${T.border}`, background: T.bgMuted, color: T.textSec, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {showAvatarPicker ? "Close" : "Change Avatar"}
          </button>
        </div>
        {showAvatarPicker && (
          <AvatarPicker
            value={state?.myAvatar}
            onSave={(key) => {
              dispatch({ type: "SET_MY_AVATAR", payload: key });
              const matchedStudent = (Array.isArray(state?.students) ? state.students : [])
                .find(s => s.email && authUser?.email && s.email.toLowerCase() === authUser.email.toLowerCase());
              if (matchedStudent) dispatch({ type: "UPDATE_STUDENT_AVATAR", payload: { studentId: matchedStudent.id, avatar: key } });
              setShowAvatarPicker(false);
            }}
            onCancel={() => setShowAvatarPicker(false)}
          />
        )}
      </div>

      {/* ━━━ 1. Appearance ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>Appearance</h2>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Dark Mode</div>
            <div id="dark-mode-desc" style={descStyle}>Switch between light and dark themes</div>
          </div>
          <ToggleSwitch checked={darkMode} onChange={setDarkMode} aria-label="Dark Mode" aria-describedby="dark-mode-desc" />
        </div>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Font Size</div>
            <div style={descStyle}>Adjust the text size across the app</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["small", "medium", "large"].map((size) => (
              <button key={size} onClick={() => setFontSize(size)}
                style={{ padding: "6px 14px", borderRadius: T.r1, border: `1px solid ${fontSize === size ? T.accent : T.border}`, background: fontSize === size ? T.accentLight : "transparent", color: fontSize === size ? T.accent : T.textSec, fontWeight: fontSize === size ? 700 : 500, fontSize: size === "small" ? 11 : size === "large" ? 15 : 13, cursor: "pointer", textTransform: "capitalize", transition: "all 0.15s" }}>
                {size === "small" ? "A" : size === "medium" ? "A" : "A"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div>
            <div style={labelStyle}>Start with Sidebar Collapsed</div>
            <div id="sidebar-default-desc" style={descStyle}>Open the app with the sidebar minimised by default</div>
          </div>
          <ToggleSwitch checked={sidebarDefault} onChange={setSidebarDefault} aria-label="Start with Sidebar Collapsed" aria-describedby="sidebar-default-desc" />
        </div>
      </div>

      {/* ━━━ 2. Notifications ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>Notifications</h2>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Homework Reminders</div>
            <div id="homework-reminders-desc" style={descStyle}>Get notified about upcoming homework deadlines</div>
          </div>
          <ToggleSwitch checked={notifPrefs.homeworkReminders} onChange={v => updateNotifPref("homeworkReminders", v)} aria-label="Homework Reminders" aria-describedby="homework-reminders-desc" />
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div>
            <div style={labelStyle}>Community Activity</div>
            <div id="community-activity-desc" style={descStyle}>Notifications for comments and reactions on your posts</div>
          </div>
          <ToggleSwitch checked={notifPrefs.communityActivity} onChange={v => updateNotifPref("communityActivity", v)} aria-label="Community Activity" aria-describedby="community-activity-desc" />
        </div>
      </div>

      {/* ━━━ 3. Account ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>Account</h2>

        <div style={rowStyle}>
          <div style={labelStyle}>Email</div>
          <div style={{ fontSize: 13, color: T.textSec }}>{authUser?.email || "—"}</div>
        </div>

        <div style={{ ...rowStyle, alignItems: editingName ? "flex-start" : "center", paddingTop: editingName ? 14 : 12 }}>
          <div>
            <div style={labelStyle}>Display Name</div>
            {editingName && <div style={{ ...descStyle, marginTop: 4 }}>Press Enter to save, Escape to cancel</div>}
          </div>
          {editingName ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <input
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") handleCancelName(); }}
                style={{ padding: "7px 12px", borderRadius: T.r2, border: `1.5px solid ${T.accent}`, fontSize: 13, color: T.text, background: T.bgCard, fontFamily: T.fontBody, outline: "none", width: 200 }}
                autoFocus
              />
              <button onClick={handleSaveName} disabled={nameSaving || !nameValue.trim()}
                style={{ padding: "7px 14px", borderRadius: T.r2, background: T.accent, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, opacity: nameSaving ? 0.6 : 1 }}>
                {nameSaving ? "Saving…" : "Save"}
              </button>
              <button onClick={handleCancelName}
                style={{ padding: "7px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: "transparent", color: T.textSec, cursor: "pointer", fontSize: 12 }}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: T.textSec }}>{nameValue || "—"}</span>
              <button onClick={() => setEditingName(true)}
                style={{ padding: "5px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, color: T.textSec, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>
                Edit
              </button>
            </div>
          )}
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div style={labelStyle}>Role</div>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 12px", borderRadius: T.r1, background: roleBadgeColor.bg, color: roleBadgeColor.text }}>
            {userProfile?.role === "tutor" ? "Creator" : "A-Worthling"}
          </span>
        </div>
      </div>

      {/* ━━━ 4. Study Tools ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>Study Tools</h2>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Pomodoro Focus Duration</div>
            <div style={descStyle}>Minutes per focus session</div>
          </div>
          <PillPicker value={pomodoroPrefs.workMin} options={WORK_MIN_OPTIONS} onChange={v => setPomodoroPrefs(p => ({ ...p, workMin: v }))} format={v => `${v}m`} />
        </div>

        <div style={rowStyle}>
          <div>
            <div style={labelStyle}>Pomodoro Break Duration</div>
            <div style={descStyle}>Minutes per break</div>
          </div>
          <PillPicker value={pomodoroPrefs.breakMin} options={BREAK_MIN_OPTIONS} onChange={v => setPomodoroPrefs(p => ({ ...p, breakMin: v }))} format={v => `${v}m`} />
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div>
            <div style={labelStyle}>Hide Fully-Graded Homework</div>
            <div id="hide-hw-desc" style={descStyle}>Remove assignments from the list once all submissions are graded</div>
          </div>
          <ToggleSwitch checked={hideCompletedHw} onChange={setHideCompletedHw} aria-label="Hide Fully-Graded Homework" aria-describedby="hide-hw-desc" />
        </div>
      </div>

      {/* ━━━ 5. Default Page ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>Default Page</h2>
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div>
            <div style={labelStyle}>Open on Login</div>
            <div style={descStyle}>Which page to land on when opening the app at the root URL</div>
          </div>
          <div style={{ width: 180 }}>
            <Select value={defaultPage} onChange={setDefaultPage} options={LANDING_OPTIONS} />
          </div>
        </div>
      </div>

      {/* ━━━ 6. Data ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>Data</h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {!showClearConfirm ? (
            <button onClick={() => setShowClearConfirm(true)}
              style={{ padding: "10px 20px", borderRadius: T.r2, border: `1px solid ${T.danger}`, background: "transparent", color: T.danger, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = T.dangerBg}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              Clear Local Data
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: T.r2, background: T.dangerBg, border: `1px solid ${T.danger}33` }}>
              <span style={{ fontSize: 13, color: T.danger, fontWeight: 600 }}>Are you sure? This cannot be undone.</span>
              <button onClick={handleClearData} style={{ padding: "6px 14px", borderRadius: T.r1, border: "none", background: T.danger, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Yes, clear</button>
              <button onClick={() => setShowClearConfirm(false)} style={{ padding: "6px 14px", borderRadius: T.r1, border: `1px solid ${T.border}`, background: "transparent", color: T.textSec, fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Cancel</button>
            </div>
          )}
          <button onClick={handleExportData}
            style={{ padding: "10px 20px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: "transparent", color: T.text, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = T.bgMuted}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            Export My Data
          </button>
        </div>
      </div>

      {/* ━━━ 7. About ━━━ */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>About</h2>
        <div style={rowStyle}>
          <div style={labelStyle}>Version</div>
          <div style={{ fontSize: 13, color: T.textSec, fontFamily: T.fontMono }}>1.0.0</div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Made with</div>
          <div style={{ fontSize: 13, color: T.textSec }}>Built with care in Singapore</div>
        </div>
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div style={labelStyle}>Privacy Policy</div>
          <a href="/privacy" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 13, color: T.accent, fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
            View Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
