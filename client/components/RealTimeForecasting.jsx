import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useState, useEffect } from 'react';

const RealTimeForecasting = () => {
  const [forecastData, setForecastData] = useState([]);
  const [runeNames, setRuneNames] = useState([]);
  const [selectedRune, setSelectedRune] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3030/api1/rune-names')
      .then(response => {
        setRuneNames(response.data);
      })
      .catch(error => {
        console.error('Error fetching rune names:', error);
      });
  }, []);

  const fetchPrediction = async (runeName) => {
    try {
      const response = await fetch('http://localhost:5080/predict', {  // Adjust the URL/port as necessary
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rune_name: runeName }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);  // Process the response data as needed
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const runForecast = async () => {
    const predictionData = await fetchPrediction(selectedRune);
    if (predictionData) {
      const { dates, predictions } = predictionData;
      const chartData = dates.map((date, index) => ({
        date,
        prediction: predictions[index]
      }));
      setForecastData(chartData);
    }
  };

  return (
    <div>
      <select value={selectedRune} onChange={(e) => setSelectedRune(e.target.value)}>
        <option value="">Select a rune</option>
        {runeNames.map((rune) => (
          <option key={rune} value={rune}>{rune}</option>
        ))}
      </select>
      <button onClick={runForecast}>Run Forecast</button>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={forecastData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="prediction" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RealTimeForecasting;