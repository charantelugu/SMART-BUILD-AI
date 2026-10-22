import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart, BarChart2 } from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function CostBreakdownChart({ breakdown = {}, totalCost = 0 }) {
  const [chartType, setChartType] = useState('doughnut'); // 'doughnut' or 'bar'

  const labels = [
    'Cement',
    'Steel',
    'Bricks',
    'Tiles',
    'Pipes',
    'Electrical',
    'Plumbing',
    'Paint',
    'Sand',
    'Aggregates'
  ];

  const dataValues = [
    breakdown.cement || 0,
    breakdown.steel || 0,
    breakdown.bricks || 0,
    breakdown.tiles || 0,
    breakdown.pipes || 0,
    breakdown.electrical || 0,
    breakdown.plumbing || 0,
    breakdown.paint || 0,
    breakdown.sand || 0,
    breakdown.aggregates || 0
  ];

  const backgroundColors = [
    '#3b82f6', // Cement - Blue
    '#10b981', // Steel - Emerald
    '#ef4444', // Bricks - Red
    '#f59e0b', // Tiles - Amber
    '#06b6d4', // Pipes - Cyan
    '#8b5cf6', // Electrical - Purple
    '#ec4899', // Plumbing - Pink
    '#14b8a6', // Paint - Teal
    '#eab308', // Sand - Yellow
    '#64748b'  // Aggregates - Slate
  ];

  const doughnutData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: '#111827',
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  };

  const barData = {
    labels,
    datasets: [
      {
        label: 'Cost in ₹ (INR)',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 12 },
          padding: 14
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            const val = context.raw || 0;
            const percentage = totalCost > 0 ? ((val / totalCost) * 100).toFixed(1) : 0;
            return ` ₹${val.toLocaleString('en-IN')} (${percentage}%)`;
          }
        }
      }
    },
    scales: chartType === 'bar' ? {
      x: {
        ticks: { color: '#94a3b8', font: { family: 'Inter' } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: {
          color: '#94a3b8',
          font: { family: 'JetBrains Mono' },
          callback: (value) => `₹${(value / 1000).toFixed(0)}k`
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    } : {}
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.15rem' }}>Material Cost Breakdown</h3>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Category-wise expenditure &amp; proportion
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${chartType === 'doughnut' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setChartType('doughnut')}
          >
            <PieChart size={16} /> Doughnut
          </button>
          <button
            className={`btn btn-sm ${chartType === 'bar' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setChartType('bar')}
          >
            <BarChart2 size={16} /> Bar Chart
          </button>
        </div>
      </div>

      <div style={{ height: '320px', position: 'relative' }}>
        {chartType === 'doughnut' ? (
          <Doughnut data={doughnutData} options={options} />
        ) : (
          <Bar data={barData} options={options} />
        )}
      </div>
    </div>
  );
}
