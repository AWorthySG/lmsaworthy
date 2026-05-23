import React, { useEffect } from 'react';
import { T } from '../theme/theme.js';
import { Broadcast, ArrowSquareOut } from '../icons/icons.jsx';

const WHITEBOARD_URL = 'https://whiteboard.a-worthy.com';

function Classroom() {
  useEffect(() => {
    window.open(WHITEBOARD_URL, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100dvh - 120px)' }}>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.r3, padding: '48px 40px', textAlign: 'center', maxWidth: 420, width: '100%' }}>
        <div style={{ width: 56, height: 56, borderRadius: T.r2, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Broadcast size={28} color={T.accent} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: T.fontDisplay, color: T.text, marginBottom: 8 }}>
          Live Classroom
        </div>
        <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.6, marginBottom: 28 }}>
          The whiteboard has opened in a new tab. If it didn't open automatically, click the button below.
        </div>
        <a href={WHITEBOARD_URL} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: T.r2, background: T.accent, color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          <ArrowSquareOut size={16} />
          Open Whiteboard
        </a>
      </div>
    </div>
  );
}

export default Classroom;
