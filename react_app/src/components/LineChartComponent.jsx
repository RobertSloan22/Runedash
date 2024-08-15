import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const LineChartComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://nodeendpoint.ngrok.app/api1/forecast')
      .then(response => {
        const { dates, predictions } = response.data;
        const chartData = dates.map((date, index) => ({
          date,
          prediction: predictions[index]
        }));
        setData(chartData);
      })
      .catch(error => {
        console.error('Error fetching forecast data:', error);
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="prediction" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
