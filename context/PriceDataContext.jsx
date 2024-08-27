import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const PriceDataContext = createContext();

export const PriceDataProvider = ({ children }) => {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPriceData = async () => {
    try {
      const response = await axios.get('https://nodeendpoint.ngrok.app/api1/rune-data?rune_name=BILLION•DOLLAR•CAT');
      const data = response.data;
      setPriceData(data);
      localStorage.setItem('priceData', JSON.stringify(data));
      localStorage.setItem('lastFetched', Date.now());
    } catch (error) {
      console.error('Error fetching price data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem('priceData');
    const lastFetched = localStorage.getItem('lastFetched');

    if (storedData && lastFetched) {
      const timeSinceLastFetch = Date.now() - parseInt(lastFetched, 10);
      const twelveHours = 12 * 60 * 60 * 1000;

      if (timeSinceLastFetch < twelveHours) {
        setPriceData(JSON.parse(storedData));
        setLoading(false);
        return;
      }
    }

    fetchPriceData();
  }, []);

  return (
    <PriceDataContext.Provider value={{ priceData, loading }}>
      {children}
    </PriceDataContext.Provider>
  );
};
