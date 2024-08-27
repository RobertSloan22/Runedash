import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const LineChartComponent = ({ data, yDomain, filteredHistoricalData }) => {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={yDomain} tickFormatter={(value) => value.toFixed(2)} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="prediction" stroke="#8884d8" name="Forecasted Price" />
          <Line type="monotone" data={filteredHistoricalData} dataKey="actual" stroke="#82ca9d" name="Actual Price" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
