import React from 'react';
import { Button } from '@mui/material';

function CustomButton(props) {
  return (
    <Button 
        style={{ backgroundColor: props.backgroundColor, width: props.width, height: props.height, margin: props.margin }}
        variant="contained"
        onClick={props.onClick}
    >
        {props.value}
    </Button>
  );
}

export default CustomButton;
