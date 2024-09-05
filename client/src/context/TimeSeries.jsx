import React, { useContext } from 'react';
import TimeSeriesChart from './TimeSeriesChart';
import { PriceDataContext } from './PriceDataContext';

const TimeDials = () => {
  const { priceData } = useContext(PriceDataContext);

  return (
    <div>
      <TimeSeriesChart data={priceData} />
    </div>
  );
};

export default TimeDials;
