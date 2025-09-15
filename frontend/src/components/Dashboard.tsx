import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, List, ListItem, ListItemText, Box, Typography, Link } from '@mui/material';

interface Props { token: string; }

interface Project { id: number; name: string; }

const Dashboard: React.FC<Props> = ({ token }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('https://darukaa-backend.onrender.com/projects', { headers: { Authorization: `Bearer ${token}` } });
      setProjects(res.data);
    } catch (e) {
      console.error('Failed to fetch projects');
    }
  };

  const createProject = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://darukaa-backend.onrender.com/projects', { name }, { headers: { Authorization: `Bearer ${token}` } });
      setProjects([...projects, res.data]);
      setName('');
    } catch (e) {
      console.error('Failed to create project');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>Dashboard - Projects</Typography>
      <TextField
        label="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      />
      <Button variant="contained" onClick={createProject} fullWidth disabled={loading || !name}>
        {loading ? 'Creating...' : 'Create Project'}
      </Button>
      <List sx={{ mt: 2 }}>
        {projects.map((p) => (
          <ListItem key={p.id}>
            <ListItemText
              primary={p.name}
              secondary={
                <Link href="/map" underline="hover">View on Map</Link>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Dashboard;