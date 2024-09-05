import { useContext, useEffect, useState } from 'react';
import { PriceDataContext } from '../context/PriceDataContext';
import { ForecastDataContext } from '../context/ForecastDataContext';
import AreaChartComponent from './AreaChart';

const DualAreaFullChart = () => {
  const { priceData, loading: priceDataLoading } = useContext(PriceDataContext);
  const { forecastData, loading: forecastDataLoading } = useContext(ForecastDataContext);

  const [transformedForecastData, setTransformedForecastData] = useState([]);
  const [transformedHistoricalData, setTransformedHistoricalData] = useState([]);
  const [yDomain, setYDomain] = useState([0, 10]);

  // Define the transformForecastData function
  const transformForecastData = (apiData) => {
    const dates = apiData.dates;
    const predictions = apiData.predictions.flat();

    return dates.map((date, index) => ({
      date,
      prediction: predictions[index]
    }));
  };

  // Helper function to group data by date and pick one entry per day
  const groupDataByDate = (data) => {
    const groupedData = {};

    data.forEach(item => {
      const date = item.date.split('T')[0]; // Get the date part only
      if (!groupedData[date]) {
        groupedData[date] = item;
      } else {
        // Replace with the last entry (or implement averaging if preferred)
        groupedData[date] = item;
      }
    });

    return Object.values(groupedData);
  };

  useEffect(() => {
    if (forecastData.length > 0 && priceData.length > 0) {
      const transformedForecast = groupDataByDate(forecastData.flatMap(transformForecastData));

      const transformedHistorical = groupDataByDate(
        priceData
          .filter(item => item.rune_name === 'BILLION•DOLLAR•CAT')
          .map(item => ({
            date: new Date(item.timestamp).toISOString().split('T')[0],
            actual: parseFloat(item.price_sats),
          }))
      );

      setTransformedForecastData(transformedForecast);
      setTransformedHistoricalData(transformedHistorical);

      const allPrices = [
        ...transformedForecast.map(item => item.prediction),
        ...transformedHistorical.map(item => item.actual)
      ];
      if (allPrices.length > 0) {
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);
        setYDomain([minPrice - 5, maxPrice + 5]);
      }
    }
  }, [forecastData, priceData]);

  return (
    <div>
      <h3>FORECAST DATA / ACTUAL PRICE HISTORY</h3>
      {(priceDataLoading || forecastDataLoading) && <p>Loading...</p>}
      <AreaChartComponent
        data={transformedForecastData}
        yDomain={yDomain}
        filteredHistoricalData={transformedHistoricalData}
      />
    </div>
  );
};

export default DualAreaFullChart;
