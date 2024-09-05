import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Header from './Page/Header';
import ThreePython from './monitoring/ThreePython';
import Example from './monitoring/ActivePieChart'; // Adjust the path as necessary
import NodeApi from './monitoring/NodeAPiMonitors';
import LandingPage from './screens/LandingPage';
import LoginPage from './screens/LoginScreen';
import ForecastPage from './screens/ForecastPage';
import HistoryPage from './screens/HistoricalDataScreen';
import SelectPage from './screens/SelectRune';
import TrainingMetrics from './charts/Training';
import TrainingScreen from './screens/TrainingScreen';
import './App.css';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from './screens/HomeScreen';
import TopPage from './screens/Top';
// import plotly 


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <TopPage />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/forecastpage" element={<ForecastPage />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/history" element={<HistoryPage />} />  
        <Route path="/training" element={<TrainingScreen />} />
        <Route path="/select" element={<SelectPage />} />  
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/app" element={isAuthenticated ? <MainApp /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function MainApp() {
  return (
    <>
    <div className="root">
      <TopPage />
      <div className="content">
        
    
      </div>
      {/* Add other components as needed */}
    </div>
    </>
  );
}

export default App;