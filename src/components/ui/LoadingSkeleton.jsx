import React from 'react';

export default function LoadingSkeleton({ lines = 3, height = 14, style: s }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, ...s }}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="shimmer" style={{ height, borderRadius: 6, width: i === lines - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}
