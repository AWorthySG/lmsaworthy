import React, { useState, useReducer, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { T } from "./theme/theme.js";
import { List, CaretDown, House, Books, ClipboardText, Handshake, Crown, Bell, MagnifyingGlass } from "./icons/icons.jsx";
import { firebaseAuth, firebaseDb, ref, get, signOut, onAuthStateChanged } from "./config/firebase.js";
import { appReducer } from "./state/reducer.js";
import { initialState, savePersistedState } from "./state/persistence.js";
import { NAV, PAGE_TO_PATH, PATH_TO_PAGE } from "./data/routing.js";
import useWindowWidth from "./hooks/useWindowWidth.js";
import { requestPushPermission, sendLocalNotification } from "./utils/notifications.js";
import { EmptyStateIllustration } from "./components/ui/EmptyState.jsx";
import ToastContainer from "./components/toast/ToastContainer.jsx";
import BackToTop from "./components/ui/BackToTop.jsx";
import { CelebrationOverlay } from "./components/gamification/CelebrationOverlay.jsx";
import DailyRewardModal from "./components/gamification/DailyRewardModal.jsx";
import LoginScreen from "./pages/LoginScreen.jsx";

// Page imports
import Dashboard, { StudentDashboard } from "./pages/Dashboard.jsx";
import ContentLibrary from "./pages/ContentLibrary.jsx";
import VideoLessons from "./pages/VideoLessons.jsx";
import QuizGenerator from "./pages/QuizGenerator.jsx";
import MockExams from "./pages/MockExams.jsx";
import Attendance from "./pages/Attendance.jsx";
import ProgressTracker from "./pages/ProgressTracker.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Community from "./pages/Community.jsx";
import Classroom from "./pages/Classroom.jsx";
import LiveInfographics from "./pages/infographics/LiveInfographics.jsx";
import PracticeQuestions from "./pages/tools/PracticeQuestions.jsx";
import SubjectDrills from "./pages/tools/SubjectDrills.jsx";
import TimedEssayWriter from "./pages/tools/TimedEssayWriter.jsx";
import VocabBuilder from "./pages/tools/VocabBuilder.jsx";
import ExampleConnector from "./pages/tools/ExampleConnector.jsx";
import EssayGrader from "./pages/tools/EssayGrader.jsx";
import Homework from "./pages/homework/Homework.jsx";
import GameHub from "./pages/games/GameHub.jsx";
import Events from "./pages/Events.jsx";
import PastPapers from "./pages/study/PastPapers.jsx";
import MicrolearningPage from "./pages/study/MicrolearningPage.jsx";
import PeerReview from "./pages/study/PeerReview.jsx";
import AnalyticsDashboard from "./pages/AnalyticsDashboard.jsx";
import ParentView from "./pages/ParentView.jsx";
import NotesPage from "./pages/study/NotesPage.jsx";
import ModelEssayBank from "./pages/study/ModelEssayBank.jsx";
import GoalSetting from "./pages/study/GoalSetting.jsx";
import MistakeJournal from "./pages/study/MistakeJournal.jsx";
import RevisionChecklist from "./pages/study/RevisionChecklist.jsx";
import FormulaCards from "./pages/tools/FormulaCards.jsx";

export default function LMSAuthWrapper() {
  const [authUser, setAuthUser] = useState(undefined); // undefined=loading, null=logged out, object=logged in
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // Fetch profile from database
        try {
          const snap = await get(ref(firebaseDb, `users/${user.uid}`));
          const profile = snap.val();
          setUserProfile(profile || { name: user.displayName || "User", email: user.email, role: "student" });
        } catch {
          setUserProfile({ name: user.displayName || "User", email: user.email, role: "student" });
        }
        setAuthUser(user);
      } else {
        setAuthUser(null);
        setUserProfile(null);
      }
    });
    return unsub;
  }, []);

  // Loading state
  if (authUser === undefined) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0F1A" }}>
        <div style={{ textAlign: "center" }}>
          <img src="/logo-aworthy.jpeg" alt="A Worthy" style={{ height: 48, objectFit: "contain", marginBottom: 12, borderRadius: 8 }} />
          <div style={{ fontSize: 12, color: "rgba(254,254,254,0.3)", fontWeight: 200, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Loading</div>
        </div>
      </div>
    );
  }

  // Not logged in — show login screen
  if (!authUser) {
    return <LoginScreen />;
  }

  // Logged in — show the LMS
  return <LMS authUser={authUser} userProfile={userProfile} />;
}

