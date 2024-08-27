import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useGetUserProfileQuery } from '../app/services/auth/authService';
import { logout, setCredentials } from '../features/auth/authSlice';
import '../styles/header.css';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Card from 'react-bootstrap/Card';
import ChatGPT from '../ChatWindow/ChatGPT';


const ClientHeader = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  // automatically authenticate user if token is found
  const { data, isFetching } = useGetUserProfileQuery('userDetails', {
    pollingInterval: 900000, // 15mins
  });

  useEffect(() => {
    if (data) dispatch(setCredentials(data));
  }, [data, dispatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div>
        <header>
      
            <div className='header-status'>
            {userInfo ? (
              <div><h2>Welcome, {userInfo.name}!</h2></div>

            ) : (
              <div>Please log in.</div>
            )}
              <span>
                {isFetching
                  ? `Fetching your profile...`
                  : userInfo !== null
                  ? `Logged in as ${userInfo.email}`
                  : "You're not logged in"}
              </span>
              <div className='cta'>
                {userInfo ? (
                  <button className='button' onClick={() => dispatch(logout())}>
                    Logout
                  </button>
                ) : (
                  <NavLink className='button' to='/login'>
                    Login
                  </NavLink>
                )}
              </div>
            </div>
            <nav className='container navigation'>
              
              <NavLink to='/register'>REGISTER</NavLink>

              <NavLink to='/login'>LOGIN</NavLink>

              <NavLink to='/forecastpage'>FORECASTPAGE</NavLink>

              <NavLink to='/training'>LSTM TRAINING</NavLink>

              <NavLink to='/'>HOME</NavLink>
              <br></br>
            
            </nav>
        </header>
        <div className='offcanvas-menu'>
          <Button variant='primary' onClick={handleShow} className='me-2'>
                  Chat with Robert Assistance (AI)
          </Button>
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Assistance </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <ChatGPT />
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </div>
    </>
  );
};

export default ClientHeader;