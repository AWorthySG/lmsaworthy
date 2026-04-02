import React from 'react';
import ToastItem from './ToastItem.jsx';

export default function ToastContainer({ toasts, dispatch }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 10000, display: "flex", flexDirection: "column-reverse", gap: 8 }}>
      {toasts.map(t => <ToastItem key={t.id} toast={t} dispatch={dispatch} />)}
    </div>
  );
}
