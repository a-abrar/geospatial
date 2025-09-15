import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom'; // ✅ Import RouterLink
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Typography, Button } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props { token: string; }

interface Analytics { date: string; carbon: number; biodiversity: number; }

const SiteDetails: React.FC<Props> = ({ token }) => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{ site: any; analytics: Analytics[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`https://darukaa-backend.onrender.com/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setData(res.data);
          setLoading(false);
        })
        .catch(e => {
          console.error('Failed to fetch site details');
          setLoading(false);
        });
    }
  }, [id, token]);

  if (loading) return <Box sx={{ mt: 5 }}><Typography>Loading...</Typography></Box>;
  if (!data) return <Box sx={{ mt: 5 }}><Typography>Site not found</Typography></Box>;

  const chartData = {
    labels: data.analytics.map((a: Analytics) => a.date),
    datasets: [
      {
        label: 'Carbon Levels',
        data: data.analytics.map((a: Analytics) => a.carbon),
        borderColor: '#2196f3',
        backgroundColor: '#2196f3',
      },
      {
        label: 'Biodiversity Index',
        data: data.analytics.map((a: Analytics) => a.biodiversity),
        borderColor: '#4caf50',
        backgroundColor: '#4caf50',
      },
    ],
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>Site {id} Details</Typography>
      <Typography variant="body1" gutterBottom>Metrics: {data.site.metrics}</Typography>
      <Typography variant="h6" gutterBottom>Analytics Over Time</Typography>
      <Line data={chartData} />
      <Button
        component={RouterLink}
        to="/dashboard"
        variant="outlined"
        sx={{ mt: 3 }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default SiteDetails;
