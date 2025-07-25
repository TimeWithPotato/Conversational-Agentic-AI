import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ScoreBarChart = ({ evaluation }) => {
  const data = {
    labels: ['Grammar', 'Verbal Delivery', 'Correct Answers', 'Overall'],
    datasets: [
      {
        label: 'Score',
        data: [
          evaluation.grammar_score,
          evaluation.verbal_delivery,
          evaluation.correct_answers,
          evaluation.overall_score,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 10,
      ticks: {
        stepSize: 1,
        color: '#fff', // Y-axis tick color (white)
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.2)', // Y-axis grid line color (semi-transparent white)
      },
      title: {
        display: true,
        text: 'Score',
        color: '#fff',  // Y-axis title color
        font: { size: 14 },
      },
    },
    x: {
      ticks: {
        color: '#fff', // X-axis tick color (white)
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.2)', // X-axis grid line color
      },
      title: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      labels: {
        color: '#fff', // legend label color (if displayed)
      },
    },
    title: {
      display: true,
      text: 'Interview Evaluation Scores',
      font: { size: 18 },
      color: '#fff', // chart title color
    },
    tooltip: {
      bodyColor: '#fff',  // tooltip text color
      titleColor: '#ddd', // tooltip title color
      backgroundColor: 'rgba(0,0,0,0.7)', // tooltip background color
    },
  },
};


  return (
    <div className="w-full max-w-[600px] h-[350px] mx-auto mb-8">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ScoreBarChart;
