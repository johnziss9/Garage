import React from 'react';
import './RemindersCard.css';
import Divider from '@mui/material/Divider';
import CustomButton from '../CustomButton/CustomButton';
import CardImg from '../../Images/card-img.png';

function RemindersCard(props) {
  return (
    <div className='reminders-card-wrapper'>
      <div className='reminders-number-plate'>KLM 123</div>
      <div className='reminders-make'>HONDA</div>
      <div className='reminders-model'>Civic</div>
      <Divider style={{width:'90%'}} />
      <div className='reminders-expiring-text'>M.O.T. expires on</div>
      <div className='reminders-expiring-date'>22/06/2022</div>
      <div className='reminders-button'>
        <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={'Renewed'} />
      </div>
    </div>
  );
}

export default RemindersCard;
