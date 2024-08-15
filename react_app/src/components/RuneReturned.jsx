import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ForecastingProcessAccordion from './Accoridan';

const runeNames = [
  "DOG GO TO THE MOON",
  "BANK OF NAKAMOTO DOLLAR",
  "RSIC GENESIS RUNE",
  "PUPS WORLD PEACE",
  "Z Z Z Z Z FEHU Z Z Z Z Z",
];

const ReturnRune = () => {
  const [runeName, setRuneName] = useState('');
  const [data, setData] = useState([]); // State to store forecast data
  const [timestamp, setTimestamp] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [yDomain, setYDomain] = useState([0, 0]);

  const handleInputChange = (event) => {
    setRuneName(event.target.value);
  };

  const handleButtonClick = (rune) => {
    setRuneName(rune);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setProgress(0);
    setStatusMessage('Job started...');
    setData([]); // Clear previous data
    setTimestamp('');

    const formattedRuneName = runeName.toUpperCase().replace(/\s+/g, '•');

    try {
      const response = await axios.post('https://cdaf3b7a6b8f740b.ngrok.app/api4/forecast', {
        rune_name: formattedRuneName,
      });

      if (response.data && response.data.job_id) {
        setJobId(response.data.job_id);
        pollJobStatus(response.data.job_id);
      }
    } catch (error) {
      console.error('Error starting forecasting:', error);
      setLoading(false);
    }
  };

  const pollJobStatus = async (jobId) => {
    let progressInterval = 0;
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(`https://cdaf3b7a6b8f740b.ngrok.app/api4/forecast_status/${jobId}`);
        console.log('Polling job status:', response.data); // Debug logging

        if (response.data && response.data.status === "completed") {
          clearInterval(intervalId);
          setProgress(100); // Set progress to 100% on completion
          setStatusMessage('Job completed.');
          if (response.data.data) {
            const formattedData = response.data.data.map(item => ({
              date: item.date,
              prediction: item.prediction,
            }));
            console.log('Formatted data for recharts:', formattedData); // Debug logging

            setData(formattedData);
            setTimestamp(new Date().toLocaleString());
            setLoading(false);

            // Calculate the min and max values for yDomain
            const predictions = formattedData.map(item => item.prediction);
            const minValue = Math.min(...predictions);
            const maxValue = Math.max(...predictions);
            setYDomain([minValue - 5, maxValue + 5]);
          } else {
            console.error('Error: response.data.data is undefined');
            setLoading(false);
          }
        } else if (response.data && response.data.status === "error") {
          clearInterval(intervalId);
          setStatusMessage('Error during forecasting.');
          console.error('Error during forecasting:', response.data.error);
          setLoading(false);
        } else if (response.data && response.data.message) {
          setStatusMessage(response.data.message);
        }

        // Increment progress by a certain percentage
        if (progress < 95) {
          progressInterval += 1;
          setProgress(progressInterval);
        }
      } catch (error) {
        clearInterval(intervalId);
        setStatusMessage('Error polling job status.');
        console.error('Error polling job status:', error);
        setLoading(false);
      }
    }, 5000); // Poll every 5 seconds
  };

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.prediction));
    const dataMin = Math.min(...data.map((i) => i.prediction));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  useEffect(() => {
    console.log('Data in state:', data); // Add this line to see the state change
  }, [data]);

  return (
    <>

        <ButtonGroup size="lg" className="mb-2">
          {runeNames.map((rune, index) => (
            <Button key={index} onClick={() => handleButtonClick(rune)}>
              {rune}
            </Button>
          ))}
        </ButtonGroup>

        <form onSubmit={handleSubmit}>
          <label>
            Rune Name:
            <input type="text" value={runeName} onChange={handleInputChange} />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>

        {loading && (
          <>
            <ProgressBar animated now={progress} />
            <h3>{statusMessage}</h3>
          </>
        )}

        <h3>Last Updated: {timestamp}</h3>

        <div style={{ width: '100%', height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={yDomain} tickFormatter={(value) => value.toFixed(2)} />
              <Tooltip />
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="green" stopOpacity={0.6} />
                  <stop offset={off} stopColor="red" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="prediction" stroke="#000" fill="url(#splitColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
    </>
  );
};

export default ReturnRune;
