import React, { useState } from 'react';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import {createMuiTheme, Paper, Grid } from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import {makeStyles} from "@material-ui/core/styles";

function CustomDatePicker(props) {

    const [date, setDate] = React.useState(new Date());

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

    const styles = makeStyles(() => ({
        notInThisMonthDayPaper: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "35px",
            height: "35px",
            backgroundColor: "#eeeeee",
            margin: "3px",
            boxShadow: "none",
            borderRadius: 0,
            padding: "1px",
        },
        normalDayPaper: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "35px",
            height: "35px",
            backgroundColor: "#fff",
            margin: "3px",
            boxShadow: "none",
            borderRadius: 0,
            padding: "1px",
            cursor: "pointer",
        },
        selectedDayPaper: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "31px",
            height: "31px",
            backgroundColor: "#00cc99",
            margin: "3px",
            boxShadow: "none",
            borderRadius: "100%",
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: "#00cc99",
            padding: "1px",
            cursor: "pointer",
        },
        todayPaper: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "35px",
            height: "35px",
            backgroundColor: "#fff",
            margin: "3px",
            boxShadow: "none",
            borderRadius: 0,
            padding: "1px",
            cursor: "pointer",
        }
    }));

    const classes = styles(); // import those CSS
    const today = new Date(); // just Date object of today

    function getDayElement(day, selectedDate, isInCurrentMonth, dayComponent) {
        const isSelected = day.getDate() === selectedDate.getDate();
        const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth();

        let dateTile;

        if (isInCurrentMonth) {
            dateTile = (
                <Paper className={isSelected ? classes.selectedDayPaper : isToday ? classes.todayPaper : classes.normalDayPaper}>   
                    <Grid item><br/></Grid>
                    <Grid item> {day.getDate()}</Grid>
                </Paper>)
        } else {
            dateTile = (
                <Paper className={classes.notInThisMonthDayPaper}>
                    <Grid item><br/></Grid>
                    <Grid item style={{color: "lightGrey"}}>
                        {day.getDate()}
                    </Grid>
                </Paper>)
        }
        return dateTile
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeProvider theme={materialTheme}>
                <KeyboardDatePicker
                    value={date}
                    onChange={setDate}
                    label={props.label}
                    format="dd/MM/yyyy"
                    variant='dialog'
                    renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => getDayElement(day, selectedDate, isInCurrentMonth, dayComponent)}
                    style={{ width: "55%", marginBottom: "30px" }}
                />
            </ThemeProvider>
        </MuiPickersUtilsProvider>
    );
}

export default CustomDatePicker;
