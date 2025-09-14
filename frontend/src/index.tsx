import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CssBaseline } from '@mui/material';  // For MUI styles
import 'leaflet/dist/leaflet.css';  // Leaflet CSS
import 'leaflet-draw/dist/leaflet.draw.css';  // Draw plugin CSS

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);