import React from 'react';
import './AddNewButton.css';
import AddIcon from '@mui/icons-material/Add';

function AddNewButton(props) {
  return (
    <div className='add-new-button-container' onClick={props.onClick}>
      <AddIcon fontSize='large' sx={{ color: '#fff' }} />
    </div>
  );
}

export default AddNewButton;