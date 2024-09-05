import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const Forecast2 = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [crop, setCrop] = useState({ aspect: 16 / 9 });

  const fetchStatusData = async () => {
    try {
      const response = await axios.get('http://localhost:3055/forecastingstatus', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status); // Log status
      console.log('Response data:', response.data); // Log full response data

      const fetchedData = response.data;
      const formattedData = fetchedData.dates.map((date, index) => ({
        date,
        prediction: fetchedData.predictions[index][0],
      }));

      console.log('Formatted data:', formattedData); // Log the formatted data

      setData(formattedData);
      setStatus(fetchedData.status);
      setTimestamp(fetchedData.timestamp);
    } catch (error) {
      console.error('Error fetching forecasting status:', error);
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axios.get('http://localhost:3055/forecastplot', {
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
    }, 1 * 60 * 1000); // Refetch every 5 minutes

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
      <h3>Status: {status}</h3>
      <h3>Last Updated: {timestamp}</h3>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[42, 48]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="prediction" stroke="#8884d8" />
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
