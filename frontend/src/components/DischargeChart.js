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

const DischargeChart = () => {
  const navigate = useNavigate();
  const [discharges, setDischarges] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchDischarges = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        setLoading(true);
        setError('');
        const data = await cycleService.getDischargeHistory();
        setDischarges(data);
      } catch (err) {
        if (err.message === 'Unauthorized') {
          navigate('/login');
        } else {
          setError('Failed to fetch discharge data');
          console.error('Error fetching discharges:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDischarges();
  }, [navigate]);

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  if (!discharges.length) {
    return null;
  }

  // Create color mapping for different discharge types
  const colorMap = {
    'watery': '#4A90E2',
    'sticky': '#F5A623',
    'creamy': '#7ED321',
    'egg-white': '#9013FE',
    'thick': '#D0021B'
  };

  const chartData = {
    labels: discharges.map(discharge => 
      new Date(discharge.date).toLocaleDateString()
    ).reverse(),
    datasets: [
      {
        label: 'Consistency',
        data: discharges.map(discharge => {
          // Convert consistency to numeric value for visualization
          const consistencyMap = {
            'watery': 1,
            'sticky': 2,
            'creamy': 3,
            'egg-white': 4,
            'thick': 5
          };
          return consistencyMap[discharge.consistency];
        }).reverse(),
        borderColor: '#FF69B4',
        backgroundColor: discharges.map(discharge => 
          colorMap[discharge.consistency]
        ).reverse(),
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#FF69B4',
        pointHoverBorderWidth: 2,
        pointHoverBorderRadius: 4,
        pointHoverHitRadius: 10,
        pointHoverShadowBlur: 10,
        pointHoverShadowColor: 'rgba(0, 0, 0, 0.3)',
        pointHoverShadowOffsetX: 1,
        pointHoverShadowOffsetY: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Your Discharge Patterns',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const discharge = discharges[context.dataIndex];
            return [
              `Consistency: ${discharge.consistency}`,
              `Color: ${discharge.color}`,
              `Amount: ${discharge.amount}`,
              `Odor: ${discharge.odor}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            const consistencyMap = {
              1: 'Watery',
              2: 'Sticky',
              3: 'Creamy',
              4: 'Egg White',
              5: 'Thick'
            };
            return consistencyMap[value];
          }
        },
        title: {
          display: true,
          text: 'Consistency'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return <Line options={options} data={chartData} />;
};

export default DischargeChart; 