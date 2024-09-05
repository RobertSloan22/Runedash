import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link } from 'react-router-dom';

export default function CenteredTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#1d1d1d' }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="LandingPage" component={Link} to="/" sx={{ color: 'white' }} />
        <Tab label="ForeccastPage" component={Link} to="/forecastpage" sx={{ color: 'white' }} />
        <Tab label="LSTM Training" component={Link} to="/training" sx={{ color: 'white' }} />

      </Tabs>
    </Box>
  );
}