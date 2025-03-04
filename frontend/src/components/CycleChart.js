import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import cycleService from '../services/cycleService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CycleChart = () => {
  const navigate = useNavigate();
  const [cycles, setCycles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchCycles = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        setLoading(true);
        setError('');
        const data = await cycleService.getCycles();
        setCycles(data);
      } catch (err) {
        if (err.message === 'Unauthorized') {
          navigate('/login');
        } else {
          setError('Failed to fetch cycle data');
          console.error('Error fetching cycles:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCycles();
  }, [navigate]);

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  if (!cycles.length) {
    return null;
  }

  const chartData = {
    labels: cycles.map(cycle => 
      new Date(cycle.startDate).toLocaleDateString()
    ).reverse(),
    datasets: [
      {
        label: 'Cycle Length (days)',
        data: cycles.map(cycle => cycle.cycleLength).reverse(),
        borderColor: '#FF69B4',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Cycle History',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Days'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Start Date'
        }
      }
    }
  };

  return <Line options={options} data={chartData} />;
};

export default CycleChart; 