import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TrainingMetrics() {
    const [status, setStatus] = useState('');
    const [epoch, setEpoch] = useState(0);
    const [totalEpochs, setTotalEpochs] = useState(200); // Adjust according to your training setup
    const [loss, setLoss] = useState(null);
    const [valLoss, setValLoss] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get('https://trainingstatus.ngrok.app/training_status')
                .then(response => {
                    setStatus(response.data.status);
                    setEpoch(response.data.current_epoch);
                    setLoss(response.data.loss);
                    setValLoss(response.data.val_loss);
                })
                .catch(error => {
                    console.error('Error fetching training status:', error);
                });
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const startTraining = () => {
        axios.post('https://trainingstatus.ngrok.app/start_training')
            .then(response => {
                setStatus(response.data.status);
                if (response.data.status === 'Training started') {
                    setEpoch(0);
                    setLoss(null);
                    setValLoss(null);
                }
            })
            .catch(error => {
                console.error('Error starting training:', error);
                setStatus('Error starting training');
            });
    };

    const calculateProgress = () => {
        return (epoch / totalEpochs) * 100;
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Real-Time Training Metrics</h1>
                <button className="btn btn-primary" onClick={startTraining}>
                    Start Training
                </button>
                <p>{status}</p>
            </header>
            
            <div className="progress my-3">
                <div
                    className="progress-bar progress-bar-striped"
                    role="progressbar"
                    style={{ width: `${calculateProgress()}%` }}
                    aria-valuenow={calculateProgress()}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>

            <div className="tfjs">
                <h2>Training Progress</h2>
                <p>Epoch: {epoch}/{totalEpochs}</p>
                <p>Loss: {loss}</p>
                <p>Validation Loss: {valLoss}</p>
            </div>
        </div>
    );
}

export default TrainingMetrics;
