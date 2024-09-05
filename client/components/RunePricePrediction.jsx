import { useEffect, useState } from 'react';
import M from 'materialize-css';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import styles from './Tensorflow.module.css';

const Tensorflowprice = () => {
  const [dataRaw, setDataRaw] = useState([]);
  const [smaData, setSmaData] = useState([]);
  const [windowSize, setWindowSize] = useState(7);
  const [model, setModel] = useState(null);
  const [status, setStatus] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [ticker, setTicker] = useState("BILLION•DOLLAR•CAT");
  const [runeNames, setRuneNames] = useState([]);

  useEffect(() => {
    M.AutoInit();
    
    loadModel();
    fetchRuneNames();
  }, []);

  const loadModel = async () => {
    try {
      const loadedModel = await tf.loadLayersModel('/model.json');
      setModel(loadedModel);
      updateStatus('Model loaded');
    } catch (error) {
      console.error('Error loading model:', error);
      updateStatus('Error loading model');
    }
  };

  const fetchRuneNames = async () => {
    try {
      const response = await axios.get('http://localhost:3030/api1/rune-names');
      setRuneNames(response.data);
    } catch (error) {
      console.error('Error fetching rune names:', error);
      updateStatus('Error fetching rune names');
    }
  };

  const updateStatus = (message) => {
    setStatus(message);
  };

  const fetchData = async () => {
    const btnFetchData = document.getElementById("btn_fetch_data");
    const loadFetchData = document.getElementById("load_fetch_data");
    const containerLinegraph = document.getElementById("div_container_linegraph");
    const linegraphDataTitle = document.getElementById("div_linegraph_data_title");

    if (btnFetchData) btnFetchData.style.display = 'none';
    if (loadFetchData) loadFetchData.style.display = 'block';

    const requestUrl = `http://localhost:3030/api1/rune-data?rune_name=${encodeURIComponent(ticker)}&limit=50`;

    try {
      const response = await axios.get(requestUrl);
      const data = response.data;

      setDataRaw(data.map(entry => ({
        timestamp: entry.timestamp,
        price: entry.price_sats
      })));

      if (containerLinegraph) containerLinegraph.style.display = 'block';
      if (btnFetchData) btnFetchData.style.display = 'block';
      if (loadFetchData) loadFetchData.style.display = 'none';
      if (linegraphDataTitle) linegraphDataTitle.innerText = `Symbol: ${ticker} (last refreshed ${new Date().toISOString()})`;

      if (data.length > 0) {
        setSmaData(data);

        if (document.getElementById("div_container_getsma")) {
          document.getElementById("div_container_getsma").style.display = 'block';
          document.getElementById("div_container_getsmafirst").style.display = 'none';
        }
      } else {
        const linegraphData = document.getElementById("div_linegraph_data");
        if (linegraphData) linegraphData.innerText = "No data found";
        if (btnFetchData) btnFetchData.style.display = 'block';
        if (loadFetchData) loadFetchData.style.display = 'none';
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      const linegraphData = document.getElementById("div_linegraph_data");
      if (linegraphData) linegraphData.innerText = "Error fetching data";
      if (btnFetchData) btnFetchData.style.display = 'block';
      if (loadFetchData) loadFetchData.style.display = 'none';
    }
  };

  const displaySMA = () => {
    const inputWindowSize = document.getElementById("input_windowsize");
    const windowSizeValue = inputWindowSize ? parseInt(inputWindowSize.value) : windowSize;
    setWindowSize(windowSizeValue);

    const btnDrawSMA = document.getElementById("btn_draw_sma");
    const loadDrawSMA = document.getElementById("load_draw_sma");
    const containerSMA = document.getElementById("div_container_sma");
    const linegraphSMATitle = document.getElementById("div_linegraph_sma_title");

    if (btnDrawSMA) btnDrawSMA.style.display = 'none';
    if (loadDrawSMA) loadDrawSMA.style.display = 'block';
    if (containerSMA) containerSMA.style.display = 'block';

    const smaData = computeSMA(dataRaw, windowSizeValue);
    setSmaData(smaData);

    if (linegraphSMATitle) linegraphSMATitle.innerText = `Rune Price and Simple Moving Average (window: ${windowSizeValue})`;
    if (btnDrawSMA) btnDrawSMA.style.display = 'block';
    if (loadDrawSMA) loadDrawSMA.style.display = 'none';

    if (document.getElementById("div_container_train")) {
      document.getElementById("div_container_train").style.display = 'block';
      document.getElementById("div_container_trainfirst").style.display = 'none';
    }

    displayTrainingData(smaData);
  };

  const displayTrainingData = (smaData) => {
    const containerTrainingData = document.getElementById("div_container_trainingdata");
    if (containerTrainingData) containerTrainingData.style.display = 'block';

    const set = smaData.map(val => val.set);
    let dataOutput = "";
    for (let index = 0; index < 25; index++) {
      dataOutput += `<tr key=${index}><td width="20px">${index + 1}</td><td>[${set[index].map(val => (Math.round(val.price * 10000) / 10000).toString()).toString()}]</td><td>${smaData[index].avg}</td></tr>`;
    }

    dataOutput = `<table class='striped'><thead><tr><th scope='col'>#</th><th scope='col'>Input (X)</th><th scope='col'>Label (Y)</th></thead><tbody>${dataOutput}</tbody></table>`;

    const trainingData = document.getElementById("div_trainingdata");
    if (trainingData) trainingData.innerHTML = dataOutput;
  };

  const computeSMA = (data, windowSize) => {
    let rAvgs = [];
    for (let i = 0; i <= data.length - windowSize; i++) {
      let currAvg = 0.00, t = i + windowSize;
      for (let k = i; k < t && k <= data.length; k++) {
        currAvg += data[k].price / windowSize;
      }
      rAvgs.push({ set: data.slice(i, i + windowSize), avg: currAvg });
    }
    return rAvgs;
  };

  const fetchAndPredict = async () => {
    try {
      const responseData = dataRaw.map(item => ({
        timestamp: item.timestamp,
        price_sats: item.price
      }));
      const preprocessedData = await preprocessData(responseData);
      if (model) {
        predict(preprocessedData);
      } else {
        updateStatus('Model not loaded');
      }
    } catch (error) {
      console.error('Error preprocessing data:', error);
      updateStatus('Error preprocessing data');
    }
  };

  const preprocessData = async (data) => {
    updateStatus('Preprocessing data...');
  
    data.forEach(d => d.timestamp = new Date(d.timestamp));
    data.sort((a, b) => a.timestamp - b.timestamp);
  
    const groupedData = {};
    data.forEach(d => {
      const hour = new Date(d.timestamp).setMinutes(0, 0, 0);
      if (!groupedData[hour]) {
        groupedData[hour] = {
          Open: d.price_sats,
          High: d.price_sats,
          Low: d.price_sats,
          Close: d.price_sats,
          Volume: 1
        };
      } else {
        groupedData[hour].High = Math.max(groupedData[hour].High, d.price_sats);
        groupedData[hour].Low = Math.min(groupedData[hour].Low, d.price_sats);
        groupedData[hour].Close = d.price_sats;
        groupedData[hour].Volume += 1;
      }
    });
  
    const processedData = Object.keys(groupedData).map(hour => ({
      Hour: new Date(Number(hour)),
      ...groupedData[hour]
    }));
  
    for (let i = 1; i < processedData.length; i++) {
      if (!processedData[i].Close) {
        processedData[i].Close = processedData[i - 1].Close;
      }
    }
  
    const closeValues = processedData.map(d => d.Close);
    const maxCloseValue = Math.max(...closeValues);
    const normalizedData = closeValues.map(v => v / maxCloseValue);
  
    const sequenceLength = 30;
    const X = [];
    for (let i = sequenceLength; i < normalizedData.length; i++) {
      const sequence = normalizedData.slice(i - sequenceLength, i).map(v => [v]);
      X.push(sequence);
    }
  
    updateStatus('Data preprocessed');
    return tf.tensor3d(X, [X.length, sequenceLength, 1]);
  };

  const predict = async (preprocessedData) => {
    updateStatus('Running predictions...');
    try {
      const predictionsTensor = model.predict(preprocessedData);
      const predictionsArray = await predictionsTensor.array();
      const predictionsData = predictionsArray.map((pred, index) => ({
        timestamp: new Date(dataRaw[dataRaw.length - predictionsArray.length + index].timestamp),
        prediction: pred[0]
      }));
  
      setPredictions(predictionsData);
      updateStatus('Predictions complete');
    } catch (error) {
      console.error('Error during prediction:', error);
      updateStatus('Error during prediction');
    }
  };

  const trainModel = async () => {
    updateStatus('Training model...');
    const preprocessedData = await preprocessData(dataRaw);
    const { X, y } = prepareTrainingData(preprocessedData);

    const newModel = tf.sequential();
    newModel.add(tf.layers.lstm({ units: 50, returnSequences: true, inputShape: [X.shape[1], 1] }));
    newModel.add(tf.layers.lstm({ units: 50 }));
    newModel.add(tf.layers.dense({ units: 1 }));

    newModel.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError'
    });

    await newModel.fit(X, y, {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (logs && logs.loss !== undefined && logs.val_loss !== undefined) {
            updateStatus(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, val_loss = ${logs.val_loss.toFixed(4)}`);
          } else {
            updateStatus(`Epoch ${epoch + 1}: no logs available`);
          }
        }
      }
    });

    await newModel.save('localstorage://my-model');
    setModel(newModel);
    updateStatus('Model trained and saved');
  };

  const prepareTrainingData = (data) => {
    const sequenceLength = 30;
    const X = [];
    const y = [];
    for (let i = sequenceLength; i < data.length; i++) {
      X.push(data.slice(i - sequenceLength, i));
      y.push(data[i]);
    }

    return {
      X: tf.tensor3d(X, [X.length, sequenceLength, 1]),
      y: tf.tensor2d(y, [y.length, 1])
    };
  };

  return (
    <div className={styles.container}>
      <h1>Rune Price Prediction</h1>
      
      <div>
        <select onChange={(e) => setTicker(e.target.value)} value={ticker}>
          {runeNames.map(rune => (
            <option key={rune.rune_name} value={rune.rune_name}>
              {rune.rune_name}
            </option>
          ))}
        </select>
        <input
          type="text"
          id="input_ticker"
          placeholder="Enter Rune Name"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
        <button id="btn_fetch_data" onClick={fetchData}>
          Fetch Data
        </button>
        <div id="load_fetch_data" className={styles.loadingIndicator} style={{ display: 'none' }}>
          Loading...
        </div>
      </div>
  
      {dataRaw.length > 0 && (
        <div id="div_container_linegraph">
          <h3 id="div_linegraph_data_title">
            Symbol: {ticker} (last refreshed {new Date().toISOString()})
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={dataRaw}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSMA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
              <Area type="monotone" dataKey="sma" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSMA)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
  
      {smaData.length > 0 && (
        <div id="div_container_getsma">
          <div>
            <label htmlFor="input_windowsize">Window Size</label>
            <input
              type="number"
              id="input_windowsize"
              placeholder="Enter window size"
              defaultValue={windowSize}
            />
          </div>
          <button id="btn_draw_sma" onClick={displaySMA}>
            Display SMA
          </button>
          <div id="load_draw_sma" className={styles.loadingIndicator} style={{ display: 'none' }}>
            Loading...
          </div>
        </div>
      )}
  
      {smaData.length > 0 && (
        <div id="div_container_sma">
          <h3 id="div_linegraph_sma_title">
            Rune Price and Simple Moving Average (window: {windowSize})
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={smaData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSMA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
              <Area type="monotone" dataKey="avg" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSMA)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
  
      {smaData.length > 0 && (
        <div id="div_container_trainingdata">
          <h3 id="div_linegraph_trainingdata_title">Training Data</h3>
          <div id="div_trainingdata"></div>
        </div>
      )}
  
      <div id="div_container_train">
        <button onClick={trainModel}>Train Model</button>
        <div id="status">{status}</div>
      </div>
  
      {predictions.length > 0 && (
        <div id="div_container_predictions">
          <h3 id="div_linegraph_predictions_title">Predictions</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={predictions}>
              <defs>
                <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="prediction" stroke="#ff7300" fillOpacity={1} fill="url(#colorPrediction)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
  
      <button onClick={fetchAndPredict}>Fetch and Predict</button>
      <button onClick={trainModel}>Train Model</button>
      <div id="status">{status}</div>
      <div id="output">{predictions.map((pred, index) => <div key={index}>{pred.prediction}</div>)}</div>
    </div>
  );
  
};

export default Tensorflowprice;
