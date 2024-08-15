import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'materialize-css/dist/js/materialize.min.js';
import 'jquery';
import ErrorBoundary from './ErrorBoundary';
import { PriceDataProvider } from '../src/context/PriceDataContext'; // Import the provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <React.StrictMode>
      <PriceDataProvider>  {/* Wrap your App with PriceDataProvider */}
        <App />
      </PriceDataProvider>
    </React.StrictMode>
  </ErrorBoundary>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
