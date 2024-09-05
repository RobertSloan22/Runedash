// ApiStatusContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ApiStatusContext = createContext();

const endpoints = [

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
