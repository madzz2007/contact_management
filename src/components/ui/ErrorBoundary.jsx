/* Error boundary — a crashed section shows a friendly panel, never a blank page. */
/* Note: keyed by route in AppLayout, so navigation remounts and clears the error. */

import { Component } from 'react';
import { Icon } from './Icon.jsx';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: String(error?.message || 'Something went wrong in this section.') };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <Icon name="alert" size={28} label="" />
          <h3>This section hit an unexpected problem.</h3>
          <p className="muted">{this.state.message}</p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}