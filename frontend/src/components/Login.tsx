import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // ✅ Import this

interface Props { setToken: (token: string) => void; }

const Login: React.FC<Props> = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ Get navigate function

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = isRegister ? 'register' : 'login';
      const res = await axios.post(`https://darukaa-backend.onrender.com/${endpoint}`, { username, password });
      if (!isRegister) {
        const token = res.data.access_token;
        setToken(token);
        localStorage.setItem('token', token);
        navigate('/dashboard'); // ✅ Use navigate instead of window.location.href
      } else {
        navigate('/'); // ✅ Redirect after registration
      }
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Error occurred');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>{isRegister ? 'Register' : 'Login'}</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      />
      <Button variant="contained" onClick={handleSubmit} fullWidth disabled={loading || !username || !password}>
        {loading ? 'Loading...' : 'Submit'}
      </Button>
      <Button onClick={() => setIsRegister(!isRegister)} fullWidth sx={{ mt: 2 }}>
        Switch to {isRegister ? 'Login' : 'Register'}
      </Button>
    </Box>
  );
};

export default Login;
