import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const ContainerCPUChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://e529a2b38d380536.ngrok.app/api/v1.3/subcontainers/docker')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data || data.length === 0) {
          throw new Error('No data available');
        }

        // Extract timestamps and CPU usage from data
        const timestamps = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
        const cpuUsage = data.map(entry => entry.cpu.usage.total / 1e9); // Convert from nanoseconds to seconds

        // Set the chart data
        setChartData({
          labels: timestamps,
          datasets: [
            {
              label: 'CPU Usage (s)',
              data: cpuUsage,
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
            }
          ]
        });

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching metrics:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching metrics: {error.message}</div>;
  if (!chartData) return <div>No data available</div>;

  return (
    <div>
      <h2>Container CPU Usage</h2>
      <Line data={chartData} />
    </div>
  );
};

export default ContainerCPUChart;
