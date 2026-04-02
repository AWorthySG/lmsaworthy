import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas-pro';
import { T } from '../theme/theme.js';
import { Users, ChartLineUp, CalendarCheck, Trophy, Star, CheckCircle, ArrowSquareOut } from '../icons/icons.jsx';
import { Card, Btn, Badge, SubjectBadge, Progress, PageHeader, Select, StatCard } from '../components/ui';
import { ShareableProgressCard, StudentAvatar, XPBar, BadgeChip } from '../components/gamification';
import { calcStudentXP, getLevel, getLevelProgress, getStudentBadges } from '../utils/gamificationUtils.js';
import { getSubject, getSubjectTheme, formatDate } from '../utils/helpers.js';
import { SUBJECTS } from '../data/subjects.js';
import { LEVELS } from '../data/gamification.js';

function ParentView({ state }) {
  const wallet = state.wallet;
  const exams = getExamCountdowns().slice(0, 3);
  const gradedSubs = (state.submissions || []).filter(s => s.status === "graded");
  const totalSessions = Object.keys(state.attendance).length;
  let attended = 0;
  Object.values(state.attendance).forEach(rec => { attended += Object.values(rec).filter(v => v === "present" || v === "late").length; });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "linear-gradient(135deg, #0F172A, #1E2A4A, #2D3A8C)", borderRadius: T.r4, padding: "28px 24px", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(212,162,84,0.1), transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <img src="/logo-aworthy.jpeg" alt="" style={{ height: 36, borderRadius: 8 }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>A Worthy · Parent Dashboard</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 4px", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Progress Report</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>Real-time overview of your child's learning journey</p>
        </div>
      </div>

      {/* Key Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        {[
          { label: "Study Streak", value: `${wallet.streak} days`, icon: "🔥", color: T.accent },
          { label: "Coins Earned", value: wallet.coins, icon: "🪙", color: T.gold },
          { label: "Homework Graded", value: gradedSubs.length, icon: "📋", color: T.success },
          { label: "Sessions Attended", value: attended, icon: "📅", color: T.teal },
        ].map(s => (
          <div key={s.label} style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px", border: `1px solid ${T.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: T.textTer, fontWeight: 600, marginBottom: 4 }}>{s.icon} {s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Grades */}
      {gradedSubs.length > 0 && (
        <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 10, fontFamily: "'Bricolage Grotesque', sans-serif" }}>📝 Recent Grades</div>
          {gradedSubs.slice(0, 5).map(sub => {
            const hw = state.homework.find(h => h.id === sub.homeworkId);
            return (
              <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.success, fontFamily: "'Bricolage Grotesque', sans-serif", minWidth: 36 }}>{sub.grade}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{hw?.title || "Homework"}</div>
                  {sub.gradeComment && <div style={{ fontSize: 11, color: T.textTer, marginTop: 2 }}>{sub.gradeComment.slice(0, 80)}...</div>}
                </div>
                <div style={{ fontSize: 10, color: T.textTer }}>{sub.gradedAt}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exam Countdown */}
      {exams.length > 0 && (
        <div style={{ background: T.bgCard, borderRadius: T.r2, padding: "16px 18px", border: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 10, fontFamily: "'Bricolage Grotesque', sans-serif" }}>⏳ Upcoming Exams</div>
          {exams.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < exams.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: e.daysLeft <= 30 ? T.danger : T.accent, fontFamily: "'JetBrains Mono', monospace", minWidth: 40, textAlign: "center" }}>{e.daysLeft}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{e.name}</div>
                <div style={{ fontSize: 10, color: T.textTer }}>{e.date} · {e.daysLeft} days remaining</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Study Streak Calendar */}
      <StreakCalendar wallet={wallet} />

      {/* Shareable Progress Card */}
      <ShareableProgressCard state={state} />

      <div style={{ textAlign: "center", fontSize: 11, color: T.textTer, padding: "12px 0" }}>
        <button onClick={() => window.print()} style={{ background: T.accent, color: "#fff", border: "none", borderRadius: T.r2, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>🖨️ Print Report</button>
        <br />Generated by A Worthy Learning Platform · <a href="https://lms.a-worthy.com" style={{ color: T.accent }}>lms.a-worthy.com</a>
      </div>
    </div>
  );
}

/* ━━━ MODEL ESSAY BANK ━━━ */
const MODEL_ESSAYS = [
  { id: 1, subject: "eng", type: "Argumentative", title: "'Social media does more harm than good for young people.' Do you agree?", grade: "A", band: 5,
    essay: "In an era where the average teenager spends over four hours daily scrolling through curated feeds and algorithmically-driven content, the question of social media's impact on young people has become not merely academic, but urgent. While social media undeniably offers certain benefits — including connectivity and access to information — this essay argues that its detrimental effects on mental health, social development, and academic performance far outweigh its advantages.\n\nFirstly, the psychological toll of social media on young people is both well-documented and alarming. A landmark 2023 report by the US Surgeon General classified social media as a 'significant contributor to the youth mental health crisis', noting that teenagers who spend three or more hours daily on these platforms are twice as likely to experience symptoms of depression and anxiety. This is not coincidental; the very architecture of these platforms — infinite scroll, notification loops, and appearance-based validation through 'likes' — is engineered to exploit adolescent vulnerability. The relentless exposure to curated, idealised lives fosters a corrosive culture of comparison that erodes self-esteem during the most psychologically formative years.\n\nAdmittedly, proponents of social media argue that it provides a vital lifeline for isolated or marginalised young people, offering community and connection that may be absent in their physical environment. This is a valid consideration — platforms like Discord and Reddit have indeed fostered supportive communities for LGBTQ+ youth and those with niche interests. However, this argument conflates digital interaction with genuine human connection. Research by MIT sociologist Sherry Turkle demonstrates that heavy social media users report greater feelings of loneliness, not fewer, precisely because shallow online exchanges displace the deeper, face-to-face relationships essential for psychological wellbeing. The connection social media provides is, at best, a pale imitation of authentic human bonds.\n\nFurthermore, social media's impact on academic performance cannot be overlooked. The constant interruption of notifications fragments attention, training young brains for distraction rather than sustained focus. A 2024 study by the University of Chicago found that the mere presence of a smartphone on a student's desk reduced cognitive capacity by 10%, even when the device was face-down and silent. In an education system that demands deep reading, analytical writing, and extended concentration, social media's attention economy is directly at odds with academic excellence.\n\nIn conclusion, while social media is not without its merits, the weight of evidence points decisively toward net harm for young people. Its engineered addictiveness, its corrosion of mental health, and its fragmentation of attention represent a triple threat that no amount of community-building or information access can adequately offset. The question is no longer whether social media harms young people, but what society is prepared to do about it.",
    feedback: "Band 5 qualities: Strong thesis with qualifier. SEER examples (Surgeon General report, Turkle research). Counter-argument acknowledged and rebutted. Sophisticated vocabulary throughout. Clear PEEL structure in every paragraph." },
  { id: 2, subject: "gp", type: "Essay", title: "'Science always improves the quality of human life.' How far do you agree?", grade: "A", band: 4,
    essay: "The narrative of scientific progress as an unqualified good is deeply embedded in modern consciousness. From penicillin to the internet, the trajectory of human civilisation appears inextricably linked to scientific advancement. However, to claim that science 'always' improves quality of life requires us to ignore a more complex reality — one in which scientific progress often creates new problems even as it solves old ones.\n\nScience has, without question, delivered transformative improvements to human existence. The development of vaccines has eradicated smallpox and dramatically reduced the burden of infectious diseases worldwide. Between 1900 and 2020, global life expectancy more than doubled, from 31 to 73 years, driven primarily by advances in medicine, sanitation, and agricultural science. In Singapore, the healthcare system — built on scientific research and technological innovation — provides one of the world's highest life expectancies at 84 years. These achievements represent genuine, measurable improvements in quality of life that would have been inconceivable without science.\n\nYet the same scientific enterprise that has extended our lives has also created existential threats to our continued existence. The development of nuclear weapons — a direct product of physics research — introduced the possibility of instantaneous civilisational annihilation. Climate change, driven by the industrial technologies that science enabled, threatens to undo centuries of progress through rising seas, extreme weather, and ecological collapse. The IPCC's 2024 report warns that without dramatic intervention, global temperatures will exceed 2°C above pre-industrial levels by 2050, with catastrophic consequences for food security and human displacement. Science gave us the internal combustion engine; it also gave us the crisis that engine produced.\n\nMoreover, scientific advancement does not distribute its benefits equally. The digital revolution has created unprecedented wealth and convenience for those with access, while simultaneously widening the gap between the technologically connected and the technologically excluded. In Singapore, while Smart Nation initiatives bring AI and data analytics to public services, the elderly and digitally illiterate risk being left behind in an increasingly automated society. Science improves quality of life — but primarily for those positioned to benefit from it.\n\nOn balance, it is more accurate to say that science has the potential to improve quality of life, but whether it does so depends on how its applications are governed, distributed, and regulated. Science itself is morally neutral; it is the human systems around it — politics, economics, ethics — that determine whether a given advancement becomes a blessing or a curse. The challenge of our era is not to produce more science, but to produce wiser stewardship of the science we already have.",
    feedback: "L4 content: Balanced argument with specific examples (IPCC, Singapore Smart Nation). Strong evaluation with nuanced conclusion. Could reach L5 with one more deeply analysed example." },
  { id: 3, subject: "h2econ", type: "Essay", title: "Discuss whether a government should use fiscal policy or monetary policy to address a recession.", grade: "A", band: null,
    essay: "A recession — characterised by two consecutive quarters of negative real GDP growth — requires deliberate government intervention to restore aggregate demand and economic stability. Both fiscal policy (government spending and taxation) and monetary policy (interest rates and money supply) offer tools to combat recession, but their effectiveness depends on the specific economic context.\n\nFiscal policy operates through changes in government spending (G) and taxation (T). During a recession, expansionary fiscal policy — increasing G or reducing T — directly injects spending into the circular flow of income. An increase in government spending on infrastructure, for example, creates jobs, generates income, and triggers a multiplier effect as that income is re-spent in the economy. If the marginal propensity to consume (MPC) is 0.8, the multiplier is 1/(1-0.8) = 5, meaning a $10 billion increase in G could potentially raise GDP by $50 billion. The advantage of fiscal policy is its directness — G is a component of AD, so changes feed immediately into aggregate demand.\n\nHowever, fiscal policy has significant limitations. The implementation lag can be substantial — government budgets require parliamentary approval, public consultation, and administrative planning, meaning the stimulus may arrive after the recession has ended or worsened. Furthermore, if the government finances increased spending through borrowing, it may drive up interest rates (crowding out), reducing private investment and partially offsetting the expansionary effect. In the context of Singapore, the multiplier is relatively small due to the high marginal propensity to save and high marginal propensity to import, which means fiscal spending leaks out of the domestic economy quickly.\n\nMonetary policy, typically conducted by the central bank, lowers interest rates during a recession to encourage consumption and investment. Lower interest rates reduce the cost of borrowing for firms and households, stimulating investment (I) and consumption (C), both components of AD. Monetary policy can be implemented faster than fiscal policy, as central banks can adjust rates without parliamentary approval. Additionally, quantitative easing — purchasing government bonds to increase money supply — can provide further stimulus when rates are already low.\n\nYet monetary policy also faces constraints. In a severe recession, the economy may face a liquidity trap — where interest rates are already near zero and further cuts have no effect because consumers and firms are too pessimistic to borrow regardless of the rate. Japan's 'lost decades' illustrate this limitation. Moreover, monetary policy is an indirect tool: it creates conditions for borrowing, but cannot force firms to invest or consumers to spend.\n\nIn Singapore's case, the situation is unique. The Monetary Authority of Singapore (MAS) conducts monetary policy through the exchange rate rather than interest rates, managing the Singapore Dollar Nominal Effective Exchange Rate (S$NEER) within a policy band. To combat recession, MAS would depreciate the S$NEER, making exports cheaper and imports more expensive, thereby boosting net exports (X-M) and aggregate demand. This approach is particularly effective for Singapore given its high trade openness (trade exceeds 300% of GDP).\n\nIn conclusion, neither fiscal nor monetary policy alone is sufficient to address a recession comprehensively. Fiscal policy provides direct, targeted stimulus but suffers from implementation lags and crowding out. Monetary policy acts faster but may be ineffective in a liquidity trap. The optimal approach is a coordinated policy mix — using monetary policy for immediate stabilisation and fiscal policy for targeted, structural intervention. In Singapore's context, exchange rate policy plays the primary role, supplemented by fiscal measures such as the Jobs Support Scheme and Resilience Budget during economic downturns.",
    feedback: "Strong L3 essay: Clear comparison structure, economic rigour with multiplier calculation, Singapore context applied throughout. To reach L4: deeper evaluation of policy interaction effects." },
];

/* ━━━ PERSONAL NOTES SYSTEM ━━━ */

export default ParentView;
