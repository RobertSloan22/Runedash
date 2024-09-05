import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MemoryUsageChart = ({ data }) => {
  const formattedData = data.map((value, index) => ({
    name: `Memory ${index + 1}`,
    usage: value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="usage" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MemoryUsageChart;
