import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ScorePieChart = ({ evaluation }) => {
  const data = {
    labels: ['Grammar', 'Verbal Delivery', 'Overall'],
    datasets: [
      {
        label: 'Score',
        data: [
          evaluation.grammar_score,
          evaluation.verbal_delivery,
          evaluation.overall_score,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Score Distribution',
      font: { size: 18 },
      color: '#fff', // white title
    },
    legend: {
      position: 'bottom',
      labels: {
        color: '#fff', // white legend labels
        font: { size: 14 },
      },
    },
    tooltip: {
      bodyColor: '#fff',  // white tooltip text
      titleColor: '#ddd', // lighter title text
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // dark tooltip background
    },
  },
};


  return (
    <div className="w-full max-w-[400px] h-[300px] mx-auto">
      <Pie data={data} options={options} />
    </div>
  );
};

export default ScorePieChart;
