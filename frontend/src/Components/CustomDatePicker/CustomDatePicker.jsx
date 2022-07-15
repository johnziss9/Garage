import React from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import {makeStyles} from "@material-ui/core/styles";
import moment from 'moment';

function CustomDatePicker(props) {

    const rentalDates = (date) => {
        if (props.allRentals !== null) {
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
        } else {
            return null;
        }
    }

    const materialTheme = createMuiTheme({
        overrides: {
            // Top bar
            MuiPickersToolbar: {
                toolbar: {backgroundColor: "#00cc99"}
            },
            // Month and Year bar
            MuiPickersCalendarHeader: {
                switchHeader: {
                    backgroundColor: "#fff",
                    color: "#000"
                }
            },
            // Dialog buttons
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
            },
            MuiPickersDay: {
                daySelected: {
                    backgroundColor: "#00cc99",
                    '&:hover': {
                        backgroundColor: '#00cc99'
                    }
                }
            }
        },
        // Datepicker color when entered
        palette: {
            primary: {
                main: '#00cc99',
                contrastText: '#fff'
            }
        }
    });

    const useStyles = makeStyles(() => ({
        rented: {
            backgroundColor: '#ef9a9a'
        },
        notInMonth: {
            backgroundColor: '#fff'
        }
    }))

    const classes = useStyles();

    const renderDayInPicker = (date, selectedDate, dayInCurrentMonth, dayComponent) => {

        if (!dayInCurrentMonth) {
            return (<div className={classes.notInMonth}>
                {dayComponent}
            </div>);
        } else {
            if (dayComponent.props.disabled) {
                return (<div className={classes.rented}>
                    {dayComponent}
                </div>);
            } else {
                return (<div>
                    {dayComponent}
                </div>);
            }
        }
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeProvider theme={materialTheme}>
                <KeyboardDatePicker
                    value={props.value}
                    onChange={props.onChange}
                    label={props.label}
                    format="dd/MM/yyyy"
                    variant='dialog'
                    renderDay={renderDayInPicker}
                    margin={props.margin}
                    shouldDisableDate={rentalDates}
                    showTodayButton={true}
                    disabled={props.disabled}
                    disablePast={props.disablePast}
                />
            </ThemeProvider>
        </MuiPickersUtilsProvider>
    );
}

export default CustomDatePicker;
