// src/components/ContainerMetrics.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PROMETHEUS_URL = 'http://localhost:9090/api/v1';

const ContainerMetrics = () => {
  const [cpuUsage, setCpuUsage] = useState([]);
  const [memoryUsage, setMemoryUsage] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const cpuResponse = await axios.get(`${PROMETHEUS_URL}/query`, {
          params: { query: 'rate(container_cpu_usage_seconds_total[1m])' }
        });
        setCpuUsage(cpuResponse.data.data.result);

        const memoryResponse = await axios.get(`${PROMETHEUS_URL}/query`, {
          params: { query: 'container_memory_usage_bytes' }
        });
        setMemoryUsage(memoryResponse.data.data.result);
      } catch (error) {
        console.error('Error fetching metrics from Prometheus:', error);
      }
    };

    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container-metrics">
      <h3>Container Metrics</h3>
      <div>
        <h4>CPU Usage</h4>
        <ul>
          {cpuUsage.map((metric, index) => (
            <li key={index}>
              {metric.metric.container}: {metric.value[1]}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Memory Usage</h4>
        <ul>
          {memoryUsage.map((metric, index) => (
            <li key={index}>
              {metric.metric.container}: {metric.value[1]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContainerMetrics;
