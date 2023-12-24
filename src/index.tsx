import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import { MainMenu } from './ui/MainMenu';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MainMenu />
  </React.StrictMode>
);
