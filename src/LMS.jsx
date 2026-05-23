import React, { useState, useReducer, useRef, useEffect, useMemo, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { T } from "./theme/theme.js";
import { List, CaretDown, House, Books, ClipboardText, Handshake, Bell, MagnifyingGlass, Megaphone, PencilSimpleLine, FilePdf, PlayCircle, ChatCircle, ArrowSquareOut, Users } from "./icons/icons.jsx";
import { firebaseAuth, firebaseDb, ref, get, signOut, onAuthStateChanged } from "./config/firebase.js";
import { appReducer } from "./state/reducer.js";
import { initialState, savePersistedState } from "./state/persistence.js";
import { NAV, PAGE_TO_PATH, PATH_TO_PAGE } from "./data/routing.js";
import useWindowWidth from "./hooks/useWindowWidth.js";
import { requestPushPermission, sendHomeworkReminders } from "./utils/notifications.js";
import useFirebaseSync from "./hooks/useFirebaseSync.js";
import { PageErrorBoundary } from "./components/ui";
import { EmptyStateIllustration } from "./components/ui/EmptyState.jsx";
import ToastContainer from "./components/toast/ToastContainer.jsx";
import BackToTop from "./components/ui/BackToTop.jsx";
import InstallPrompt from "./components/ui/InstallPrompt.jsx";
import LoginScreen from "./pages/LoginScreen.jsx";

// Lazy-loaded page imports (code-split per route)
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const ContentLibrary = lazy(() => import("./pages/ContentLibrary.jsx"));
const VideoLessons = lazy(() => import("./pages/VideoLessons.jsx"));
const Attendance = lazy(() => import("./pages/Attendance.jsx"));
const ProgressTracker = lazy(() => import("./pages/ProgressTracker.jsx"));
const Community = lazy(() => import("./pages/Community.jsx"));
const Classroom = lazy(() => import("./pages/Classroom.jsx"));
const LiveInfographics = lazy(() => import("./pages/infographics/LiveInfographics.jsx"));
const SubjectDrills = lazy(() => import("./pages/tools/SubjectDrills.jsx"));
const VocabBuilder = lazy(() => import("./pages/tools/VocabBuilder.jsx"));
const ExampleConnector = lazy(() => import("./pages/tools/ExampleConnector.jsx"));
const EssayGrader = lazy(() => import("./pages/tools/EssayGrader.jsx"));
const AIMarker = lazy(() => import("./pages/tools/AIMarker.jsx"));
const Homework = lazy(() => import("./pages/homework/Homework.jsx"));
const Events = lazy(() => import("./pages/Events.jsx"));
const PastPapers = lazy(() => import("./pages/study/PastPapers.jsx"));
const MicrolearningPage = lazy(() => import("./pages/study/MicrolearningPage.jsx"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard.jsx"));
const ParentView = lazy(() => import("./pages/ParentView.jsx"));
const NotesPage = lazy(() => import("./pages/study/NotesPage.jsx"));
const ModelEssayBank = lazy(() => import("./pages/study/ModelEssayBank.jsx"));
const MistakeJournal = lazy(() => import("./pages/study/MistakeJournal.jsx"));
const RevisionChecklist = lazy(() => import("./pages/study/RevisionChecklist.jsx"));
const FormulaCards = lazy(() => import("./pages/tools/FormulaCards.jsx"));
const Certificates = lazy(() => import("./pages/Certificates.jsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.jsx"));

const TUTOR_ONLY_PAGES = new Set(["aimarker", "attendance", "analytics", "parentview", "certificates"]);

export default function LMSAuthWrapper() {
  const [authUser, setAuthUser] = useState(undefined); // undefined=loading, null=logged out, object=logged in
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
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

  if (authUser === undefined) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0F1A" }}>
        <div style={{ textAlign: "center", width: 240 }}>
          <img src="/logo-aworthy.jpeg" alt="A Worthy" style={{ height: 48, objectFit: "contain", marginBottom: 12, borderRadius: 8 }} />
          <div style={{ fontSize: 12, color: "rgba(254,254,254,0.3)", fontWeight: 200, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: T.fontDisplay, marginBottom: 20 }}>Loading</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="shimmer" style={{ height: 12, borderRadius: 6, width: "100%" }} />
            <div className="shimmer" style={{ height: 12, borderRadius: 6, width: "80%" }} />
            <div className="shimmer" style={{ height: 12, borderRadius: 6, width: "60%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!authUser) return <LoginScreen />;

  return <LMS authUser={authUser} userProfile={userProfile} />;
}

function LMS({ authUser, userProfile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const timer = setTimeout(() => savePersistedState(state), 300);
    return () => clearTimeout(timer);
  }, [state]);

  useFirebaseSync(authUser, state, dispatch);

  useEffect(() => {
    if (userProfile?.role && state.role !== userProfile.role) {
      dispatch({ type: "SET_ROLE", payload: userProfile.role });
    }
  }, [userProfile?.role]);

  const initializedRef = useRef(false);
  useEffect(() => {
    const pageFromUrl = PATH_TO_PAGE[location.pathname] || "dashboard";
    if (state.page !== pageFromUrl) {
      dispatch({ type: "SET_PAGE", payload: pageFromUrl });
    }
    initializedRef.current = true;
  }, [location.pathname]);

  const prevPageRef = useRef(state.page);
  useEffect(() => {
    if (!initializedRef.current) return;
    if (state.page !== prevPageRef.current) {
      const path = PAGE_TO_PATH[state.page] || "/";
      if (location.pathname !== path) navigate(path);
      prevPageRef.current = state.page;
    }
  }, [state.page]);

  const notifications = useMemo(() => {
    const notifs = [];
    const today = new Date().toISOString().split("T")[0];
    state.homework.filter(h => h.status === "active" && h.dueDate >= today).forEach(h => {
      notifs.push({ type: "homework", msg: `"${h.title}" due ${h.dueDate}`, page: "homework" });
    });
    const pendingGrades = state.submissions.filter(s => s.status === "submitted").length;
    if (pendingGrades > 0 && state.role === "tutor") notifs.push({ type: "grading", msg: `${pendingGrades} submission${pendingGrades > 1 ? "s" : ""} pending grading`, page: "homework" });
    return notifs;
  }, [state.homework, state.submissions, state.role]);

  const [showNotifs, setShowNotifs] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("aworthy-dark") === "true");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const windowWidth = useWindowWidth();
  const isMobileLayout = windowWidth < 768;
  useEffect(() => { if (isMobileLayout) setSidebarOpen(false); }, [isMobileLayout]);
  const page = state.page;

  useEffect(() => { localStorage.setItem("aworthy-dark", darkMode); document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);

  useEffect(() => {
    const handleOffline = () => dispatch({ type: "ADD_TOAST", payload: { message: "You're offline. Changes will sync when you're back online.", variant: "info" } });
    const handleOnline = () => dispatch({ type: "ADD_TOAST", payload: { message: "Back online!", variant: "success" } });
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => { window.removeEventListener("offline", handleOffline); window.removeEventListener("online", handleOnline); };
  }, [dispatch]);

  useEffect(() => { requestPushPermission(); }, []);
  useEffect(() => { sendHomeworkReminders(state.homework); }, [state.homework]);

  useEffect(() => {
    function handleKey(e) {
      if (e.metaKey && e.key === "k") { e.preventDefault(); setShowSearch(s => !s); }
      if (e.key === "Escape") { setShowSearch(false); setShowNotifs(false); }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  useEffect(() => { if (showSearch && searchRef.current) searchRef.current.focus(); }, [showSearch]);

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length <= 1) return [];
    const q = searchQuery.toLowerCase();
    return [
      ...state.resources.filter(r => r.title.toLowerCase().includes(q)).slice(0, 3).map(r => ({ type: "file", label: r.title, page: "library" })),
      ...state.homework.filter(h => h.title.toLowerCase().includes(q)).slice(0, 2).map(h => ({ type: "clipboard", label: h.title, page: "homework" })),
      ...state.videoLessons.filter(v => v.title.toLowerCase().includes(q)).slice(0, 2).map(v => ({ type: "video", label: v.title, page: "videos" })),
      ...(state.posts || []).filter(p => p.title.toLowerCase().includes(q)).slice(0, 2).map(p => ({ type: "chat", label: p.title, page: "community" })),
      ...NAV.flatMap(g => g.items).filter(i => i.label.toLowerCase().includes(q)).map(i => ({ type: "link", label: i.label, page: i.id })),
    ].slice(0, 8);
  }, [searchQuery, state.resources, state.homework, state.videoLessons, state.posts]);

  const hwBadge = useMemo(() => state.role === "tutor" ? state.submissions.filter(s => s.status === "submitted").length : state.homework.filter(h => h.status === "active").length, [state.role, state.submissions, state.homework]);
  const attendanceBadge = useMemo(() => state.role === "tutor" ? state.sessions.filter(s => {
    const rec = state.attendance[s.id] || {};
    const sessionStudents = (s.subject && state.students.some(st => st.subjects))
      ? state.students.filter(st => st.subjects?.includes(s.subject))
      : state.students;
    return Object.keys(rec).length < sessionStudents.length;
  }).length : 0, [state.role, state.sessions, state.attendance, state.students]);

  const pageFallback = <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "40px 0" }}>{[1,2,3].map(i => <div key={i} className="shimmer" style={{ height: 14, borderRadius: 6, width: i === 3 ? "60%" : "100%" }} />)}</div>;

  const renderPage = () => {
    if (TUTOR_ONLY_PAGES.has(page) && state.role !== "tutor") {
      return <Dashboard state={state} dispatch={dispatch} authUser={authUser} userProfile={userProfile} />;
    }
    switch (page) {
      case "dashboard": return <Dashboard state={state} dispatch={dispatch} authUser={authUser} userProfile={userProfile} />;
      case "library": case "library-eng": case "library-h1econ": case "library-h2econ": case "library-omath": case "library-amath": case "library-ibmyp": return <ContentLibrary state={state} dispatch={dispatch} />;
      case "videos": case "videos-eng": case "videos-h1econ": case "videos-h2econ": case "videos-omath": case "videos-amath": case "videos-ibmyp": return <VideoLessons state={state} dispatch={dispatch} />;
      case "attendance": return <Attendance state={state} dispatch={dispatch} />;
      case "progress": return <ProgressTracker state={state} dispatch={dispatch} />;
      case "community": return <Community state={state} dispatch={dispatch} />;
      case "classroom": return <Classroom state={state} dispatch={dispatch} userProfile={userProfile} />;
      case "infographics": return <LiveInfographics state={state} dispatch={dispatch} />;
      case "practice-eng": return <SubjectDrills subject="eng" />;
      case "practice-h1econ": return <SubjectDrills subject="h1econ" />;
      case "practice-omath": return <SubjectDrills subject="omath" />;
      case "practice-amath": return <SubjectDrills subject="amath" />;
      case "practice-ibmyp": return <SubjectDrills subject="ibmyp" />;
      case "vocab": return <VocabBuilder />;
      case "example-finder": return <ExampleConnector />;
      case "essaygrader": return <EssayGrader />;
      case "aimarker": return <AIMarker />;
      case "homework": return <Homework state={state} dispatch={dispatch} userProfile={userProfile} />;
      case "events": return <Events state={state} dispatch={dispatch} />;
      case "pastpapers": return <PastPapers state={state} dispatch={dispatch} />;
      case "pastpapers-eng": return <PastPapers state={state} dispatch={dispatch} defaultSubject="eng" />;
      case "pastpapers-gp": return <PastPapers state={state} dispatch={dispatch} defaultSubject="gp" />;
      case "pastpapers-h1econ": return <PastPapers state={state} dispatch={dispatch} defaultSubject="h1econ" />;
      case "pastpapers-h2econ": return <PastPapers state={state} dispatch={dispatch} defaultSubject="h2econ" />;
      case "pastpapers-omath": return <PastPapers state={state} dispatch={dispatch} defaultSubject="omath" />;
      case "pastpapers-amath": return <PastPapers state={state} dispatch={dispatch} defaultSubject="amath" />;
      case "pastpapers-ibmyp": return <PastPapers state={state} dispatch={dispatch} defaultSubject="ibmyp" />;
      case "microlearning": return <MicrolearningPage state={state} dispatch={dispatch} />;
      case "micro-eng": return <MicrolearningPage state={state} dispatch={dispatch} defaultSubject="eng" />;
      case "micro-h1econ": return <MicrolearningPage state={state} dispatch={dispatch} defaultSubject="h1econ" />;
      case "micro-h2econ": return <MicrolearningPage state={state} dispatch={dispatch} defaultSubject="h2econ" />;
      case "micro-omath": return <MicrolearningPage state={state} dispatch={dispatch} defaultSubject="omath" />;
      case "micro-amath": return <MicrolearningPage state={state} dispatch={dispatch} defaultSubject="amath" />;
      case "micro-ibmyp": return <MicrolearningPage state={state} dispatch={dispatch} defaultSubject="ibmyp" />;
      case "analytics": return <AnalyticsDashboard state={state} />;
      case "parentview": return <ParentView state={state} />;
      case "notes": return <NotesPage state={state} dispatch={dispatch} />;
      case "modelessays": return <ModelEssayBank state={state} dispatch={dispatch} />;
      case "mistakes": return <MistakeJournal state={state} dispatch={dispatch} />;
      case "checklist": return <RevisionChecklist state={state} dispatch={dispatch} />;
      case "formulas": case "formulas-omath": case "formulas-amath": case "formulas-ibmyp": return <FormulaCards />;
      case "certificates": return <Certificates state={state} dispatch={dispatch} />;
      case "settings": return <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} authUser={authUser} userProfile={userProfile} />;
      default: return <Dashboard state={state} dispatch={dispatch} authUser={authUser} userProfile={userProfile} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: T.bg, color: T.text, fontSize: 14, lineHeight: 1.6 }}>
      {/* Mobile overlay backdrop */}
      {isMobileLayout && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: T.bgOverlay, zIndex: 49, transition: "opacity 0.2s" }} />}

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 232 : (isMobileLayout ? 0 : 56),
        background: T.bgSidebar, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", transition: "width 0.25s ease", flexShrink: 0,
        overflowX: "hidden", overflowY: "hidden",
        ...(isMobileLayout ? { position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50, boxShadow: sidebarOpen ? T.shadow3 : "none" } : {}),
      }}>
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? "16px 14px 12px" : "16px 8px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.border}` }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", borderRadius: T.r2, minWidth: 40, minHeight: 40, alignItems: "center", justifyContent: "center", transition: "background 0.12s" }}
            onMouseEnter={e => e.currentTarget.style.background = T.bgHover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <List size={18} color={T.textSec} />
          </button>
          {sidebarOpen && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/logo-aworthy.jpeg" alt="A Worthy" style={{ height: 28, objectFit: "contain", borderRadius: 6 }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: T.text, letterSpacing: "-0.01em" }}>A Worthy</span>
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
              const showItems = isSubject ? (isExpanded || hasActiveChild) : true;

              return (
                <div key={group.group}>
                  {sidebarOpen && (
                    isSubject ? (
                      <button onClick={() => setExpandedSection(isExpanded ? null : group.group)}
                        style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "6px 8px", marginTop: gi > 0 ? 4 : 0, borderRadius: T.r2, border: "none", background: hasActiveChild ? T.bgCard : "transparent", cursor: "pointer", transition: "all 0.12s" }}
                        onMouseEnter={e => { if (!hasActiveChild) e.currentTarget.style.background = T.sidebarHover; }}
                        onMouseLeave={e => { if (!hasActiveChild) e.currentTarget.style.background = hasActiveChild ? T.bgCard : "transparent"; }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: hasActiveChild ? (subjTheme?.accent || T.accent) : T.textTer, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: hasActiveChild ? T.text : T.textSec, flex: 1, textAlign: "left", letterSpacing: "0.02em" }}>{group.group}</span>
                        <CaretDown size={11} color={T.textTer} style={{ transform: showItems ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                      </button>
                    ) : (
                      gi > 0 ? (
                        <div style={{ padding: "12px 8px 4px", marginTop: 2 }}>
                          <span style={{ fontSize: 10, fontWeight: 500, color: T.textTer, letterSpacing: "0.06em", textTransform: "uppercase" }}>{group.group}</span>
                        </div>
                      ) : null
                    )
                  )}
                  {!sidebarOpen && gi > 0 && <div style={{ height: 1, background: T.border, margin: "4px 6px" }} />}

                  {showItems && (
                    <div style={{ animation: isSubject ? "fadeSlideIn 0.15s ease" : "none" }}>
                      {group.items.map((item, itemIdx) => {
                        const active = page === item.id;
                        const hl = item.highlight && !active;
                        return (
                          <button key={item.id} onClick={() => { dispatch({ type: "SET_PAGE", payload: item.id }); if (isMobileLayout) setSidebarOpen(false); }} title={item.label}
                            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.sidebarHover; }}
                            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = active ? T.bgCard : "transparent"; }}
                            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: sidebarOpen ? "7px 8px 7px 10px" : "9px 0", borderRadius: T.r2, border: "none", background: active ? T.bgCard : "transparent", color: active ? T.text : T.textSec, cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400, marginBottom: 1, transition: "background 0.12s, color 0.12s", whiteSpace: "nowrap", justifyContent: sidebarOpen ? "flex-start" : "center", minHeight: 36, animation: isSubject ? `itemIn 0.15s ease ${itemIdx * 25}ms both` : "none", boxShadow: active ? T.shadow1 : "none" }}>
                            <item.icon size={15} color={active ? T.accent : T.textTer} />
                            {sidebarOpen && <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>}
                            {sidebarOpen && item.id === "homework" && hwBadge > 0 && <span style={{ background: T.accent, color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>{hwBadge}</span>}
                            {sidebarOpen && item.id === "attendance" && attendanceBadge > 0 && <span style={{ background: T.warning, color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>{attendanceBadge}</span>}
                            {sidebarOpen && hl && !hwBadge && <div style={{ width: 5, height: 5, borderRadius: "50%", background: T.accent, opacity: 0.6 }} />}
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

        {/* Bottom: profile */}
        {sidebarOpen && (
          <div style={{ padding: "10px 12px 14px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: T.r2, background: T.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, flexShrink: 0 }}>{(userProfile?.name || authUser?.displayName || "U").charAt(0).toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: T.text, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userProfile?.name || authUser?.displayName || "User"}</div>
                <div style={{ color: T.textTer, fontSize: 11 }}>{userProfile?.role === "tutor" ? "Creator" : "Student"}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {userProfile?.role === "tutor" && (
                <button onClick={() => dispatch({ type: "SET_ROLE", payload: state.role === "tutor" ? "student" : "tutor" })}
                  style={{ flex: 1, padding: "6px", borderRadius: T.r1, background: "transparent", border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 11, fontWeight: 500, color: T.textSec, transition: "all 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
                  {state.role === "tutor" ? "Student View" : "Tutor View"}
                </button>
              )}
              <button onClick={() => signOut(firebaseAuth)}
                style={{ flex: userProfile?.role === "tutor" ? "none" : 1, padding: "6px 12px", borderRadius: T.r1, background: "transparent", border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 11, color: T.textTer, transition: "all 0.12s" }}
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
        {/* Top bar */}
        <div className="glass-header" style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobileLayout ? "12px 0" : "14px 0 8px", position: "sticky", top: 0, zIndex: 10, maxWidth: 1080, margin: "0 auto" }}>
          {isMobileLayout && (
            <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: T.r1, padding: 10, cursor: "pointer", display: "flex", minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}>
              <List size={20} color={T.textSec} />
            </button>
          )}
          {isMobileLayout && <img src="/logo-aworthy.jpeg" alt="A Worthy" style={{ height: 28, objectFit: "contain" }} />}
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowSearch(true)} aria-label="Search" style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: T.r1, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, minHeight: 40, fontSize: 12, color: T.textTer }}>
            <MagnifyingGlass size={14} /> {!isMobileLayout && <span>Search</span>} {!isMobileLayout && <kbd style={{ fontSize: 10, padding: "1px 5px", borderRadius: 4, background: T.bgMuted, border: `1px solid ${T.border}`, color: T.textTer, fontFamily: T.fontMono }}>⌘K</kbd>}
          </button>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowNotifs(n => !n)} aria-label="Notifications" style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: T.r1, padding: 10, cursor: "pointer", display: "flex", position: "relative", minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}>
              <Bell size={20} color={T.textSec} />
              {notifications.length > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: T.accent, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{notifications.length}</div>}
            </button>
            {showNotifs && (
              <div className="scale-pop" style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, width: 280, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r2, boxShadow: T.shadow3, zIndex: 100, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, fontSize: 12, fontWeight: 600, color: T.text }}>Notifications</div>
                {notifications.length === 0 ? (
                  <div style={{ padding: "20px 14px", textAlign: "center", fontSize: 12, color: T.textTer }}><EmptyStateIllustration type="celebration" size={60} /><div style={{ marginTop: 6 }}>All caught up!</div></div>
                ) : notifications.map((n, i) => (
                  <button key={i} onClick={() => { dispatch({ type: "SET_PAGE", payload: n.page }); setShowNotifs(false); }}
                    style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderBottom: `1px solid ${T.border}`, background: "none", border: "none", borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: T.border, cursor: "pointer", width: "100%", textAlign: "left" }}>
                    <span style={{ display: "flex", alignItems: "center" }}>{n.type === "homework" ? <ClipboardText size={16} color={T.textSec} /> : <PencilSimpleLine size={16} color={T.textSec} />}</span>
                    <span style={{ fontSize: 12, color: T.text, lineHeight: 1.4 }}>{n.msg}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tutor Announcement Banner */}
        {state.announcement && (
          <div style={{ maxWidth: 1080, margin: "0 auto 8px", padding: "10px 16px", borderRadius: T.r2, background: "linear-gradient(135deg, #1C1B19, #2A2927)", color: "#fff", display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
            <Megaphone size={16} color="#fff" />
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
            <PageErrorBoundary onNavigate={() => dispatch({ type: "SET_PAGE", payload: "dashboard" })}>
              <Suspense fallback={pageFallback}>
                {renderPage()}
              </Suspense>
            </PageErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      <ToastContainer toasts={state.toasts} dispatch={dispatch} />
      <BackToTop />
      <InstallPrompt />

      {/* Global Search (Cmd+K) */}
      <AnimatePresence>
        {showSearch && (
          <motion.div onClick={() => setShowSearch(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "8vh" }}>
            <motion.div onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.2, ease: "easeOut" }} style={{ width: "100%", maxWidth: 520, background: darkMode ? "#0B0F1A" : T.bgCard, borderRadius: T.r3, boxShadow: "0 25px 80px rgba(0,0,0,0.4)", border: `1px solid ${T.border}`, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: `1px solid ${T.border}`, background: T.bgMuted }}>
                <MagnifyingGlass size={18} color={T.accent} />
                <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search resources, homework, pages…"
                  autoFocus
                  style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 15, color: T.text, fontFamily: T.fontBody, fontWeight: 500 }} />
                <kbd style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: T.bgCard, border: `1px solid ${T.border}`, color: T.textTer, fontWeight: 600 }}>ESC</kbd>
              </div>
              {searchResults.length > 0 ? (
                <div style={{ maxHeight: 360, overflowY: "auto" }}>
                  {searchResults.map((r, i) => (
                    <motion.button key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} onClick={() => { dispatch({ type: "SET_PAGE", payload: r.page }); setShowSearch(false); setSearchQuery(""); }}
                      style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 20px", border: "none", borderBottom: `1px solid ${T.border}`, background: "none", cursor: "pointer", textAlign: "left", fontSize: 13, color: T.text, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.bgMuted; e.currentTarget.style.paddingLeft = "24px"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.paddingLeft = "20px"; }}>
                      <span style={{ minWidth: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {r.type === "file" ? <FilePdf size={18} color={T.textSec} /> : r.type === "clipboard" ? <ClipboardText size={18} color={T.textSec} /> : r.type === "video" ? <PlayCircle size={18} color={T.textSec} /> : r.type === "chat" ? <ChatCircle size={18} color={T.textSec} /> : <ArrowSquareOut size={18} color={T.textSec} />}
                      </span>
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
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.textTer, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Quick Access</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                    {[
                      { label: "Dashboard", page: "dashboard", icon: House },
                      { label: "Homework", page: "homework", icon: ClipboardText },
                      { label: "Community", page: "community", icon: Handshake },
                      { label: "Students", page: "progress", icon: Users },
                    ].map(q => (
                      <button key={q.page} onClick={() => { dispatch({ type: "SET_PAGE", payload: q.page }); setShowSearch(false); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgMuted, cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.text, transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = T.border; e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = T.bgMuted; e.currentTarget.style.transform = "none"; }}>
                        <q.icon size={16} color={T.textSec} />{q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      {isMobileLayout && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: darkMode ? "rgba(11,15,26,0.97)" : "rgba(255,255,255,0.97)", borderTop: `1px solid ${T.border}`, display: "flex", zIndex: 60, paddingBottom: "env(safe-area-inset-bottom, 0px)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
          {[
            { id: "dashboard", icon: House, label: "Home" },
            { id: "library", icon: Books, label: "Library" },
            { id: "homework", icon: ClipboardText, label: "Work", badge: hwBadge },
            { id: "community", icon: Handshake, label: "Social" },
            { id: "events", icon: Users, label: "Events" },
          ].map(tab => {
            const active = page === tab.id;
            return (
              <button key={tab.id} onClick={() => dispatch({ type: "SET_PAGE", payload: tab.id })}
                style={{ flex: 1, padding: "8px 4px 6px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, position: "relative", minHeight: 52, transition: "transform 0.1s ease" }}
                onTouchStart={e => e.currentTarget.style.transform = "scale(0.92)"}
                onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}>
                {active && <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 44, height: 30, borderRadius: 10, background: T.accentLight, zIndex: 0 }} />}
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
