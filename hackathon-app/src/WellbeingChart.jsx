import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WellbeingChart = ({ data }) => {
  // Get latest quarter data (quarter 4)
  const latestData = data.filter(item => item.quarter === '2025_Q4');
  
  const chartData = {
    labels: latestData.map(item => item.region.replace(' and The ', ' & ')),
    datasets: [
      {
        label: 'Life Satisfaction',
        data: latestData.map(item => item.life_satisfaction),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Worthwhile',
        data: latestData.map(item => item.worthwhile),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Happiness',
        data: latestData.map(item => item.happiness),
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderColor: 'rgba(251, 191, 36, 1)',
        borderWidth: 1,
      },
      {
        label: 'Anxiety (inverted)',
        data: latestData.map(item => 10 - item.anxiety), // Invert anxiety for better visualization
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
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
        text: 'Regional Wellbeing Metrics (Q4 2025)',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            if (context.dataset.label === 'Anxiety (inverted)') {
              const originalAnxiety = 10 - context.parsed.y;
              return `Original anxiety: ${originalAnxiety.toFixed(1)}`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Score (0-10)',
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default WellbeingChart;
