import React, { useEffect, useState, useRef } from 'react';
import Dashboard from './Dashboard';
import axios from 'axios';

const Main = () => {
  const [cpuUsage, setCpuUsage] = useState([]);
  const [memoryUsage, setMemoryUsage] = useState([]);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('https://d768aa661ec19e34.ngrok.app/metrics');  // Adjust the API endpoint as necessary
        setCpuUsage(response.data.cpuUsage);
        setMemoryUsage(response.data.memoryUsage);
      } catch (error) {
        console.error('SYSTEM-RUNTIME-DATA', error);
      }
    };

    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 5000);  // Fetch metrics every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;

    const onIframeLoad = () => {
      // Send a message to the iframe to adjust the scroll position
      iframe.contentWindow.postMessage({ type: 'scrollToMiddle' }, '*');
    };

    if (iframe) {
      iframe.onload = onIframeLoad;
    }
  }, []);

  return (
    <>
      <div></div>
      <div style={{ height: '70vh', width: '100%' }}>
        <h3 className="text-center mt-3">Docker Container Monitoring</h3>
        <iframe
          ref={iframeRef}
          src="https://ebb7fad5e4b25808.ngrok.app/containers/"
          style={{ border: 'none', width: '100%', height: '100%' }}
          title="Container Page"
        />
      </div>
    </>
  );
};

export default Main;
