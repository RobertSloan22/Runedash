import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const HistoricalData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://99.37.183.149:3030/api1/rune-data?rune_name=BILLION•DOLLAR•CAT')
      .then(response => {
        const responseData = response.data.map(item => ({
          timestamp: item.timestamp,
          price_sats: item.price_sats
        }));
        setData(responseData);
      })
      .catch(error => {
        console.error('Error fetching historical data:', error);
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="price_sats" stroke="#8884d8" fill="#ff0000" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HistoricalData;
