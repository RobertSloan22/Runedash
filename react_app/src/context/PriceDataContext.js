// PriceDataContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const PriceDataContext = createContext();

export const PriceDataProvider = ({ children }) => {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axios.get('https://nodeendpoint.ngrok.app/api1/rune-data?rune_name=BILLION•DOLLAR•CAT');
        setPriceData(response.data);
      } catch (error) {
        console.error('Error fetching price data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, []);

  return (
    <PriceDataContext.Provider value={{ priceData, loading }}>
      {children}
    </PriceDataContext.Provider>
  );
};
