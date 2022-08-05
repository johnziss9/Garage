import React, { useState } from 'react';
import './Login.css';
import '../../styles.css';
import CustomTextField from '../../Components/CustomTextField/CustomTextField';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from '@mui/material';

function Login() {

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);

  const handleShowForm = () => setShowForm(true);
  const handleHideForm = () => setShowForm(false);
  const handleShowLoginFailedSB = () => setLoginFailed(true);
  const handleHideLoginFailedSB = () => setLoginFailed(false);
  const handleClearUsername = () => setUsername('');
  const handleClearPassword = () => setPassword('');

  const handleLogin = () => {
    fetch('http://localhost:5000/api/authentication/login', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then((Response) => Response.json())
    .then((result) => {
        if (result.status === 'success')  {
          sessionStorage.setItem('token', result.user.token);
          sessionStorage.setItem('username', username);
          navigate('/Reminders');
        }
        else {
          handleShowLoginFailedSB();
          handleClearUsername();
          handleClearPassword();
        }
    })
  }

  return (
    <>
      <div className='top-login'>
        {loginFailed ? 
          <Snackbar
            autoHideDuration={4000}
            open={handleShowLoginFailedSB}
            onClose={handleHideLoginFailedSB}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity='error' onClose={handleHideLoginFailedSB}>Invalid Credentials</Alert>
          </Snackbar>
        : null}
        <div className='login-content'>
          <div className='login-title'>Garage Volt</div>
          {!showForm ?
            <CustomButton backgroundColor={'#00cc99'} width={'200px'} height={'45px'} value={'Login'} onClick={handleShowForm}></CustomButton> :
            <form className='login-form'>
              <CustomTextField label={"Username"} size={"small"} onChange={e => setUsername(e.target.value)} value={username} borderColour={"#00cc99"}></CustomTextField>
              <CustomTextField label={"Password"} size={"small"} type={'password'} onChange={e => setPassword(e.target.value)} value={password} borderColour={"#00cc99"}></CustomTextField>
              <div className='login-buttons'>
                <CustomButton backgroundColor={'#b3b3b3'} width={'120px'} height={'40px'} value={'Cancel'} onClick={handleHideForm}></CustomButton>
                <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Login'} onClick={handleLogin}></CustomButton>
              </div>
            </form>
          }
        </div>
        
      </div>
      <div className='bottom-login'></div>
    </>
  );
}

export default Login;
