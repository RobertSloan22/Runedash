import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

const LogTable = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Use the proxy path configured in Nginx
        const response = await axios.get('http://localhost:3030/api1/log-data');
        console.log('Fetched logs:', response.data); // Check the structure of the data
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching the data:', error);
      }
    };

    fetchLogs();
  }, []);

  const containerStyle = {
    height: '400px', // Adjust the height as needed
    overflowY: 'scroll',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
  };

  return (
    <div>
      <div style={containerStyle}>
        <Table responsive="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Log</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td>{log._id}</td>
                <td>{typeof log.log === 'object' ? JSON.stringify(log.log) : log.log}</td> {/* Ensure log is rendered correctly */}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default LogTable;
