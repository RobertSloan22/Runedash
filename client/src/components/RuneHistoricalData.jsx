import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';

const RuneHistoricalData = () => {
  const [runeData, setRuneData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3030/api1/rune-names?rune_name=BILLION•DOLLAR•CAT');
        setRuneData(response.data);
      } catch (error) {
        console.error('Error fetching rune data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={runeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price_sats" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={runeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="volume_1d_btc" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RuneHistoricalData;