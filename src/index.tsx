import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Board } from './Board';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Board />
  </React.StrictMode>
);
