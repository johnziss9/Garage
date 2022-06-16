import React from 'react';
import { TextField } from '@mui/material';

function CustomTextField(props) {
  return (
    <TextField 
        label={props.label} 
        variant="filled"
        onChange={props.onChange}
        size={props.size}
        type={props.type}
        value={props.value}
        sx={{ 
            input: { backgroundColor: 'white' }, 
            "& .MuiFilledInput-input": {border: '2px solid #00cc99'}, 
            "& label.Mui-focused": { color: '#00cc99' },
            "& .MuiFilledInput-underline:after": { borderBottomColor: '#00cc99', borderBottomWidth: '5px' },
        }}
    />
  );
}

export default CustomTextField;
