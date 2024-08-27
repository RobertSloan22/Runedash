import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useGetUserProfileQuery } from '../app/services/auth/authService';
import { logout, setCredentials } from '../features/auth/auth0Slice';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
const Header = () => {
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
          <div>
            <h1>WELCOME BACK </h1>
            <h2>BITCOIN RUNE FORECASTING</h2>
            {userInfo ? (
              <div>Welcome, {userInfo.name}!</div>

            ) : (
              <div>LOGIN OR SIGNUP</div>
            )}

            <div className='header-status'>
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
             

              <br></br>
              <div>
               
              </div>
            </nav>
          </div>
        </header>
  
        </div>
    </>
  );
};

export default Header;