import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const RuneDataComponent = ({ runeName }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/api1/rune-data?rune_name=BILLION•DOLLAR•CAT`);
        const formattedData = response.data.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp).toLocaleString(), // Format timestamp if necessary
        }));
        setData(formattedData);
      } catch (error) {
        console.error(`Error fetching data for rune ${runeName}:`, error);
      }
    };

    fetchData();
  }, [runeName]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price_sats" stroke="#8884d8" />
        <Line type="monotone" dataKey="volume_1d_btc" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RuneDataComponent;
