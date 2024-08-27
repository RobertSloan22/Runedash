import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

const Tableexample= () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('https://nodeendpoint.ngrok.app/api1/log-data')
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.error('Error fetching the data:', error);
      });
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
                <td>{log.log}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Tableexample;
