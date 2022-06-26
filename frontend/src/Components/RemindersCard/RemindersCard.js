import React from 'react';
import './RemindersCard.css';
import moment from 'moment';
import { Divider, Dialog, DialogTitle, DialogContent } from '@mui/material';
import CustomButton from '../CustomButton/CustomButton';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';

function RemindersCard(props) {

  const [open, setOpen] = React.useState(false);
  const [newMOTStartDate, setNewMOTStartDate] = React.useState(new Date());
  const [newMOTEndDate, setNewMOTEndDate] = React.useState(new Date());

  const [newRTStartDate, setNewRTStartDate] = React.useState(new Date());
  const [newRTEndDate, setNewRTEndDate] = React.useState(new Date());

  const [carReturnDate, setCarReturnDate] = React.useState(new Date());

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const currentDate = moment(new Date(), "DD.MM.YYYY");
  const expiryDate = moment(props.expiry_date, "DD.MM.YYYY");

  const handleRenewMOT = () => {
    fetch('http://localhost:5000/api/cars/updateMOT', {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            car_id: props.car_id,
            mot: {
              start_date: newMOTStartDate,
              end_date: newMOTEndDate
            }
        })
    })
    .then((Response) => Response.json())
    .then(handleClose(), window.location.reload())
  }

  const handleRenewRT = () => {
    fetch('http://localhost:5000/api/cars/updateRT', {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            car_id: props.car_id,
            road_tax: {
              start_date: newRTStartDate,
              end_date: newRTEndDate
            }
        })
    })
    .then((Response) => Response.json())
    .then(handleClose(), window.location.reload())
  }

  const handleCarReturn = () => {
    fetch('http://localhost:5000/api/rentals/updateDates', {
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            rental_id: props.rental_Id,
            dates: {
              start_date: props.start_date,
              end_date: carReturnDate
            }
        })
    })
    .then((Response) => Response.json())
    .then(handleClose(), window.location.reload())
  }

  return (
    <div className='reminders-card-wrapper'>
      <div className='reminders-card-type'>{props.type}</div>
      <div className='reminders-number-plate'>{props.number_plate}</div>
      <div className='reminders-make'>{props.make}</div>
      <div className='reminders-model'>{props.model}</div>
      <Divider style={{width:'90%'}} />
      <div className='reminders-expiring-text-or-name' style={props.type === 'RENTAL' ? {marginBottom: 10} : {marginBottom: 15}}>{props.expiry_text_or_name}</div>
      <div className='reminders-date'>{props.expiry_date}</div> {/* MOT and RT */}
      <div className='reminders-date'>{props.rental_start_date}</div> {/* Rental */}
      <div className='reminders-until-text'>{props.until_text}</div> {/* Rental */}
      <div className='reminders-date'>{props.rental_end_date}</div> {/* Rental */}
      {props.type !== 'RENTAL' ? <div className='reminders-days-left'>{expiryDate.diff(currentDate, 'days')} days left</div> : null } {/* MOT and RT */}
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
                  <CustomDatePicker label="M.O.T. Start Date" value={newMOTStartDate} onChange={setNewMOTStartDate} />
                  <CustomDatePicker label="M.O.T. End Date" value={newMOTEndDate} onChange={setNewMOTEndDate} />
                  <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Renew'} color={'#fff'} onClick={handleRenewMOT}></CustomButton>
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
                  <CustomDatePicker label="Road Tax Start Date" value={newRTStartDate} onChange={setNewRTStartDate} />
                  <CustomDatePicker label="Road Tax End Date" value={newRTEndDate} onChange={setNewRTEndDate} />
                  <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Renew'} color={'#fff'} onClick={handleRenewRT}></CustomButton>
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
                  <CustomDatePicker label="Car returned on" value={carReturnDate} onChange={setCarReturnDate} />
                  <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Return'} color={'#fff'} onClick={handleCarReturn}></CustomButton>
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