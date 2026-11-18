import React from 'react';
import { toggleTheme } from '../../utils/theme.js';
import './Header.module.css';

export function Header() {
  return (
    <header className="header">
      <h1 className="title">Contact Management</h1>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        🌓
      </button>
    </header>
  );
}