function LMS({ authUser, userProfile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useReducer(appReducer, initialState);
  // Persist state changes to localStorage
  useEffect(() => { savePersistedState(state); }, [state]);
  // Set role from user profile on login
  useEffect(() => {
    if (userProfile?.role && state.role !== userProfile.role) {
      dispatch({ type: "SET_ROLE", payload: userProfile.role });
    }
  }, [userProfile?.role]);

  // ━━━ URL → Page: On initial load or browser back/forward, sync URL to state
  const initializedRef = useRef(false);
  useEffect(() => {
    const pageFromUrl = PATH_TO_PAGE[location.pathname] || "dashboard";
    if (state.page !== pageFromUrl) {
      dispatch({ type: "SET_PAGE", payload: pageFromUrl });
    }
    initializedRef.current = true;
  }, [location.pathname]);

  // ━━━ Page → URL: When state.page changes (via dispatch), push URL
  const prevPageRef = useRef(state.page);
  useEffect(() => {
    if (!initializedRef.current) return;
    if (state.page !== prevPageRef.current) {
      const path = PAGE_TO_PATH[state.page] || "/";
      if (location.pathname !== path) {
        navigate(path);
      }
      prevPageRef.current = state.page;
    }
  }, [state.page]);

  // Compute notifications
  const notifications = [];
  const today = new Date().toISOString().split("T")[0];
  state.homework.filter(h => h.status === "active" && h.dueDate >= today).forEach(h => {
    notifications.push({ type: "homework", msg: `"${h.title}" due ${h.dueDate}`, page: "homework" });
  });
  const pendingGrades = state.submissions.filter(s => s.status === "submitted").length;
  if (pendingGrades > 0 && state.role === "tutor") notifications.push({ type: "grading", msg: `${pendingGrades} submission${pendingGrades > 1 ? "s" : ""} pending grading`, page: "homework" });
  // Daily reward notification disabled
  // if (state.wallet.lastClaim !== today) notifications.push({ type: "reward", msg: "Daily login reward available!", page: "dashboard" });
  const [showNotifs, setShowNotifs] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [celebration, setCelebration] = useState(null); // null | "coins" | "streak" | "levelup"
  // Listen for celebration events from child components
  useEffect(() => {
    const handler = (e) => setCelebration(e.detail.type);
    window.addEventListener("aworthy-celebrate", handler);
    return () => window.removeEventListener("aworthy-celebrate", handler);
  }, []);
  const [expandedSection, setExpandedSection] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("aworthy-dark") === "true");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const windowWidth = useWindowWidth();
  const isMobileLayout = windowWidth < 768;
  // On mobile, sidebar starts closed
  useEffect(() => { if (isMobileLayout) setSidebarOpen(false); }, [isMobileLayout]);
  const page = state.page;

  // Dark mode persistence
  useEffect(() => { localStorage.setItem("aworthy-dark", darkMode); document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);

  // Request push notification permission on first load
  useEffect(() => { requestPushPermission(); }, []);

  // Push notifications for homework due dates
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    state.homework.filter(h => h.status === "active" && h.dueDate === tomorrow).forEach(h => {
      sendLocalNotification("📋 Homework Due Tomorrow", `"${h.title}" is due ${h.dueDate}`);
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e) {
      if (e.metaKey && e.key === "k") { e.preventDefault(); setShowSearch(s => !s); }
      if (e.key === "Escape") { setShowSearch(false); setShowNotifs(false); }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  useEffect(() => { if (showSearch && searchRef.current) searchRef.current.focus(); }, [showSearch]);

  // Global search results
  const searchResults = searchQuery.trim().length > 1 ? [
    ...state.resources.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(r => ({ type: "📄", label: r.title, page: "library" })),
    ...state.homework.filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map(h => ({ type: "📋", label: h.title, page: "homework" })),
    ...state.videoLessons.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map(v => ({ type: "🎬", label: v.title, page: "videos" })),
    ...(state.posts || []).filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2).map(p => ({ type: "💬", label: p.title, page: "community" })),
    ...NAV.flatMap(g => g.items).filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase())).map(i => ({ type: "🔗", label: i.label, page: i.id })),
  ].slice(0, 8) : [];

  // Notification badge counts
  const hwBadge = state.role === "tutor" ? state.submissions.filter(s => s.status === "submitted").length : state.homework.filter(h => h.status === "active").length;
  const attendanceBadge = state.role === "tutor" ? state.sessions.filter(s => { const rec = state.attendance[s.id] || {}; return Object.keys(rec).length < state.students.length; }).length : 0;

  // Daily reward modal disabled — can be re-enabled later
  // useEffect(() => {
  //   const today = new Date().toISOString().split("T")[0];
  //   if (state.wallet.lastClaim !== today) {
  //     const timer = setTimeout(() => setShowRewardModal(true), 800);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard state={state} dispatch={dispatch} />;
      case "library": return <ContentLibrary state={state} dispatch={dispatch} />;
      case "videos": return <VideoLessons state={state} dispatch={dispatch} />;
      case "quizzes": return <QuizGenerator state={state} dispatch={dispatch} />;
      case "exams": return <MockExams state={state} />;
      case "attendance": return <Attendance state={state} dispatch={dispatch} />;
      case "progress": return <ProgressTracker state={state} dispatch={dispatch} />;
      case "leaderboard": return <Leaderboard state={state} dispatch={dispatch} />;
      case "community": return <Community state={state} dispatch={dispatch} />;
      case "classroom": return <Classroom state={state} dispatch={dispatch} userProfile={userProfile} />;
      case "infographics": return <LiveInfographics state={state} dispatch={dispatch} />;
      case "practice": return <PracticeQuestions />;
      case "practice-eng": return <SubjectDrills subject="eng" />;
      // case "practice-ipeng": return <SubjectDrills subject="ipeng" />;
      case "practice-h1econ": return <SubjectDrills subject="h1econ" />;
      case "practice-h2econ": return <SubjectDrills subject="h2econ" />;
      case "timedwrite": return <TimedEssayWriter />;
      case "vocab": return <VocabBuilder />;
      case "connector": return <ExampleConnector />;
      case "essaygrader": return <EssayGrader />;
      case "homework": return <Homework state={state} dispatch={dispatch} />;
      case "games-eng": return <GameHub subject="eng" />;
      // case "games-ipeng": return <GameHub subject="ipeng" />;
      case "games-gp": return <GameHub subject="gp" />;
      case "games-h1econ": return <GameHub subject="h1econ" />;
      case "games-h2econ": return <GameHub subject="h2econ" />;
      case "events": return <Events state={state} dispatch={dispatch} />;
      case "pastpapers": return <PastPapers state={state} dispatch={dispatch} />;
      case "pastpapers-eng": return <PastPapers state={state} dispatch={dispatch} defaultSubject="eng" />;
      case "pastpapers-gp": return <PastPapers state={state} dispatch={dispatch} defaultSubject="gp" />;
      case "pastpapers-h1econ": return <PastPapers state={state} dispatch={dispatch} defaultSubject="h1econ" />;
      case "pastpapers-h2econ": return <PastPapers state={state} dispatch={dispatch} defaultSubject="h2econ" />;
      case "microlearning": return <MicrolearningPage state={state} dispatch={dispatch} />;
      case "micro-eng": return <MicrolearningPage state={state} dispatch={dispatch} defaultSubject="eng" />;
      case "micro-gp": return <MicrolearningPage state={state} dispatch={dispatch} defaultSubject="gp" />;
      case "micro-h1econ": return <MicrolearningPage state={state} dispatch={dispatch} defaultSubject="h1econ" />;
      case "micro-h2econ": return <MicrolearningPage state={state} dispatch={dispatch} defaultSubject="h2econ" />;
      case "peerreview": return <PeerReview state={state} dispatch={dispatch} />;
      case "analytics": return <AnalyticsDashboard state={state} />;
      case "parentview": return <ParentView state={state} />;
      case "notes": return <NotesPage state={state} dispatch={dispatch} />;
      case "modelessays": return <ModelEssayBank state={state} dispatch={dispatch} />;
      case "goals": return <GoalSetting state={state} dispatch={dispatch} />;
      case "mistakes": return <MistakeJournal state={state} dispatch={dispatch} />;
      case "checklist": return <RevisionChecklist state={state} dispatch={dispatch} />;
      case "formulas": return <FormulaCards />;
      default: return <Dashboard state={state} dispatch={dispatch} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: T.bg, color: T.text, fontSize: 14, lineHeight: 1.6 }}>
      {/* Celebration overlay */}
      {celebration && <CelebrationOverlay type={celebration} onComplete={() => setCelebration(null)} />}
      {/* Daily Reward Modal */}
      {showRewardModal && (
        <DailyRewardModal
          wallet={state.wallet}
          onClaim={() => {
            const prevStreak = state.wallet.streak;
            dispatch({ type: "CLAIM_DAILY_REWARD" });
            // Trigger celebration: streak milestone (7,14,21,30) or normal coins
            const nextStreak = (state.wallet.lastClaim === new Date(Date.now() - 86400000).toISOString().split("T")[0]) ? prevStreak + 1 : 1;
            if (nextStreak % 7 === 0) setCelebration("streak");
            else setCelebration("coins");
          }}
          onClose={() => setShowRewardModal(false)}
        />
      )}
      {/* Mobile overlay backdrop */}
      {isMobileLayout && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: T.bgOverlay, zIndex: 49, transition: "opacity 0.2s" }} />}
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : (isMobileLayout ? 0 : 64),
        background: T.bgSidebar, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", transition: "width 0.25s ease", flexShrink: 0,
        overflowX: "hidden", overflowY: "hidden",
        ...(isMobileLayout ? { position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50, boxShadow: sidebarOpen ? T.shadow3 : "none" } : {}),
      }}>
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? "18px 16px 12px" : "18px 12px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.border}` }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 10, display: "flex", borderRadius: T.r1, minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = T.bgMuted}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <List size={20} color={T.textSec} />
          </button>
          {sidebarOpen && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/logo-aworthy.jpeg" alt="A Worthy" style={{ height: 36, objectFit: "contain", borderRadius: 8 }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.02em" }}>A Worthy</span>
                <span style={{ fontSize: 9, fontWeight: 500, color: T.textTer, letterSpacing: "0.05em" }}>Learning Platform</span>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <div style={{ flex: "1 1 0%", position: "relative", minHeight: 0 }}>
        <nav style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: sidebarOpen ? "4px 8px" : "4px 6px", overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>
          {NAV.filter(g => !g.tutorOnly || state.role === "tutor").map((group, gi) => {
            const subjTheme = group.subject ? T[group.subject] : null;
            const isSubject = !!group.subject;
            const isExpanded = expandedSection === group.group;
            const hasActiveChild = group.items.some(item => page === item.id);

            // Auto-expand if a child page is active
            const showItems = isSubject ? (isExpanded || hasActiveChild) : true;

            return (
            <div key={group.group}>
              {/* Section header — clickable for subjects, static for non-subjects */}
              {sidebarOpen && (
                isSubject ? (
                  <button onClick={() => setExpandedSection(isExpanded ? null : group.group)}
                    style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "8px 10px", marginTop: gi > 0 ? 4 : 0, borderRadius: T.r2, border: "none", background: hasActiveChild ? (subjTheme?.bg || T.bgMuted) : "transparent", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { if (!hasActiveChild) e.currentTarget.style.background = T.bgHover; }}
                    onMouseLeave={e => { if (!hasActiveChild) e.currentTarget.style.background = hasActiveChild ? (subjTheme?.bg || T.bgMuted) : "transparent"; }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: hasActiveChild ? (subjTheme?.accent || T.accent) : T.textTer, flexShrink: 0, boxShadow: hasActiveChild ? `0 0 6px ${subjTheme?.accent || T.accent}60` : "none", transition: "all 0.2s" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: hasActiveChild ? (subjTheme?.accent || T.accent) : T.textSec, flex: 1, textAlign: "left", letterSpacing: "0.01em" }}>{group.group}</span>
                    <CaretDown size={12} color={hasActiveChild ? (subjTheme?.accent || T.accent) : T.textTer} style={{ transform: showItems ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                  </button>
                ) : (
                  gi > 0 ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 10px 4px", marginTop: 4 }}>
                      <div style={{ flex: 1, height: 1, background: T.border }} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>{group.group}</span>
                      <div style={{ flex: 1, height: 1, background: T.border }} />
                    </div>
                  ) : null
                )
              )}
              {!sidebarOpen && gi > 0 && <div style={{ height: 1, background: T.border, margin: "4px 6px" }} />}

              {/* Items — collapsible for subjects, always visible otherwise */}
              {showItems && (
                <div style={{ animation: isSubject ? "fadeSlideIn 0.15s ease" : "none" }}>
                  {group.items.map((item, itemIdx) => {
                    const active = page === item.id;
                    const hl = item.highlight && !active;
                    const activeAccent = isSubject ? (subjTheme?.accent || T.accent) : T.accent;
                    const activeBg = isSubject ? (subjTheme?.bg || T.accentLight) : T.accentLight;
                    return (
                      <button key={item.id} onClick={() => { dispatch({ type: "SET_PAGE", payload: item.id }); if (isMobileLayout) setSidebarOpen(false); }} title={item.label}
                        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.06)" : T.bgHover; }}
                        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = active ? activeBg : "transparent"; }}
                        style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: sidebarOpen ? "9px 10px 9px 22px" : "10px 0", borderRadius: T.r2, border: "none", background: active ? activeBg : "transparent", color: active ? activeAccent : T.textSec, cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 450, marginBottom: 1, transition: "background 0.15s, color 0.15s", whiteSpace: "nowrap", justifyContent: sidebarOpen ? "flex-start" : "center", minHeight: 38, animation: isSubject ? `itemIn 0.15s ease ${itemIdx * 25}ms both` : "none", position: "relative" }}>
                        {/* Active indicator bar */}
                        {active && <div style={{ position: "absolute", left: sidebarOpen ? 8 : 4, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, borderRadius: 3, background: activeAccent, animation: "scaleIn 0.2s ease", boxShadow: `0 0 6px ${activeAccent}60` }} />}
                        <item.icon size={17} color={active ? activeAccent : T.textTer} />
                        {sidebarOpen && <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>}
                        {/* Notification badges */}
                        {sidebarOpen && item.id === "homework" && hwBadge > 0 && <span style={{ background: T.accent, color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 10, minWidth: 16, textAlign: "center" }}>{hwBadge}</span>}
                        {sidebarOpen && item.id === "attendance" && attendanceBadge > 0 && <span style={{ background: T.warning, color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 10, minWidth: 16, textAlign: "center" }}>{attendanceBadge}</span>}
                        {sidebarOpen && hl && !hwBadge && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3D9470", animation: "breathe 2.5s ease infinite" }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
          })}
        </nav>
        </div>

        {/* Bottom: coin bar + profile */}
        {sidebarOpen && (
          <div style={{ padding: "10px 10px 12px", borderTop: `1px solid ${T.border}`, background: T.bgMuted + "80" }}>
            {/* Coin + Streak bar — enhanced */}
            <button onClick={() => setShowRewardModal(true)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: T.r2, background: "linear-gradient(135deg, #0F172A, #1E2A4A)", border: "1px solid rgba(212,162,84,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,162,84,0.35)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,162,84,0.15)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>🪙</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#D4A254", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{state.wallet.coins}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>coins</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>🔥</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#818CF8", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{state.wallet.streak}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>day streak</span>
              </div>
            </button>
            {/* User profile */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 4px 8px" }}>
              <div style={{ width: 34, height: 34, borderRadius: T.r2, background: state.role === "tutor" ? T.gradPrimary : "linear-gradient(135deg, #0D9488, #14B8A6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", flexShrink: 0 }}>{(userProfile?.name || authUser?.displayName || "U").charAt(0).toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: T.text, fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userProfile?.name || authUser?.displayName || "User"}</div>
                <div style={{ color: T.textTer, fontSize: 10, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
                  {userProfile?.role === "tutor" ? "Creator" : "Student"}
                </div>
              </div>
            </div>
            {/* Action buttons */}
            <div style={{ display: "flex", gap: 6 }}>
              {userProfile?.role === "tutor" && (
                <button onClick={() => dispatch({ type: "SET_ROLE", payload: state.role === "tutor" ? "student" : "tutor" })}
                  style={{ flex: 1, padding: "8px", borderRadius: T.r1, background: T.bgCard, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 11, fontWeight: 600, color: T.textSec, textAlign: "center", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSec; }}>
                  {state.role === "tutor" ? "👁 Student" : "✏️ Tutor"}
                </button>
              )}
              <button onClick={() => signOut(firebaseAuth)}
                style={{ flex: userProfile?.role === "tutor" ? "none" : 1, padding: "8px 12px", borderRadius: T.r1, background: T.bgCard, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 11, fontWeight: 500, color: T.textTer, textAlign: "center", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.danger; e.currentTarget.style.color = T.danger; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textTer; }}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: isMobileLayout ? "0 16px 80px" : "0 40px 28px", overflowY: "auto", maxHeight: "100dvh", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
        {/* Top bar — mobile: hamburger + logo + bell. Desktop: just bell */}
        <div className="glass-header" style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobileLayout ? "12px 0" : "14px 0 8px", position: "sticky", top: 0, zIndex: 10, maxWidth: 1080, margin: "0 auto" }}>
          {isMobileLayout && (
            <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: T.r1, padding: 10, cursor: "pointer", display: "flex", minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}>
              <List size={20} color={T.textSec} />
            </button>
          )}
          {isMobileLayout && <img src="/logo-aworthy.jpeg" alt="A Worthy" style={{ height: 28, objectFit: "contain" }} />}
          <div style={{ flex: 1 }} />
          {/* Search button */}
          <button onClick={() => setShowSearch(true)} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: T.r1, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, minHeight: 40, fontSize: 12, color: T.textTer }}>
            <MagnifyingGlass size={14} /> {!isMobileLayout && <span>Search</span>} {!isMobileLayout && <kbd style={{ fontSize: 10, padding: "1px 5px", borderRadius: 4, background: T.bgMuted, border: `1px solid ${T.border}`, color: T.textTer, fontFamily: "'JetBrains Mono', monospace" }}>⌘K</kbd>}
          </button>
          {/* Dark mode toggle */}
          <button onClick={() => setDarkMode(d => !d)} title={darkMode ? "Light mode" : "Dark mode"} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: T.r1, padding: 10, cursor: "pointer", display: "flex", minWidth: 40, minHeight: 40, alignItems: "center", justifyContent: "center", fontSize: 16 }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          {/* Notification bell */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNotifs(n => !n)} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: T.r1, padding: 10, cursor: "pointer", display: "flex", position: "relative", minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}>
              <Icon icon="fluent-emoji-flat:bell" width={20} height={20} />
              {notifications.length > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: T.accent, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{notifications.length}</div>}
            </button>
            {showNotifs && (
              <div className="scale-pop" style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, width: 280, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r2, boxShadow: T.shadow3, zIndex: 100, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, fontSize: 12, fontWeight: 600, color: T.text }}>Notifications</div>
                {notifications.length === 0 ? (
                  <div style={{ padding: "20px 14px", textAlign: "center", fontSize: 12, color: T.textTer }}><EmptyStateIllustration type="celebration" size={60} /><div style={{ marginTop: 6 }}>All caught up!</div></div>
                ) : notifications.map((n, i) => (
                  <button key={i} onClick={() => { dispatch({ type: "SET_PAGE", payload: n.page }); setShowNotifs(false); if (n.type === "reward") setShowRewardModal(true); }}
                    style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderBottom: `1px solid ${T.border}`, background: "none", border: "none", borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: T.border, cursor: "pointer", width: "100%", textAlign: "left" }}>
                    <span style={{ fontSize: 14 }}>{n.type === "homework" ? "📋" : n.type === "grading" ? "✏️" : "🎁"}</span>
                    <span style={{ fontSize: 12, color: T.text, lineHeight: 1.4 }}>{n.msg}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Tutor Announcement Banner */}
        {state.announcement && (
          <div style={{ maxWidth: 1080, margin: "0 auto 8px", padding: "10px 16px", borderRadius: T.r2, background: "linear-gradient(135deg, #0F172A, #1E2A4A)", color: "#fff", display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
            <span style={{ fontSize: 16 }}>📢</span>
            <span style={{ flex: 1, fontWeight: 600 }}>{state.announcement}</span>
            {state.role === "tutor" && <button onClick={() => dispatch({ type: "SET_ANNOUNCEMENT", payload: null })} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: T.r1, padding: "4px 10px", cursor: "pointer", fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Dismiss</button>}
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ maxWidth: 1080, margin: "0 auto", paddingTop: isMobileLayout ? 8 : 24 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast notifications */}
      <ToastContainer toasts={state.toasts} dispatch={dispatch} />

      {/* Back to top button */}
      <BackToTop />

      {/* ═══ GLOBAL SEARCH OVERLAY (Cmd+K) ═══ */}
      <AnimatePresence>
        {showSearch && (
          <motion.div onClick={() => setShowSearch(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "8vh" }}>
            <motion.div onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.2, ease: "easeOut" }} style={{ width: "100%", maxWidth: 520, background: darkMode ? "#0B0F1A" : T.bgCard, borderRadius: T.r3, boxShadow: "0 25px 80px rgba(0,0,0,0.4)", border: `1px solid ${T.border}`, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: `1px solid ${T.border}`, background: T.bgMuted }}>
                <MagnifyingGlass size={18} color={T.accent} />
                <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search resources, homework, pages, students..."
                  autoFocus
                  style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 15, color: T.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }} />
                <kbd style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: T.bgCard, border: `1px solid ${T.border}`, color: T.textTer, fontWeight: 600 }}>ESC</kbd>
              </div>
              {searchResults.length > 0 ? (
                <div style={{ maxHeight: 360, overflowY: "auto" }}>
                  {searchResults.map((r, i) => (
                    <motion.button key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} onClick={() => { dispatch({ type: "SET_PAGE", payload: r.page }); setShowSearch(false); setSearchQuery(""); }}
                      style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 20px", border: "none", borderBottom: `1px solid ${T.border}`, background: "none", cursor: "pointer", textAlign: "left", fontSize: 13, color: T.text, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.bgMuted; e.currentTarget.style.paddingLeft = "24px"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.paddingLeft = "20px"; }}>
                      <span style={{ fontSize: 18, minWidth: 24 }}>{r.type}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</div>
                        {r.category && <div style={{ fontSize: 11, color: T.textTer, marginTop: 2 }}>{r.category}</div>}
                      </div>
                      <span style={{ fontSize: 11, color: T.textTer, fontWeight: 500 }}>↵</span>
                    </motion.button>
                  ))}
                </div>
              ) : searchQuery.trim().length > 1 ? (
                <div style={{ padding: "32px 20px", textAlign: "center", fontSize: 13, color: T.textTer }}>No results for "{searchQuery}"</div>
              ) : (
                <div style={{ padding: "20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Quick Access</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                    {[
                      { label: "Dashboard", page: "dashboard", emoji: "🏠" },
                      { label: "Homework", page: "homework", emoji: "📋" },
                      { label: "Leaderboard", page: "leaderboard", emoji: "🏆" },
                      { label: "Community", page: "community", emoji: "👥" },
                    ].map(q => (
                      <button key={q.page} onClick={() => { dispatch({ type: "SET_PAGE", payload: q.page }); setShowSearch(false); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.text, transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = T.border; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = T.bgMuted; e.currentTarget.style.transform = "none"; }}>
                        <span>{q.emoji}</span>{q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MOBILE BOTTOM NAVIGATION ═══ */}
      {isMobileLayout && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: darkMode ? "rgba(11,15,26,0.97)" : "rgba(255,255,255,0.97)", borderTop: `1px solid ${T.border}`, display: "flex", zIndex: 60, paddingBottom: "env(safe-area-inset-bottom, 0px)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
          {[
            { id: "dashboard", icon: House, label: "Home" },
            { id: "library", icon: Books, label: "Library" },
            { id: "homework", icon: ClipboardText, label: "Work", badge: hwBadge },
            { id: "community", icon: Handshake, label: "Social" },
            { id: "leaderboard", icon: Crown, label: "Rank" },
          ].map(tab => {
            const active = page === tab.id;
            return (
              <button key={tab.id} onClick={() => dispatch({ type: "SET_PAGE", payload: tab.id })}
                style={{ flex: 1, padding: "8px 4px 6px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, position: "relative", minHeight: 52, transition: "transform 0.1s ease" }}
                onTouchStart={e => e.currentTarget.style.transform = "scale(0.92)"}
                onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}>
                {/* Active background pill */}
                {active && (
                  <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 44, height: 30, borderRadius: 10, background: T.accentLight, zIndex: 0 }} />
                )}
                <tab.icon size={20} color={active ? T.accent : T.textTer} style={{ position: "relative", zIndex: 1 }} />
                <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? T.accent : T.textTer, position: "relative", zIndex: 1 }}>{tab.label}</span>
                {tab.badge > 0 && <div style={{ position: "absolute", top: 4, right: "calc(50% - 16px)", width: 14, height: 14, borderRadius: "50%", background: T.danger, color: "#fff", fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>{tab.badge}</div>}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
