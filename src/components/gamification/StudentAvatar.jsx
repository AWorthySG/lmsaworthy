/* eslint-disable react-refresh/only-export-components -- avatar constants/helpers are intentionally co-located with the components per the gamification module design */
import React, { useState } from 'react';
import { T } from '../../theme/theme.js';
import { Star, Crown, Lightning, Brain, Flame, Trophy, Sparkle, Target } from '../../icons/icons.jsx';

/* ── Avatar catalogue ── */
export const AVATAR_ICONS = [
  { key: "star",      Icon: Star,      label: "Star" },
  { key: "crown",     Icon: Crown,     label: "Crown" },
  { key: "lightning", Icon: Lightning, label: "Lightning" },
  { key: "brain",     Icon: Brain,     label: "Brain" },
  { key: "flame",     Icon: Flame,     label: "Flame" },
  { key: "trophy",    Icon: Trophy,    label: "Trophy" },
  { key: "sparkle",   Icon: Sparkle,   label: "Sparkle" },
  { key: "target",    Icon: Target,    label: "Target" },
];

export const AVATAR_COLORS = [
  { key: "coral",  bg: "#FEE2E2", fg: "#DC2626", label: "Coral" },
  { key: "amber",  bg: "#FEF3C7", fg: "#D97706", label: "Amber" },
  { key: "forest", bg: "#DCFCE7", fg: "#15803D", label: "Forest" },
  { key: "teal",   bg: "#CCFBF1", fg: "#0F766E", label: "Teal" },
  { key: "violet", bg: "#EDE9FE", fg: "#7C3AED", label: "Violet" },
  { key: "rose",   bg: "#FCE7F3", fg: "#BE185D", label: "Rose" },
  { key: "rust",   bg: "#FEF2F2", fg: "#C0392B", label: "Rust" },
  { key: "slate",  bg: "#F1F5F9", fg: "#475569", label: "Slate" },
];

export function decodeAvatar(key) {
  if (!key) return null;
  const idx = key.indexOf("-");
  if (idx === -1) return null;
  const iconKey = key.slice(0, idx);
  const colorKey = key.slice(idx + 1);
  const iconDef = AVATAR_ICONS.find(i => i.key === iconKey);
  const colorDef = AVATAR_COLORS.find(c => c.key === colorKey);
  if (!iconDef || !colorDef) return null;
  return { iconDef, colorDef };
}

/* ── Renders a chosen avatar icon+colour (no student needed) ── */
export function AvatarDisplay({ avatarKey, size = 40, radius = "50%" }) {
  const decoded = decodeAvatar(avatarKey);
  if (!decoded) return null;
  const { iconDef: { Icon }, colorDef } = decoded;
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: colorDef.bg, border: `2px solid ${colorDef.fg}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={Math.round(size * 0.48)} color={colorDef.fg} />
    </div>
  );
}

/* ── Picker UI — can be embedded anywhere ── */
export function AvatarPicker({ value, onSave, onCancel }) {
  const decoded = decodeAvatar(value);
  const [selIcon, setSelIcon] = useState(decoded?.iconDef.key || "star");
  const [selColor, setSelColor] = useState(decoded?.colorDef.key || "teal");
  const currentKey = `${selIcon}-${selColor}`;
  const activeColor = AVATAR_COLORS.find(c => c.key === selColor);

  return (
    <div style={{ background: T.bgCard, borderRadius: T.r2, border: `1.5px solid ${T.border}`, padding: 20, display: "inline-block", minWidth: 280 }}>
      {/* Preview */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <AvatarDisplay avatarKey={currentKey} size={64} radius={T.r2} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Choose avatar</div>
          <div style={{ fontSize: 11, color: T.textTer, marginTop: 2 }}>Pick an icon and colour below</div>
        </div>
      </div>

      {/* Icon grid */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Icon</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {AVATAR_ICONS.map(({ key, Icon, label }) => {
            const active = selIcon === key;
            return (
              <button key={key} onClick={() => setSelIcon(key)} title={label}
                style={{ width: 40, height: 40, borderRadius: T.r1, border: `2px solid ${active ? activeColor.fg : T.border}`, background: active ? activeColor.bg : T.bgMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                <Icon size={18} color={active ? activeColor.fg : T.textTer} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Colour swatches */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textTer, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Colour</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {AVATAR_COLORS.map(({ key, bg, fg, label }) => (
            <button key={key} onClick={() => setSelColor(key)} title={label}
              style={{ width: 30, height: 30, borderRadius: "50%", background: bg, border: `3px solid ${selColor === key ? fg : "transparent"}`, outline: selColor === key ? `2px solid ${fg}40` : "none", cursor: "pointer", transition: "all 0.15s" }} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onSave(currentKey)}
          style={{ padding: "8px 22px", borderRadius: T.r5, background: T.accent, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
          Save
        </button>
        {onCancel && (
          <button onClick={onCancel}
            style={{ padding: "8px 16px", borderRadius: T.r5, background: T.bgMuted, color: T.textSec, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main component used across all pages ── */
export default function StudentAvatar({ student, avatarKey, avatarMap, size = 40, radius = "50%" }) {
  const key = avatarKey ?? (avatarMap && student?.id != null ? avatarMap[student.id] : null);

  if (key) return <AvatarDisplay avatarKey={key} size={size} radius={radius} />;

  // Fallback: initials with warm gradient
  const initials = (student?.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: radius, background: `linear-gradient(135deg, ${T.accent}, #B45309)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: Math.round(size * 0.36), flexShrink: 0, userSelect: "none" }}>
      {initials}
    </div>
  );
}
