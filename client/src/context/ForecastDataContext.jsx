import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ForecastDataContext = createContext();

export const ForecastDataProvider = ({ children }) => {
  const [ForecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForecastData = async () => {
    try {
      const response = await axios.get('http://localhost:4650/api5/predictions');
      const data = response.data;
      setForecastData(data);
      localStorage.setItem('forecastData', JSON.stringify(data));
      localStorage.setItem('forecastLastFetched', Date.now());
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem('forecastData');
    const lastFetched = localStorage.getItem('forecastLastFetched');

    if (storedData && lastFetched) {
      const timeSinceLastFetch = Date.now() - parseInt(lastFetched, 10);
      const twelveHours = 12 * 60 * 60 * 1000;

      if (timeSinceLastFetch < twelveHours) {
        setForecastData(JSON.parse(storedData));
        setLoading(false);
        return;
      }
    }

    fetchForecastData();
  }, []);

  return (
    <ForecastDataContext.Provider value={{ ForecastData, loading }}>
      {children}
    </ForecastDataContext.Provider>
  );
};
