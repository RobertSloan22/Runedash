import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import './returned.css';
const runeNames = [
  "DOG GO TO THE MOON",
  "BANK OF NAKAMOTO DOLLAR",
  "RSIC GENESIS RUNE",
  "PUPS WORLD PEACE",
  "Z Z Z Z Z FEHU Z Z Z Z Z",
  "RSIC GENESIS RUNE",
  "MEMES GO TO THE MOON",
  "RUNI RUNI RUNI RUNI",
  "NIKOLA TESLA GOD",
];

const ReturnRune = () => {
  const [runeName, setRuneName] = useState('');
  const [data, setData] = useState([]); 
  const [timestamp, setTimestamp] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [yDomain, setYDomain] = useState([0, 0]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setRuneName(runeNames[index]);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setProgress(0);
    setStatusMessage('Job started...');
    setData([]);
    setTimestamp('');

    const formattedRuneName = runeName.toUpperCase().replace(/\s+/g, '•');

    try {
      const response = await axios.post('https://cdaf3b7a6b8f740b.ngrok.app/api4/forecast', {
        rune_name: formattedRuneName,
      });

      if (response.data && response.data.job_id) {
        setJobId(response.data.job_id);
        pollJobStatus(response.data.job_id);
      }
    } catch (error) {
      console.error('Error starting forecasting:', error);
      setLoading(false);
    }
  };

  const pollJobStatus = async (jobId) => {
    let progressInterval = 0;
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(`https://cdaf3b7a6b8f740b.ngrok.app/api4/forecast_status/${jobId}`);
        console.log('Polling job status:', response.data);

        if (response.data && response.data.status === "completed") {
          clearInterval(intervalId);
          setProgress(100);
          setStatusMessage('Job completed.');
          if (response.data.data) {
            const formattedData = response.data.data.map(item => ({
              date: item.date,
              prediction: item.prediction,
            }));
            console.log('Formatted data for recharts:', formattedData);

            setData(formattedData);
            setTimestamp(new Date().toLocaleString());
            setLoading(false);

            const predictions = formattedData.map(item => item.prediction);
            const minValue = Math.min(...predictions);
            const maxValue = Math.max(...predictions);
            setYDomain([minValue - 5, maxValue + 5]);
          } else {
            console.error('Error: response.data.data is undefined');
            setLoading(false);
          }
        } else if (response.data && response.data.status === "error") {
          clearInterval(intervalId);
          setStatusMessage('Error during forecasting.');
          console.error('Error during forecasting:', response.data.error);
          setLoading(false);
        } else if (response.data && response.data.message) {
          setStatusMessage(response.data.message);
        }

        if (progress < 95) {
          progressInterval += 1;
          setProgress(progressInterval);
        }
      } catch (error) {
        clearInterval(intervalId);
        setStatusMessage('Error polling job status.');
        console.error('Error polling job status:', error);
        setLoading(false);
      }
    }, 5000);
  };

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.prediction));
    const dataMin = Math.min(...data.map((i) => i.prediction));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  useEffect(() => {
    console.log('Data in state:', data);
  }, [data]);

  return (
    <>
    <div className="grid-column">
      <div className="grid-row">

      
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Rune selection button group with a nested menu"
      >
        <Button onClick={handleToggle}>{runeNames[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select rune"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      </div>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {runeNames.map((rune, index) => (
                    <MenuItem
                      key={rune}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {rune}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
            <br>
            </br>
      <form onSubmit={handleSubmit}>
        <label>
          Rune Name:
          <input type="text" value={runeName} onChange={(e) => setRuneName(e.target.value)} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {loading && (
        <>
          <ProgressBar animated now={progress} />
          <h3>{statusMessage}</h3>
        </>
      )}

      <h3>Last Updated: {timestamp}</h3>

      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={yDomain} tickFormatter={(value) => value.toFixed(2)} />
            <Tooltip />
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="green" stopOpacity={0.6} />
                <stop offset={off} stopColor="red" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="prediction" stroke="#000" fill="url(#splitColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
    </>

  );
};

export default ReturnRune;
