import React from 'react';
import './RemindersCard.css';
import { Divider, Dialog, DialogTitle, DialogContent } from '@mui/material';
import CustomButton from '../CustomButton/CustomButton';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';

function RemindersCard(props) {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={props.button_value} color={'#fff'} onClick={handleOpen} />
      </div>
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { textAlign:'center' } }}>
        {(() => {
          switch (props.type) {
            case 'M.O.T.':
              return <div>
                <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff' }} >{props.type} renewal for {props.make} {props.model} - {props.number_plate}</DialogTitle>
                <Divider variant="middle" style={{width:'90%'}} />
                <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CustomDatePicker label="M.O.T. Start Date" />
                  <CustomDatePicker label="M.O.T. End Date" />
                  <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Renew'} color={'#fff'}></CustomButton>
                </DialogContent>
              </div>
            case 'RENTAL':
              return <div>rental</div>
            default:
              return null
          }
        })()}
      </Dialog>
    </div>
  );
}

export default RemindersCard;
