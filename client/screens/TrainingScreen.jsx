import React, { useEffect } from 'react';
import Navbarexample from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RuneReturn from '../components/RuneReturned';
import PredictionhistoryChart from '../charts/PredictionsandHistory';
import TrainingMetrics from '../charts/Training';
import TrainingProgress from '../monitoring/TrainingProgress';
import 'bootstrap/dist/css/bootstrap.min.css';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import CenteredTabs from '../mui/CenteredTabs';
import Tensorflowprice from '../charts/Tensorflow';
import RunePricePrediction from '../components/RunePricePrediction';  
import './app.css';
import DualAreaFullChart from '../charts/DualAreaFull';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const TrainingPage = () => {
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
        <CenteredTabs />
 
        <Grid xs={12}>
        <Item sx={{ backgroundColor: '#86797940', color: 'white' }}>   
          <Tensorflowprice />
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
     
        <Grid xs={8}>
        <Item style={{ color: 'white' }} sx={{ backgroundColor: 'black' }}>
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid><Grid xs={8}>
        <Item sx={{ backgroundColor: 'black' }}>
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>   
          </Item>
        </Grid>
        <Grid xs={12}>
        <Item sx={{ backgroundColor: 'black' }}>
                  
          </Item>
        </Grid>
        <Grid xs={2}>
        <Item sx={{ backgroundColor: 'black' }}>   
          </Item>
        </Grid>
        
        <Grid xs={8}>
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
        <Grid xs={8}>
        <Item style={{ color: 'white' }} sx={{ backgroundColor: '#1d1d1d' }}>
          <h1>Training LSTM Module</h1>
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
        <Item style={{ color: 'white' }} sx={{ backgroundColor: '#1d1d1d' }}>
          <h1>Training LSTM Module</h1>
          <TrainingProgress />
          </Item>
        </Grid>
   
      </Grid>
    </Box>
    </>
  );
};

export default TrainingPage;
