import React from 'react';
import { TextField } from '@mui/material';

function CustomTextField(props) {
  return (
    <TextField 
        label={props.label} 
        variant="outlined"
        onChange={props.onChange}
        size={props.size}
        type={props.type}
        value={props.value}
        disabled={props.disabled}
        margin={props.margin}
        multiline={props.multiline}
        rows={props.rows}
        inputProps={{ style: {width: props.width, height: props.height }}}
        InputLabelProps={{ style: { marginTop: props.labelMargin }}}
        sx={{ 
            input: { backgroundColor: '#fff' }, 
            // "& .MuiFilledInput-input": {border: '2px solid #00cc99'}, 
            "& label.Mui-focused": { color: '#00cc99' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: props.borderColour,
                borderRadius: 0
              },
              '&:hover fieldset': {
                borderColor: props.borderColour,
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00cc99',
              },
            },
            // "& .MuiFilledInput-underline:after": { borderBottomColor: '#00cc99', borderBottomWidth: '5px' }
        }}
    />
  );
}

export default CustomTextField;
