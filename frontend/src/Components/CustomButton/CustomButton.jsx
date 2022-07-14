import React from 'react';
import { Button } from '@mui/material';

function CustomButton(props) {
  return (
    <Button 
        style={{ backgroundColor: props.backgroundColor, width: props.width, height: props.height, color: props.color, marginTop: props.marginTop }}
        variant="contained"
        onClick={props.onClick}
        disabled={props.disabled}
    >
        {props.value}
    </Button>
  );
}

export default CustomButton;