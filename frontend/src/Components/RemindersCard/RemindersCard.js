import React from 'react';
import './RemindersCard.css';
import Divider from '@mui/material/Divider';
import CustomButton from '../CustomButton/CustomButton';

function RemindersCard(props) {
  return (
    <div className='reminders-card-wrapper'>
      <div className='reminders-card-type'>{props.type}</div>
      <div className='reminders-number-plate'>{props.number_plate}</div>
      <div className='reminders-make'>{props.make}</div>
      <div className='reminders-model'>{props.model}</div>
      <Divider style={{width:'90%'}} />
      <div className='reminders-expiring-text'>{props.expiry_date_type}</div>
      <div className='reminders-expiring-date'>{props.expiry_date}</div>
      <div className='reminders-button'>
        <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={props.button_value} />
      </div>
    </div>
  );
}

export default RemindersCard;
