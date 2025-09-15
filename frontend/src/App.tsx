import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import SiteDetails from './components/SiteDetails';
import { Box } from '@mui/material';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return token ? <>{children}</> : <Login setToken={setToken} />;
  };

  return (
    <BrowserRouter basename="/geospatial">
      <Box sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard token={token!} /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><MapView token={token!} /></ProtectedRoute>} />
          <Route path="/site/:id" element={<ProtectedRoute><SiteDetails token={token!} /></ProtectedRoute>} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;