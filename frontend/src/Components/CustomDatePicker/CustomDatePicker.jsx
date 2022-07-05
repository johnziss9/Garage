import React, { useState } from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import {createMuiTheme, Paper, Grid } from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import {makeStyles} from "@material-ui/core/styles";
import moment from 'moment';

function CustomDatePicker(props) {

    const rentalDates = (date) => {
        let ranges = [];

        props.allRentals.cars.forEach(car => {
            if (car.number_plate === props.number_plate) {
                const rentals = car.rentals;

                rentals.forEach(rental => {
                    var startDate = moment(rental.dates.start_date).subtract(1, 'days');
                    var endDate = moment(rental.dates.end_date).subtract(1, 'days');

                    while (startDate <= endDate) {
                        ranges.push(moment(startDate).format("YYYY-MM-DD"));
                        startDate = moment(startDate).add(1, 'days');
                    }

                    
                })

            }
        });

        return ranges.includes(date.toISOString().split('T')[0]);
    }

    const materialTheme = createMuiTheme({
        overrides: {
            MuiPickersToolbar: {
                toolbar: {backgroundColor: "#00cc99"}
            },
            MuiPickersCalendarHeader: {
                switchHeader: {
                    backgroundColor: "#fff",
                    color: "#000"
                }
            },
            MuiButton: {
                textPrimary: {
                    color: '#00cc99',
                    backgroundColor: '#fff',
                    border: '1px solid #00cc99',
                    '&:hover': {
                        backgroundColor: '#00cc99',
                        color: '#fff',
                    }
                }
            }
        }
    });

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeProvider theme={materialTheme}>
                <KeyboardDatePicker
                    value={props.value}
                    onChange={props.onChange}
                    label={props.label}
                    format="dd/MM/yyyy"
                    variant='dialog'
                    // renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => getDayElement(day, selectedDate, isInCurrentMonth, dayComponent)}
                    style={{ width: "55%", marginBottom: "30px" }}
                    shouldDisableDate={rentalDates}
                    showTodayButton={true}
                    // initialFocusedDate={range.includes(props.value) ? range[range.length - 1] : props.value}
                />
            </ThemeProvider>
        </MuiPickersUtilsProvider>
    );
}

export default CustomDatePicker;
