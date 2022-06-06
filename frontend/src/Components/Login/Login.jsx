import React from 'react';
import './Login.css';
import '../../styles.css';
import { Button } from '@material-ui/core';

function Login() {
  return (
    <>
      <div className='top'>
        <div className='login-content'>
          <text className='login-title'>My Garage</text>
          <Button
            style={{
              backgroundColor: '#00cc99',
              width: "200px",
              height: "45px"
            }}
            variant="contained">
              Login
          </Button>
        </div>
        
      </div>
      <div className='bottom'>
      </div>
    </>
  );
}

export default Login;
