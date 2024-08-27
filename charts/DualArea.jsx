import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { PriceDataContext } from '../context/PriceDataContext'; // Import the context
import AreaChartComponent from './AreaChart'; // Import the AreaChart component

const DualAreaChart = () => {
  const { priceData, loading: priceDataLoading } = useContext(PriceDataContext); // Access global state
  const [forecastData, setForecastData] = useState([]);
  const [filteredForecastData, setFilteredForecastData] = useState([]);
  const [filteredHistoricalData, setFilteredHistoricalData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date('2024-07-21'));
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [yDomain, setYDomain] = useState([0, 10]);

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        setLoading(true);
        setProgress(0);
        setStatusMessage('Fetching forecast data...');
        const forecastResponse = await axios.get('https://mongo4650api.ngrok.app/api5/predictions'); // Replace with your actual endpoint

        if (forecastResponse.headers['content-type'].includes('application/json')) {
          setForecastData(forecastResponse.data);
          setStatusMessage('Forecast data fetched successfully.');
          setProgress(100);
        } else {
          console.error('Error: Expected JSON response but got:', forecastResponse.headers['content-type']);
        }
      } catch (error) {
        console.error('Error fetching forecast data:', error);
        setStatusMessage('Error fetching forecast data.');
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, []);

  useEffect(() => {
    if (selectedDate && forecastData.length > 0 && priceData.length > 0) {
      const selectedDateString = selectedDate.toISOString().split('T')[0];
      const filteredForecast = forecastData.filter(item => item.dates && item.dates.some(date => date.startsWith(selectedDateString)));

      const filteredHistorical = priceData.filter(item => {
        const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
        return itemDate === selectedDateString && item.rune_name === 'BILLION•DOLLAR•CAT';
      }).map(item => ({
        date: item.timestamp,
        actual: parseFloat(item.price_sats)
      }));

      const transformedForecastData = filteredForecast.length > 0 ? transformForecastData(filteredForecast[0]) : [];
      setFilteredForecastData(transformedForecastData);
      setFilteredHistoricalData(filteredHistorical);

      // Calculate Y-axis domain based on the combined data
      const allPrices = [
        ...transformedForecastData.map(item => item.prediction),
        ...filteredHistorical.map(item => item.actual)
      ];
      if (allPrices.length > 0) {
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);
        setYDomain([minPrice - 5, maxPrice + 5]);
      }
    } else {
      setFilteredForecastData([]);
      setFilteredHistoricalData([]);
    }
  }, [selectedDate, forecastData, priceData]);

  const transformForecastData = (apiData) => {
    const dates = apiData.dates;
    const predictions = apiData.predictions.flat();

    return dates.map((date, index) => ({
      date,
      prediction: predictions[index]
    }));
  };

  return (
    <div>
      <h3>FORECAST DATA / ACTUAL PRICE HISTORY</h3>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Date: </label>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          isClearable
          placeholderText="Select a date"
        />
      </div>

      {(loading || priceDataLoading) && (
        <>
          <ProgressBar animated now={progress} />
          <p>{statusMessage}</p>
        </>
      )}

   

      <AreaChartComponent
        data={filteredForecastData}
        yDomain={yDomain}
        filteredHistoricalData={filteredHistoricalData}
      />
    </div>
  );
};

export default DualAreaChart;
