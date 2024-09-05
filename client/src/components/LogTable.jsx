import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

const LogTable = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:3030/api1/log-data');
        if (response.headers['content-type'].includes('application/json')) {
          setLogs(response.data);
        } else {
          console.error('Error: Expected JSON response but got:', response.headers['content-type']);
        }
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
