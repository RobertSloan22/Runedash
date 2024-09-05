import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RuneMonitor = () => {
    const [status, setStatus] = useState('INACTIVE');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get('http://localhost:5540/status');
                if (response.data.running) {
                    setStatus('ACTIVE');
                } else {
                    setStatus('INACTIVE');
                }
            } catch (error) {
                console.error('Error fetching status:', error);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000); // Fetch status every 5 seconds

        return () => clearInterval(interval);
    }, []);
    

    return (
        <div className="container mt-5">
            <h2>Rune Monitor</h2>
            <div className="mt-3">
                <p>Status: {status} {status === 'ACTIVE' ? (
                    <div className="spinner-grow text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    <div className="spinner-grow text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                </p>
            </div>
        </div>
    );
};

export default RuneMonitor;