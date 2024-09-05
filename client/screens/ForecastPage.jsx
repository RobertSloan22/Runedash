import React, { useEffect } from 'react';

import RuneReturn from '../components/RuneReturned';
import Forecast2 from '../components/Forecast2';
import PredictionChart from '../charts/MongoApi';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { Tab } from 'react-bootstrap';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import DualAreaChart from '../charts/DualArea';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ForecastPage = () => {
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
        <Item sx={{ backgroundColor: 'black' }}>   
          
          </Item>
        </Grid>
        <Grid xs={12}>
        <Item sx={{ backgroundColor: 'black' }}>   
          
          </Item>
        </Grid>
        <Grid xs={12}>
        <Item sx={{ backgroundColor: '#1d1d1d' }}>
                  
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
     
        <Grid xs={4}>
        <Item style={{ color: 'white' }} sx={{ backgroundColor: 'black' }}>
        <Forecast2 />
          </Item>
        </Grid>
        <Grid xs={4}>
        <Item style={{ color: 'white' }} sx={{ backgroundColor: 'black' }}>
        <PredictionChart />
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
        <Grid xs={8}>
        <Item style={{ color: 'white' }} sx={{ backgroundColor: 'black' }}>
          <DualAreaChart/>
          </Item>
        </Grid>
      
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
        <Grid xs={8}>
        <Item style={{ color: 'white' }} sx={{ backgroundColor: 'black' }}>
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
        <Grid xs={8}>
        <Item style={{ color: 'white' }} sx={{ backgroundColor: 'black' }}>
          <h1>On Demand Rune Forecasting</h1>
          <h2>Select a Rune, - Its historical price data is then processed and run through the LSTM Forecasting Model</h2>
          <h3>THIS WILL TAKE ABOUT 5 MINUTES FROM START TO FINISH. PLEASE DO NOT LEAVE THE PAGE OR REFRESH</h3>

          <RuneReturn />
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
   
        
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
    
      </Grid>
    </Box>
    </>
  );
};

export default ForecastPage;
