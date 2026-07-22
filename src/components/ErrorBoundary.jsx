import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '3rem 2rem', textAlign: 'center',
          color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-small)', lineHeight: 1.7,
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}>!</div>
          <p>Something went wrong.</p>
          <p style={{ color: 'var(--text-dim)', fontSize: 'var(--fs-xs)', marginTop: '1rem' }}>
            {this.state.error.message}
          </p>
          <button onClick={() => window.location.reload()}
            style={{
              marginTop: '1.5rem', padding: '8px 20px', minHeight: 44,
              fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-small)',
              color: 'var(--text)', background: 'var(--surface-2)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}>
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
