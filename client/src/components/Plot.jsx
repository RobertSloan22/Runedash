import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

function TrainingApi() {
  const [logs, setLogs] = useState([]);
  const [plotUrl, setPlotUrl] = useState('');

  useEffect(() => {
    // Fetch logs data from the API
    fetch('http://localhost:3030/api1/log-data')
      .then(response => response.json())
      .then(data => {
        setLogs(data.INFO.concat(data.WARNING, data.ERROR));
      })
      .catch(error => console.error('Error fetching logs:', error));

    // Fetch plot URL
    setPlotUrl('/api/plot');
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Training Logs and Plot</h1>
      </header>
      <div className="content">
        <h2>Logs</h2>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              <strong>{log.timestamp}</strong>: {log.message}
            </li>
          ))}
        </ul>
        <h2>Training Plot</h2>
        <img src={plotUrl} alt="Training Plot" style={{ maxWidth: '100%' }} />
      </div>
    </div>
  );
}

export default TrainingApi;
