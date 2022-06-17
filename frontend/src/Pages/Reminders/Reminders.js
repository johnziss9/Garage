import React from 'react';
import './Reminders.css';
import '../../styles.css';
import RemindersCard from '../../Components/RemindersCard/RemindersCard'; 

function Reminders() {
  return (
    <>
      <div className='top'>
        <div className='top-content'>
          <text className='title'>Reminders</text>
        </div>
      </div>
      <div className='bottom'>
        <div className='reminders-content'>
          <RemindersCard />
          <RemindersCard />
          <RemindersCard />
          <RemindersCard />
        </div>
      </div>
    </>
  );
}

export default Reminders;
