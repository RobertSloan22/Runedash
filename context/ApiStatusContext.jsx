// ApiStatusContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ApiStatusContext = createContext();

const endpoints = [
    { name: 'DiscordAPI', endpoint: 'https://08329d6c246f9ab5.ngrok.app/status' },
    { name: 'Discordhealth', endpoint: 'https://08329d6c246f9ab5.ngrok.app/health' },
    { name: 'RuneAPI', endpoint: 'https://a16f3f32b182ec9a.ngrok.app/status' },
    { name: 'Runehealth', endpoint: 'https://a16f3f32b182ec9a.ngrok.app/health' },
    { name: '5080-Base', endpoint: 'https://flaskapiforecasting.ngrok.app/health' },
    { name: '3055-Base', endpoint: 'https://flask3055.ngrok.app/health' },
    { name: '3055Status', endpoint: 'https://flask3055.ngrok.app/api4/forecastingstatus' },
    { name: '3055FP', endpoint: 'https://flask3055.ngrok.app/api4/forecastplot' },
    { name: 'BDC-4650', endpoint: 'https://mongo4650api.ngrok.app/api5/predictions' },
    { name: '4650H', endpoint: 'https://mongo4650api.ngrok.app/health' },
    { name: '5100-Training', endpoint: 'https://trainingstatus.ngrok.app/health' },
    { name: '3030-Base', endpoint: 'https://nodeendpoint.ngrok.app' },
    { name: 'Server-Health', endpoint: 'https://nodeendpoint.ngrok.app/health' },
    { name: 'Price/volume', endpoint: 'https://nodeendpoint.ngrok.app/api1/rune-names' },
    { name: 'ServerLogs', endpoint: 'https://nodeendpoint.ngrok.app/api1/log-data' },
    { name: 'RuneNames', endpoint: 'https://nodeendpoint.ngrok.app/api1/rune-names' },
    { name: 'Forecasts', endpoint: 'https://nodeendpoint.ngrok.app/api1/forecast' },
    { name: 'RuneLogs', endpoint: 'https://nodeendpoint.ngrok.app/api1/rune-logs' },
];

export const ApiStatusProvider = ({ children }) => {
    const [statuses, setStatuses] = useState(
        endpoints.map(endpoint => ({
            name: endpoint.name,
            status: 'loading',
            fill: '#8884d8', // Default color
        }))
    );

    const checkEndpoints = async () => {
        const newStatuses = await Promise.all(endpoints.map(async (endpoint, index) => {
            try {
                await axios.head(endpoint.endpoint); // Use head for lightweight status check
                return { name: endpoint.name, status: 'alive', fill: '#00C49F' }; // Green if alive
            } catch (error) {
                return { name: endpoint.name, status: 'down', fill: '#FF8042' }; // Red if not
            }
        }));

        setStatuses(newStatuses);
    };

    useEffect(() => {
        checkEndpoints();
        const interval = setInterval(checkEndpoints, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <ApiStatusContext.Provider value={statuses}>
            {children}
        </ApiStatusContext.Provider>
    );
};
