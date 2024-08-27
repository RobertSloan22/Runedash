import React from 'react';
import './App.css';

const ForecastGraph = () => {
  return (
	<div style={{ width: '100%', height: '100vh' }}>
	  <iframe
		src="http://localhost:5080/api/forecastplot"
		style={{ width: '100%', height: '100%', border: 'none' }}
		title="Forecast Display"
	  />
	</div>
  );
};

export default ForecastGraph;