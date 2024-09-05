import React, { useEffect } from 'react';
import PredictionhistoryChart from '../charts/PredictionsandHistory';
import Example from '../monitoring/ActivePieChart';
import NodeApi from '../monitoring/NodeAPiMonitors';
import DiscordRuneApi from '../monitoring/DiscordRuneApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import CenteredTabs from '../mui/CenteredTabs';
import ReturnRune from '../components/RuneReturned';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const SelectPage = () => {
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
    <>

    <div className="threechart">
      
              <DiscordRuneApi />
              <Example />
              <NodeApi />
            </div>
            
    <Box sx={{ flexGrow: 1, padding: 6 } }>
      <Grid container spacing={4}>
  
 
     
        <Grid xs={12}>
        <Item style={{ color: 'white' }} sx={{ backgroundColor: '#1d1d1d' }}>
        <Item style={{ color: 'white' }} sx={{ backgroundColor: '#1d1d1d', height: '800px' }}>
        <ReturnRune />
          </Item>
                   </Item>
        </Grid>
        <CenteredTabs style={{ position: 'sticky'}} />

      </Grid>
    </Box>
    </>
  );
};

export default SelectPage;
