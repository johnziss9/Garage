import React, { useState, useEffect } from 'react';
import './Reminders.css';
import '../../styles.css';
import moment from 'moment';
import RemindersCard from '../../Components/RemindersCard/RemindersCard';
import CustomNavbar from '../../Components/CustomNavbar/CustomNavbar';

function Reminders() {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const currentDateToChange = new Date(); // Using this as a provisional variable as the line below changes its value.
    const currentDateTwoWeeks = moment(new Date(currentDateToChange.setDate(currentDateToChange.getDate() + 14))).format('YYYY-MM-DD');

    const [expiringMOTs, setExpiringMOTs] = useState([]);
    const [expiringRTs, setExpiringRTs] = useState([]);
    const [expiringRentals, setExpiringRentals] = useState([]);
    // const [allRentals, setAllRentals] = useState([]);

    useEffect(() => {
        handleFetchedCars();
    }, []);

    const handleFetchedCars = () => {
        fetch('http://localhost:5000/api/cars/getRentals', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            }
        })
            .then((Response) => Response.json())
            .then(data => {
                const expiringMOTcars = [];
                const expiringRTcars = [];
                const expiringRentalsCars = [];
                // const allRentalCars = []; // Need to see if we are going to use that to show the rentals in the new custom datepicker

                data.cars.forEach(car => {
                    // allRentalCars.push(car);

                    if (car.mot.end_date >= currentDate && car.mot.end_date <= currentDateTwoWeeks)
                        expiringMOTcars.push(car);

                    if (car.road_tax.end_date >= currentDate && car.road_tax.end_date <= currentDateTwoWeeks)
                        expiringRTcars.push(car);

                    if (car.rented) {
                        car.rentals.forEach(rental => {
                            if (rental.dates.end_date >= currentDate && rental.dates.end_date <= currentDateTwoWeeks) {
                                expiringRentalsCars.push(
                                    {
                                        "_id": car._id,
                                        "make": car.make,
                                        "model": car.model,
                                        "number_plate": car.number_plate,
                                        "rentals": {
                                            "car_id": car._id,
                                            "_id": rental._id,
                                            "first_name": rental.first_name,
                                            "last_name": rental.last_name,
                                            "dates": {
                                                "start_date": rental.dates.start_date,
                                                "end_date": rental.dates.end_date,
                                            }
                                        }
                                    }
                                )
                            }
                        });
                    }


                });

                setExpiringMOTs(expiringMOTcars);
                setExpiringRTs(expiringRTcars);
                setExpiringRentals(expiringRentalsCars);

                // // Get all rentals to pass over to the CustomDatePicker
                // const getAllRentals = () => setAllRentalsList(allRentalData);
                // getAllRentals();
            });
    }

    const handleDialogClosing = () => handleFetchedCars();

    return (
        <>
            <div className='top'>
                <div className='top-content'>
                    <div className='title'>Reminders</div>
                    <CustomNavbar />
                </div>
            </div>
            <div className='bottom'>
                <div className='reminders-content'>
                    {expiringMOTs.map((car) => (
                        <RemindersCard
                            key={car._id}
                            type="M.O.T."
                            number_plate={car.number_plate}
                            make={car.make}
                            model={car.model}
                            expiry_text_or_name={"Expiring on"}
                            expiry_date={moment(car.mot.end_date).format('DD/MM/YYYY')}
                            button_value={"RENEW"}
                            car_id={car._id}
                            clickHideDialog={handleDialogClosing}
                        />
                    ))}
                    {expiringRTs.map((car) => (
                        <RemindersCard
                            key={car._id}
                            type="ROAD TAX"
                            number_plate={car.number_plate}
                            make={car.make}
                            model={car.model}
                            expiry_text_or_name={"Expiring on"}
                            expiry_date={moment(car.road_tax.end_date).format('DD/MM/YYYY')}
                            button_value={"RENEW"}
                            car_id={car._id}
                            clickHideDialog={handleDialogClosing}
                        />
                    ))}
                    {expiringRentals.map((car) => (
                        <RemindersCard
                            key={car._id}
                            type="RENTAL"
                            number_plate={car.number_plate}
                            make={car.make}
                            model={car.model}
                            expiry_text_or_name={`${car.rentals.first_name} ${car.rentals.last_name}`}
                            rental_start_date={moment(car.rentals.dates.start_date).format('DD/MM/YYYY')}
                            until_text={"until"}
                            rental_end_date={moment(car.rentals.dates.end_date).format('DD/MM/YYYY')}
                            button_value={"RETURN"}
                            rental_id={car.rentals._id}
                            // expiringRentals={expiringRentalsList}
                            // allRentals={allRentalsList}
                            clickHideDialog={handleDialogClosing}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Reminders;
