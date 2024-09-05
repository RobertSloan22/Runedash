import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchForecastData } from '../fetchData';

const Chart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const fetchedData = await fetchForecastData();
      if (fetchedData) {
        const joinedData = fetchedData.dates.map((date, index) => ({
          date,
          prediction: fetchedData.predictions[index]
        }));
        setData(joinedData);
      }
    }
    getData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="prediction" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Chart;
