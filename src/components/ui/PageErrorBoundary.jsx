import React from 'react';
import { T } from '../../theme/theme.js';

class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PageErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoToDashboard = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', padding: 24,
        }}>
          <div style={{
            background: T.bgCard, borderRadius: T.r3,
            border: `1px solid ${T.border}`,
            boxShadow: T.shadow2, padding: 40,
            maxWidth: 520, width: '100%', textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>

            <h2 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 22, fontWeight: 700, color: T.text,
              margin: '0 0 12px',
            }}>
              Something went wrong
            </h2>

            <p style={{
              color: T.textSec, fontSize: 14, lineHeight: 1.5,
              margin: '0 0 20px',
            }}>
              An unexpected error occurred. You can try again or return to the dashboard.
            </p>

            {this.state.error && (
              <pre style={{
                background: T.bgMuted, borderRadius: T.r2,
                padding: 14, fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
                color: T.danger, textAlign: 'left',
                overflowX: 'auto', whiteSpace: 'pre-wrap',
                wordBreak: 'break-word', margin: '0 0 24px',
                border: `1px solid ${T.border}`,
              }}>
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: T.accent, color: '#FFFFFF',
                  border: 'none', borderRadius: T.r2,
                  padding: '10px 22px', fontSize: 14, fontWeight: 600,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  cursor: 'pointer', transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = T.accentDark; }}
                onMouseLeave={e => { e.currentTarget.style.background = T.accent; }}
              >
                Try Again
              </button>

              <button
                onClick={this.handleGoToDashboard}
                style={{
                  background: 'transparent', color: T.textSec,
                  border: `1px solid ${T.border}`, borderRadius: T.r2,
                  padding: '10px 22px', fontSize: 14, fontWeight: 600,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = T.borderHover;
                  e.currentTarget.style.color = T.text;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.color = T.textSec;
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
