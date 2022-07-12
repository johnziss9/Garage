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
        disabled={props.disabled}
        margin={props.margin}
        inputProps={{ style: {width: props.width, height: props.height }}}
        InputLabelProps={{ style: { margin: props.labelMargin }}}
        sx={{ 
            input: { backgroundColor: '#fff' }, 
            "& .MuiFilledInput-input": {border: '2px solid #00cc99'}, 
            "& label.Mui-focused": { color: '#00cc99' },
            "& .MuiFilledInput-underline:after": { borderBottomColor: '#00cc99', borderBottomWidth: '5px' }
        }}
    />
  );
}

export default CustomTextField;
