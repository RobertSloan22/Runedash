import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProgressBar from 'react-bootstrap/ProgressBar';

const PredictionChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date('2024-08-18'));
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [yDomain, setYDomain] = useState([0, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setProgress(0);
        setStatusMessage('Fetching data...');
        const response = await axios.get('http://localhost:4650/api5/predictions'); // Replace with your actual endpoint
        if (response.headers['content-type'].includes('application/json')) {
          const fetchedData = response.data;
          setData(fetchedData);
          setStatusMessage('Data fetched successfully.');
          setProgress(100);

          // Calculate the min and max values for yDomain
          const transformedData = transformData(fetchedData);
          const predictions = transformedData.map(item => item.prediction);
          const minValue = Math.min(...predictions);
          const maxValue = Math.max(...predictions);
          setYDomain([minValue - 5, maxValue + 5]);
        } else {
          console.error('Error: Expected JSON response but got:', response.headers['content-type']);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setStatusMessage('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate && data.length > 0) {
      const selectedDateString = selectedDate.toISOString().split('T')[0];
      const filtered = data.filter(item => item.dates.some(date => date.startsWith(selectedDateString)));
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [selectedDate, data]);

  const transformData = (apiData) => {
    if (apiData.length === 0) return [];

    const dates = apiData[0].dates;
    const predictions = apiData[0].predictions.flat();

    return dates.map((date, index) => ({
      date,
      prediction: predictions[index]
    }));
  };

  const gradientOffset = () => {
    const dataMax = Math.max(...filteredData.map((i) => i.prediction));
    const dataMin = Math.min(...filteredData.map((i) => i.prediction));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <div>
      <h3>FORECAST RECORDS - SELECT DAY </h3>

      <div style={{ marginBottom: '20px' }}>
        <label>SELECT DATE: </label>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          isClearable
          placeholderText="Select a date"
        />
      </div>

      {loading && (
        <>
          <ProgressBar animated now={progress} />
          <p>{statusMessage}</p>
        </>
      )}

      <div style={{ width: '100%', height: '460px' }}>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart
            data={transformData(filteredData)}
            margin={{
              top: 10, right: 30, left: 0, bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={yDomain} tickFormatter={(value) => value.toFixed(2)} />
            <Tooltip />
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="green" stopOpacity={1} />
                <stop offset={off} stopColor="red" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="prediction" stroke="#000" fill="url(#splitColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionChart;
