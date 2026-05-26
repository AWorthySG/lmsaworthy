import React from 'react';
import { T } from '../../theme/theme.js';
import Card from './Card.jsx';

export default function StatCard({ icon: Icon, value, label, color }) {
  return (
    <Card elevated style={{ padding: 20, textAlign: "center" }}>
      <div style={{ width: 44, height: 44, borderRadius: T.r2, background: color + "12", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <Icon size={22} weight="duotone" color={color} />
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: T.text, letterSpacing: -1, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: T.textSec, fontWeight: 500, marginTop: 6 }}>{label}</div>
    </Card>
  );
}
