import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { T } from '../theme/theme.js';
import { Confetti, Trophy, Crown, Medal, Star, Gift, CalendarBlank, Users, ArrowLeft, CheckCircle, Flame, CaretRight, RocketLaunch } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, PageHeader, BackBtn, Progress, StatCard } from '../components/ui';
import { StudentAvatar, XPBar } from '../components/gamification';
import { calcStudentXP } from '../utils/gamificationUtils.js';
import { initialEvents } from '../data/seedEvents.js';

function Events({ state, dispatch }) {
  const [view, setView] = useState("list"); // list | detail
  const [selectedEvent, setSelectedEvent] = useState(null);

  function getStudent(id) { return state.students.find(s => s.id === id); }

  const now = new Date().toISOString().split("T")[0];
  const activeEvents = initialEvents.filter(e => e.status === "active");
  const upcomingEvents = initialEvents.filter(e => e.status === "upcoming");
  const endedEvents = initialEvents.filter(e => e.status === "ended");

  function daysLeft(endDate) {
    const diff = Math.ceil((new Date(endDate) - new Date()) / 86400000);
    return diff > 0 ? diff : 0;
  }

  function daysUntil(startDate) {
    const diff = Math.ceil((new Date(startDate) - new Date()) / 86400000);
    return diff > 0 ? diff : 0;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 96px)", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {view === "detail" && (
            <button onClick={() => setView("list")} style={{ width: 32, height: 32, borderRadius: T.r1, background: T.bgMuted, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowLeft size={16} color={T.textSec} />
            </button>
          )}
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #2D3A8C, #4F5BD5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", margin: 0, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {view === "detail" ? selectedEvent?.title : "Events & Prizes"}
            </h1>
            <p style={{ color: T.textSec, fontSize: 14, margin: "4px 0 0", fontWeight: 400 }}>
              {view === "detail" ? `${selectedEvent?.startDate} — ${selectedEvent?.endDate}` : "Compete, participate, and win prizes through the LMS"}
            </p>
          </div>
        </div>
      </div>

      {/* ═══ LIST VIEW ═══ */}
      {view === "list" && (
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Hero banner */}
          <div style={{ background: T.bgMuted, borderRadius: T.r3, padding: "24px 28px", color: T.text, border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, fontSize: 100, opacity: 0.08 }}>🏆</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#D4A254", marginBottom: 6 }}>Earn Prizes · Compete · Level Up</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 8 }}>Upcoming Events & Challenges</div>
            <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6 }}>
              Participate in challenges using the LMS tools you already know — Timed Writer, Practice Drills, and Vocabulary. Top performers win coins, badges, and real prizes.
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: T.r2, padding: "8px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{activeEvents.length}</div>
                <div style={{ fontSize: 10, color: T.textTer }}>Live Now</div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: T.r2, padding: "8px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{upcomingEvents.length}</div>
                <div style={{ fontSize: 10, color: T.textTer }}>Coming Soon</div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: T.r2, padding: "8px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{initialEvents.reduce((s, e) => s + e.prizes.length, 0)}</div>
                <div style={{ fontSize: 10, color: T.textTer }}>Prizes</div>
              </div>
            </div>
          </div>

          {/* Active events */}
          {activeEvents.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.success, animation: "pulse 1.5s infinite" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Live Now</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeEvents.map(ev => (
                  <button key={ev.id} onClick={() => { setSelectedEvent(ev); setView("detail"); }}
                    style={{ display: "flex", gap: 16, padding: "18px 20px", borderRadius: T.r2, border: `2px solid ${ev.color}33`, background: T.bgCard, cursor: "pointer", textAlign: "left", width: "100%", boxShadow: T.shadow2, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = ev.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = ev.color + "33"; e.currentTarget.style.transform = "none"; }}>
                    <div style={{ fontSize: 36, flexShrink: 0 }}>{ev.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: T.success, padding: "2px 8px", borderRadius: 20, animation: "pulse 2s infinite" }}>LIVE</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: T.accent }}>{daysLeft(ev.endDate)} days left</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{ev.title}</div>
                      <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5, marginBottom: 8 }}>{ev.description.substring(0, 120)}...</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {ev.prizes.slice(0, 2).map((p, i) => (
                          <span key={i} style={{ fontSize: 10, fontWeight: 600, color: ev.color, background: ev.color + "12", padding: "2px 8px", borderRadius: 20, border: `1px solid ${ev.color}25` }}>{p.emoji} {p.place}: {p.reward.split("+")[0].trim()}</span>
                        ))}
                        <span style={{ fontSize: 10, fontWeight: 600, color: T.textTer }}>{ev.participants.length} participant{ev.participants.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <CaretRight size={16} color={T.textTer} style={{ flexShrink: 0, alignSelf: "center" }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming events */}
          {upcomingEvents.length > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>Coming Soon</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {upcomingEvents.map(ev => (
                  <button key={ev.id} onClick={() => { setSelectedEvent(ev); setView("detail"); }}
                    style={{ display: "flex", gap: 14, padding: "14px 18px", borderRadius: T.r2, border: `1px solid ${T.border}`, background: T.bgCard, cursor: "pointer", textAlign: "left", width: "100%", boxShadow: T.shadow1, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = T.shadow2; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = T.shadow1; }}>
                    <div style={{ fontSize: 28, flexShrink: 0 }}>{ev.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: "#024F94", background: "#E8F4FD", padding: "2px 8px", borderRadius: 20 }}>STARTS IN {daysUntil(ev.startDate)} DAYS</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{ev.title}</div>
                      <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>{ev.description.substring(0, 80)}...</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        {ev.prizes.slice(0, 2).map((p, i) => (
                          <span key={i} style={{ fontSize: 9, color: T.textTer }}>{p.emoji} {p.place}</span>
                        ))}
                      </div>
                    </div>
                    <CaretRight size={14} color={T.textTer} style={{ flexShrink: 0, alignSelf: "center" }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ DETAIL VIEW ═══ */}
      {view === "detail" && selectedEvent && (() => {
        const ev = selectedEvent;
        const isActive = ev.status === "active";
        const isUpcoming = ev.status === "upcoming";
        return (
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Event hero */}
            <div style={{ background: `linear-gradient(135deg, ${ev.color}18, ${ev.color}08)`, borderRadius: T.r3, padding: "22px 24px", border: `2px solid ${ev.color}25`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -10, right: -10, fontSize: 80, opacity: 0.1 }}>{ev.emoji}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 32 }}>{ev.emoji}</span>
                <div>
                  {isActive && <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: T.success, padding: "2px 8px", borderRadius: 20, animation: "pulse 2s infinite" }}>LIVE — {daysLeft(ev.endDate)} days left</span>}
                  {isUpcoming && <span style={{ fontSize: 9, fontWeight: 700, color: "#024F94", background: "#E8F4FD", padding: "2px 8px", borderRadius: 20 }}>STARTS {ev.startDate}</span>}
                </div>
              </div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>{ev.description}</div>
            </div>

            {/* How to participate */}
            <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <RocketLaunch size={15} color={ev.color} weight="fill" /> How to Participate
              </div>
              <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.7, background: T.bgMuted, borderRadius: T.r1, padding: "10px 14px" }}>{ev.howToParticipate}</div>
            </div>

            {/* Prizes */}
            <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Trophy size={15} color="#D4940A" weight="fill" /> Prizes
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ev.prizes.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", background: i === 0 ? "#FFF8E8" : T.bgMuted, borderRadius: T.r2, padding: "12px 16px", border: i === 0 ? "1px solid #F8D88B" : `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 28 }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: i === 0 ? "#8B5C00" : T.text }}>{p.place}</div>
                      <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{p.reward}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Judging criteria */}
            <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 8 }}>Judging Criteria</div>
              {ev.criteria.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 4 }}>
                  <CheckCircle size={14} color={ev.color} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>

            {/* Leaderboard / Participants */}
            <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>
                Participants ({ev.participants.length})
              </div>
              {ev.participants.length === 0 && (
                <div style={{ textAlign: "center", padding: "20px", color: T.textTer, fontSize: 12 }}>No participants yet — be the first to join!</div>
              )}
              {ev.participants.sort((a, b) => (b.score || 0) - (a.score || 0)).map((p, i) => {
                const st = getStudent(p.studentId);
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                return (
                  <div key={p.studentId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < ev.participants.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <div style={{ width: 24, textAlign: "center", fontSize: medal ? 16 : 12, fontWeight: 700, color: T.textTer }}>{medal || (i + 1)}</div>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: ev.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: ev.color, flexShrink: 0 }}>{st?.name?.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{st?.name}</div>
                      <div style={{ fontSize: 10, color: T.textTer }}>Joined {p.joined} · {p.submission}</div>
                    </div>
                    {p.score !== null && (
                      <div style={{ fontSize: 16, fontWeight: 800, color: ev.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{p.score}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Join button */}
            {isActive && (
              <button onClick={() => dispatch({ type: "ADD_TOAST", payload: { message: `You've joined "${ev.title}"! Head to the relevant tool to start.`, variant: "success" } })}
                style={{ padding: "14px 28px", borderRadius: T.r2, background: T.gradPrimary, color: "#fff", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer", alignSelf: "flex-start", boxShadow: T.shadowAccent, display: "flex", alignItems: "center", gap: 8 }}>
                <RocketLaunch size={18} weight="fill" /> Join This Event
              </button>
            )}
            {isUpcoming && (
              <div style={{ background: T.bgMuted, borderRadius: T.r2, padding: "12px 16px", fontSize: 12, color: T.textSec, display: "flex", alignItems: "center", gap: 8 }}>
                <CalendarBlank size={14} /> This event starts on {ev.startDate} — check back then to participate!
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

/* ━━━ ESSAY GRADER — Framework-based analysis ━━━ */

export default Events;
