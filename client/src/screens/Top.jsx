import React, { useEffect } from 'react';
import Navbarexample from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RuneReturn from '../components/RuneReturned';
import Forecast2 from '../components/Forecast2';
import PredictionChart from '../charts/MongoApi';
import PredictionhistoryChart from '../charts/PredictionsandHistory';
import TrainingMetrics from '../charts/Training';
import ThreePython from '../monitoring/ThreePython';
import Example from '../monitoring/ActivePieChart';
import NodeApi from '../monitoring/NodeAPiMonitors';
import TrainingProgress from '../monitoring/TrainingProgress';
import DiscordRuneApi from '../monitoring/DiscordRuneApi';
import ThreeNode from '../monitoring/ThreeNode';
import TimeDials from '../context/TimeSeries';
import TabPanel from '../mui/TabPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { Tab } from 'react-bootstrap';
import MuiDrawer from '../mui/Drawer';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import CenteredTabs from '../mui/CenteredTabs';
import DualAreaChart from '../charts/DualArea';
import DualLineChart from '../charts/DualLine';
import { Area } from 'recharts';
import ClientHeader from '../components/ClientHeader';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const TopPage = () => {
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

  return (<>


            
    <Box sx={{ flexGrow: 1, padding: { xs: 2, sm: 4 } }}>
      <Grid container spacing={4}>
        <Grid xs={12}>
        <Item sx={{ backgroundColor: '#1d1d1d' }}>
          <ClientHeader />
          </Item>
        </Grid>
        <div className="treechart">
            <ThreeNode />
            <DiscordRuneApi />
            <Example />
            <NodeApi />
            <ThreePython />
        </div>
        <Grid xs={12}>
        <Item sx={{ backgroundColor: 'black' }}>   
        </Item>
        </Grid>
        </Grid>
    </Box>
    </>
  );
};

export default TopPage;
