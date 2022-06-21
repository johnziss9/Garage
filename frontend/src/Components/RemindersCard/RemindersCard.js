import React from 'react';
import './RemindersCard.css';
import moment from 'moment';
import { Divider, Dialog, DialogTitle, DialogContent } from '@mui/material';
import CustomButton from '../CustomButton/CustomButton';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';

function RemindersCard(props) {

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const currentDate = moment(new Date(), "DD.MM.YYYY");
  const expiryDate = moment(props.expiry_date, "DD.MM.YYYY");

  // const handleLogin = () => {
  //   fetch('http://localhost:5000/api/authentication/login', {
  //       method: 'post',
  //       headers: {
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //           username: username,
  //           password: password
  //       })
  //   })
  //   .then((Response) => Response.json())
  //   .then((result) => {
  //       if (result.status === 'success')  {
  //         sessionStorage.setItem('token', result.user.token);
  //         sessionStorage.setItem('username', username);
  //         navigate('/Reminders');
  //       }
  //       else {
  //         handleShowLoginFailedSB();
  //         handleClearUsername();
  //         handleClearPassword();
  //       }
  //   })
  // }

  return (
    <div className='reminders-card-wrapper'>
      <div className='reminders-card-type'>{props.type}</div>
      <div className='reminders-number-plate'>{props.number_plate}</div>
      <div className='reminders-make'>{props.make}</div>
      <div className='reminders-model'>{props.model}</div>
      <Divider style={{width:'90%'}} />
      <div className='reminders-expiring-text'>{props.expiry_date_type}</div>
      <div className='reminders-expiring-date'>{props.expiry_date}</div>
      {props.type === 'RENTAL' ?
      <div className='reminders-customer'>{props.customer}</div> :
      <div className='reminders-days-left'>{expiryDate.diff(currentDate, 'days')} days left</div> }
      <div className='reminders-button'>
        <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={props.button_value} color={'#fff'} onClick={handleOpen} />
      </div>
      <Dialog open={open} onClose={handleClose}>
        {(() => {
          switch (props.type) {
            case 'M.O.T.':
              return <div>
                <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', alignItems: 'center', flexDirection: 'column', minWidth: '300px' }} >
                  <div style={{ fontSize: '25px', fontWeight: 'bold' }}>{props.type}</div>
                  <div>{props.make} {props.model} ({props.number_plate})</div>
                </DialogTitle>
                <Divider style={{width:'100%'}} />
                <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CustomDatePicker label="M.O.T. Start Date" />
                  <CustomDatePicker label="M.O.T. End Date" />
                  <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Renew'} color={'#fff'}></CustomButton>
                </DialogContent>
              </div>
            case 'ROAD TAX':
              return <div>
                <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', alignItems: 'center', flexDirection: 'column', minWidth: '300px' }} >
                  <div style={{ fontSize: '25px', fontWeight: 'bold' }}>Road Tax</div>
                  <div>{props.make} {props.model} ({props.number_plate})</div>
                </DialogTitle>
                <Divider style={{width:'100%'}} />
                <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CustomDatePicker label="Road Tax Start Date" />
                  <CustomDatePicker label="Road Tax End Date" />
                  <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Renew'} color={'#fff'}></CustomButton>
                </DialogContent>
              </div>
            case 'RENTAL':
              return <div>
                <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', alignItems: 'center', flexDirection: 'column', minWidth: '300px' }} >
                  <div style={{ fontSize: '25px', fontWeight: 'bold' }}>Car Return</div>
                  <div>{props.make} {props.model} ({props.number_plate})</div>
                </DialogTitle>
                <Divider style={{width:'100%'}} />
                <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CustomDatePicker label="Car returned on" />
                  <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Return'} color={'#fff'}></CustomButton>
                </DialogContent>
              </div>
            default:
              return null
          }
        })()}
      </Dialog>
    </div>
  );
}

export default RemindersCard;
