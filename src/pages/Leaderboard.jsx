import React from 'react';
import { T } from '../theme/theme.js';
import { Crown, Trophy, Medal, Star, Flame, ArrowFatUp, Lightning, CheckCircle, Books } from '../icons/icons.jsx';
import { Card, Btn, Badge, Select, PageHeader } from '../components/ui';
import { PodiumCard, BadgeChip, XPBar, StudentAvatar } from '../components/gamification';
import { calcStudentXP, getLevel, getStudentBadges } from '../utils/gamificationUtils.js';
import { LEVELS, BADGE_DEFS } from '../data/gamification.js';
import { SUBJECTS } from '../data/subjects.js';

function Leaderboard({ state }) {
  const ranked = [...state.students]
    .map(s => ({ ...s, xp: calcStudentXP(s, state), badges: getStudentBadges(s, state) }))
    .sort((a, b) => b.xp - a.xp);

  const [lbFilter, setLbFilter] = React.useState("all");
  const filteredRanked = lbFilter === "all" ? ranked : ranked.filter(s => s.subjects && s.subjects.includes(lbFilter));

  return (
    <div>
      <PageHeader title="Class Leaderboard" subtitle="XP earned through quizzes, attendance & engagement" />
      <div style={{ marginBottom: 24 }}>
        {/* XP info strip */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          {[
            { icon: <Lightning size={13} color={T.accent} />, text: "10 XP / quiz answer" },
            { icon: <Star size={13} color="#D4940A" />, text: "+50 XP perfect score" },
            { icon: <CheckCircle size={13} color={T.success} />, text: "20 XP / session" },
            { icon: <Books size={13} color={T.accent} />, text: "5 XP / resource" },
          ].map(x => (
            <div key={x.text} style={{ display: "flex", alignItems: "center", gap: 5, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: T.textSec }}>
              {x.icon}<span>{x.text}</span>
            </div>
          ))}
        </div>
        {/* Subject filter tabs */}
        <div role="tablist" style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {[{ id: "all", label: "All Subjects" }, ...SUBJECTS.map(s => ({ id: s.id, label: s.name }))].map(tab => (
            <button key={tab.id} role="tab" aria-selected={lbFilter === tab.id} onClick={() => setLbFilter(tab.id)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${lbFilter === tab.id ? T.accent : T.border}`, background: lbFilter === tab.id ? T.accentLight : T.bgCard, color: lbFilter === tab.id ? T.accentText : T.textSec, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      {ranked.length >= 3 && (
        <div style={{ background: `linear-gradient(135deg, #0F172A 0%, #1E2A4A 50%, #2D3A8C 100%)`, borderRadius: T.r4, padding: "32px 24px 0", marginBottom: 28, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 20%, rgba(212,162,84,0.1), transparent 60%)" }} />
          <div style={{ textAlign: "center", marginBottom: 20, position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#D4A254", letterSpacing: 1.2, textTransform: "uppercase" }}>Class Podium</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 0 }}>
            <PodiumCard student={ranked[1]} rank={2} xp={ranked[1].xp} />
            <PodiumCard student={ranked[0]} rank={1} xp={ranked[0].xp} />
            <PodiumCard student={ranked[2]} rank={3} xp={ranked[2].xp} />
          </div>
        </div>
      )}

      {/* Full rankings */}
      <Card elevated style={{ padding: 0, overflow: "hidden", marginBottom: 28 }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Full Rankings</h3>
          <span style={{ fontSize: 12, color: T.textTer, fontWeight: 500 }}>{filteredRanked.length} student{filteredRanked.length !== 1 ? "s" : ""}</span>
        </div>
        {filteredRanked.map((student, idx) => {
          const lv = getLevel(student.xp);
          const rankIcon = idx === 0 ? <Crown size={20} color="#D4A254" /> : idx === 1 ? <Medal size={20} color="#94A3B8" /> : idx === 2 ? <Medal size={20} color="#CD7F32" /> : null;
          const rankDisplay = rankIcon || `#${idx + 1}`;
          return (
            <div key={student.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: idx < filteredRanked.length - 1 ? `1px solid ${T.border}` : "none", background: idx === 0 ? `${lv.bg}99` : T.bgCard, transition: "background 0.15s" }}
              onMouseEnter={e => { if (idx !== 0) e.currentTarget.style.background = T.bgMuted; }}
              onMouseLeave={e => { if (idx !== 0) e.currentTarget.style.background = T.bgCard; }}>
              <div style={{ width: 40, fontSize: idx < 3 ? 22 : 13, fontWeight: 700, color: idx < 3 ? "inherit" : T.textSec, textAlign: "center", flexShrink: 0 }}>{rankDisplay}</div>
              <StudentAvatar student={student} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{student.name}</span>
                  {student.badges.map(b => <span key={b.id} title={`${b.name}: ${b.desc}`} style={{ fontSize: 15 }}>{b.emoji}</span>)}
                </div>
                <XPBar xp={student.xp} compact />
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 22, color: lv.color, fontFamily: T.fontMono }}>{student.xp}</div>
                <div style={{ fontSize: 11, color: T.textTer }}>total XP</div>
              </div>
            </div>
          );
        })}
      </Card>

      {/* Achievements gallery */}
      <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: "0 0 16px", letterSpacing: "-0.03em", fontFamily: T.fontDisplay }}>Achievements Gallery</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {ranked.map(student => {
          return (
            <Card key={student.id} elevated style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <StudentAvatar student={student} size={40} />
                <div>
                  <div style={{ fontWeight: 700 }}>{student.name}</div>
                  <div style={{ fontSize: 11, color: T.textTer }}>{student.badges.length} / {BADGE_DEFS.length} badges earned</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {BADGE_DEFS.map(b => {
                  const earned = student.badges.some(sb => sb.id === b.id);
                  return <BadgeChip key={b.id} badge={b} earned={earned} size="sm" />;
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ━━━ COMMUNITY PAGE ━━━ */

export default Leaderboard;
