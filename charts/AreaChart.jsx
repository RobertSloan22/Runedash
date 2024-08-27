import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AreaChartComponent = ({ data, yDomain, filteredHistoricalData }) => {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
          <Area type="monotone" dataKey="prediction" stroke="#000" fill="white" name="Forecasted Price" />
          <Area type="monotone" data={filteredHistoricalData} dataKey="actual" stroke="#06f82b" name="Actual Price" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;
