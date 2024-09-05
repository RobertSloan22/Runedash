import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const DiscordMonitor = () => {
    const [status, setStatus] = useState({ status: 'INACTIVE', time: '' });

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // Use the proxy path configured in Nginx
                const response = await axios.get('https://08329d6c246f9ab5.ngrok.app/status');
                setStatus(response.data);
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
            <h2>Discord Scraper</h2>
            <div className="mt-3">
                <p>Time: {status.time}</p>
                <p>Status: {status.status} {status.status === 'ACTIVE' ? (
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

export default DiscordMonitor;
