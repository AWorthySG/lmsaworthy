import React from 'react'
import LMS from './LMS'

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[RootErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#FAFAF7', fontFamily: 'Nunito, sans-serif',
        }}>
          <div style={{ textAlign: 'center', maxWidth: 480, padding: 32 }}>
            <img src="/logo-aworthy.jpeg" alt="A Worthy" style={{ height: 48, aspectRatio: "786 / 1280", objectFit: "contain", borderRadius: 8, marginBottom: 20 }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1C1B19', margin: '0 0 10px' }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: 14, color: '#6B6760', marginBottom: 24 }}>
              The app ran into an unexpected error. Try refreshing the page. If the problem persists, clearing your browser cache may help.
            </p>
            {this.state.error && (
              <pre style={{
                background: '#F4F1EB', borderRadius: 8, padding: 12,
                fontSize: 12, color: '#C0392B', textAlign: 'left',
                overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                marginBottom: 24,
              }}>
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px', borderRadius: 8,
                background: '#C0392B', color: '#fff',
                border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Refresh page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <RootErrorBoundary>
      <LMS />
    </RootErrorBoundary>
  )
}

export default App
