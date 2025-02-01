// index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Your CSS (if any)

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}