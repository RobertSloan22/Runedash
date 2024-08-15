import React, { useEffect } from 'react';
import Navbarexample from './components/Navbar';
import TFJS from './charts/Tensorflow';
import Sidebar from './components/Sidebar';
import RunePricePrediction from './components/RunePricePrediction';
import RuneReturn from './components/RuneReturned';
import Forecast2 from './components/Forecast2';
import DiscordMonitor from './monitoring/DiscordMonitor';
import RuneMonitor from './monitoring/RuneMonitor';
import PieChartComponent from './monitoring/Database';
import FlaskApis from './monitoring/FlaskMonitors';
import PredictionChart from './charts/MongoApi';
import PredictionhistoryChart from './charts/PredictionsandHistory'; 
import ThreeDDonutChart from './monitoring/Three';
import TrainingMetrics from './charts/Training';
import ThreePython from './monitoring/ThreePython';
import Example from './monitoring/ActivePieChart'; // Adjust the path as necessary
import NodeApi from './monitoring/NodeAPiMonitors'; // Adjust the path as necessary`
import './App.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
import TrainingProgress from './monitoring/TrainingProgress';
import ThreeDO from './three/ThreeDSingleSegment';
import DiscordRuneApi from './monitoring/DiscordRuneApi';
import ThreeNode from './monitoring/ThreeNode';
import './index.css'; // Import the index CSS file
import 'materialize-css/dist/js/materialize.min.js';
import TimeDials from './context/TimeSeries';
import 'jquery';
import Main from './monitoring/Main';

const App = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
 
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      


            <div className="threechart">
              <DiscordRuneApi />
              <Example />
              <NodeApi />
            </div>     
         
            <div className="grid-container">
            <div className="python">
              <h2>BDC- Time Series Predictions</h2>
              <Forecast2 />
            </div>
            <div className="python">
              <h2>Rune-ID: BDC : Forecast Engine Recorded Predictions- Select a day to observe what the predictions were for that day.</h2>
              <PredictionChart />
            </div>
            <div className="selectrune">
              <h2>Forecast for Any Rune on the Bitcoin BlockChain: Using Custom Built and trained LSTM Neural Network</h2>
              <RuneReturn />
            </div>
            <div className="historical-data">
              <h2>Forecasted and Actual</h2>
              <PredictionhistoryChart />
            </div>
            <div className="historical-data">
              <h2>Historical Record- Price_sats, Volume_1d_btc</h2>
              <TimeDials />
            </div>
            <div className="tfjs">
              <h2>TensorFlow Javascript, In Browser Training Tool</h2>
              <RunePricePrediction />
            </div>
            </div>
              <div>
                <h1>Dashboard</h1>
                <section id="training"></section>
                <h2>TensorFlow Forecasting Engine Logs</h2>
                {/* Using the static LogTable component */}
              </div>
        
          <div className="tfjs">
            <h2>Python Training Module</h2>
            <TrainingMetrics />
            <TrainingProgress />

          </div>
          
          <div className="python">
            <h2>Python Training Module</h2>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
