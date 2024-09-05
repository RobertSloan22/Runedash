import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CPUUsageChart from './CPUUsageChart';
import CPUUsageDial from './CPUUsageDial';
import MemoryUsageChart from './MemoryUsageChart';
import MemoryUsageDial from './MemoryUsageDial';

const Dashboard = () => {
  const [cpuUsage, setCpuUsage] = useState([]);
  const [memoryUsage, setMemoryUsage] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1.3/subcontainers/docker');
        setCpuUsage(response.data.cpuUsage || []);
        setMemoryUsage(response.data.memoryUsage || []);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError('Error fetching metrics. Please try again later.');
      }
    };

    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 5000); // Fetch metrics every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>System Metrics Dashboard</h1>
      {error ? (
        <div>{error}</div>
      ) : (
        <div>
          <h2>CPU Usage</h2>
          <CPUUsageChart data={cpuUsage} />
          <div className="d-flex flex-wrap">
            {cpuUsage.map((usage, index) => (
              <CPUUsageDial key={index} value={usage} label={`CPU ${index + 1}`} />
            ))}
          </div>
          <h2>Memory Usage</h2>
          <MemoryUsageChart data={memoryUsage} />
          <div className="d-flex flex-wrap">
            {memoryUsage.map((usage, index) => (
              <MemoryUsageDial key={index} value={usage} label={`Memory ${index + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
