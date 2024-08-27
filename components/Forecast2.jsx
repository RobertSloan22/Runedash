import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const Forecast2 = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [yDomain, setYDomain] = useState([0, 0]);

  const fetchStatusData = async () => {
    try {
      const response = await axios.get('https://flask3055.ngrok.app/api4/forecastingstatus', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status); // Log status
      console.log('Response data:', response.data); // Log full response data

      const fetchedData = response.data;

      if (fetchedData && fetchedData.dates && fetchedData.predictions) {
        const formattedData = fetchedData.dates.map((date, index) => ({
          date,
          prediction: fetchedData.predictions[index][0],
        }));
        setData(formattedData);

        // Calculate the min and max values
        const predictions = formattedData.map(item => item.prediction);
        const minValue = Math.min(...predictions);
        const maxValue = Math.max(...predictions);
        setYDomain([minValue - 5, maxValue + 5]);
      } else {
        setData([]); // Set empty data if dates or predictions are missing
      }

      setStatus(fetchedData.status || 'No status available');
      setTimestamp(fetchedData.timestamp || 'No timestamp available');
    } catch (error) {
      console.error('Error fetching forecasting status:', error);
      setStatus('Error fetching status');
      setTimestamp('Error fetching timestamp');
      setData([]); // Set empty data on error
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axios.get('https://flask3055.ngrok.app/api4/forecastplot', {
        responseType: 'blob',
      });
      const imageUrl = URL.createObjectURL(response.data);
      setImageSrc(imageUrl);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    fetchStatusData();
    fetchImage();

    const intervalId = setInterval(() => {
      fetchStatusData();
      fetchImage();
    }, 5 * 60 * 1000); // Refetch every 5 minutes

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const onImageLoaded = useCallback((img) => {
    setCrop({
      unit: '%',
      width: 100,
      height: 50, // Adjust this to crop the image vertically
      x: 0,
      y: 25, // Adjust this to crop the image vertically
    });
  }, []);

  return (
    <div>
      <h3>LSTM FORECASTING ENGINE-REAL TIME</h3>
      <h4>Status: {status}</h4>
      <h4>Last Updated: {timestamp}</h4>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            domain={yDomain} 
            tickFormatter={(value) => value.toFixed(2)} 
          />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="prediction" stroke="green" fill="#4682B4" />
        </AreaChart>
      </ResponsiveContainer>

      {imageSrc && (
        <ReactCrop
          src={imageSrc}
          crop={crop}
          onImageLoaded={onImageLoaded}
          onChange={(newCrop) => setCrop(newCrop)}
        />
      )}
    </div>
  );
};

export default Forecast2;
