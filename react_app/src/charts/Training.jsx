import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io('https://trainingstatus.ngrok.app');

function TrainingMetrics() {
  const [epoch, setEpoch] = useState(0);
  const [totalEpochs, setTotalEpochs] = useState(200); // Adjust according to your training setup
  const [batch, setBatch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [valLoss, setValLoss] = useState(0);
  const [stepTime, setStepTime] = useState('0ms');
  const [trainingStatus, setTrainingStatus] = useState('');

  useEffect(() => {
    socket.on('epoch_start', (data) => {
      setEpoch(data.epoch);
      setBatch(0);
    });

    socket.on('batch_metrics', (data) => {
      setBatch(data.batch);
      setLoss(data.loss);
      setStepTime(data.step_time);
    });

    socket.on('epoch_metrics', (data) => {
      setLoss(data.loss);
      setValLoss(data.val_loss);
    });

    return () => {
      socket.off('epoch_start');
      socket.off('batch_metrics');
      socket.off('epoch_metrics');
    };
  }, []);

  const startTraining = () => {
    axios.post('https://trainingstatus.ngrok.app/start_training')
      .then(response => {
        setTrainingStatus(response.data.status);
        if (response.data.status === 'Training started') {
          setEpoch(0);
          setBatch(0);
          setLoss(0);
          setValLoss(0);
          setStepTime('0ms');
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          setTrainingStatus('Training already in progress');
        } else {
          console.error('There was an error starting the training!', error);
          setTrainingStatus('Error starting training');
        }
      });
  };

  const calculateProgress = () => {
    return (epoch / totalEpochs) * 100;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-Time Training Metrics</h1>
        <button className="btn btn-primary" onClick={startTraining}>Start Training</button>
        <p>{trainingStatus}</p>
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
        <p>Batch: {batch}</p>
        <p>Loss: {loss}</p>
        <p>Validation Loss: {valLoss}</p>
        <p>Step Time: {stepTime}</p>
      </div>
    </div>
  );
}

export default TrainingMetrics;
