import React from 'react';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

function CustomDatePicker2(props) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                label={props.label}
                inputFormat="DD/MM/YYYY"
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
                InputProps={{
                    sx: {
                        borderRadius: 0,
                        margin: props.margin
                    }
                }}
                renderInput={(params) => <TextField {...params} />}
                margin={props.margin}
            />
        </LocalizationProvider>
    );
}

export default CustomDatePicker2;
