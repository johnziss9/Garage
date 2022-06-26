import React, { useState, useEffect } from 'react';
import './Reminders.css';
import '../../styles.css';
import moment from 'moment';
import RemindersCard from '../../Components/RemindersCard/RemindersCard';
import CustomNavbar from '../../Components/CustomNavbar/CustomNavbar';

function Reminders() {

  const [expiringMOTs, setExpiringMOTs] = useState([]);
  const [expiringRTs, setExpiringRTs] = useState([]);
  const [rentalsList, setRentalsList] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/cars/getExpiringMOTs', {
          method: 'get',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-access-token': sessionStorage.getItem('token')
          }
      })
      .then(res => res.json()),
      fetch('http://localhost:5000/api/cars/getExpiringRTs',  {
          method: 'get',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-access-token': sessionStorage.getItem('token')
          }
      })
      .then(res => res.json()),
      fetch('http://localhost:5000/api/cars/getExpiringRentals',  {
          method: 'get',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-access-token': sessionStorage.getItem('token')
          }
      })
      .then(res => res.json())
    ]).then(([expiringMOTsData, expiringRTsData, expiringRentalsData]) => {
      setExpiringMOTs(expiringMOTsData.cars);
      setExpiringRTs(expiringRTsData.cars);
      
      // This function gets a list of all rental even in the same car
      const getRentals = () => {
        const rentals = [];

        // Creating a car object and adding it to the list so we have only one rental instead of an array. Only passing the information needed.
        expiringRentalsData.cars.forEach(car => {
          for (let r = 0; r < car.rentals.length; r++) {
            rentals.push(
              {
                "_id": car._id,
                "make": car.make,
                "model": car.model,
                "number_plate": car.number_plate,
                "rentals": {
                  "car_id": car.rentals[r].car_id,
                  "_id": car.rentals[r]._id,
                  "first_name": car.rentals[r].first_name,
                  "last_name": car.rentals[r].last_name,
                  "dates": {
                    "start_date": car.rentals[r].dates.start_date,
                    "end_date": car.rentals[r].dates.end_date,
                  }
                }
              }
            );
          }
        });

        setRentalsList(rentals);
      }

      getRentals();
    })
  }, []);

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
              type="M.O.T."
              number_plate={car.number_plate}
              make={car.make}
              model={car.model}
              expiry_text_or_name={"Expiring on"}
              expiry_date={moment(car.mot.end_date).format('DD/MM/YYYY')}
              button_value={"RENEW"}
              car_id={car._id}
            />
          ))}
          {expiringRTs.map((car) => (
            <RemindersCard
              type="ROAD TAX"
              number_plate={car.number_plate}
              make={car.make}
              model={car.model}
              expiry_text_or_name={"Expiring on"}
              expiry_date={moment(car.road_tax.end_date).format('DD/MM/YYYY')}
              button_value={"RENEW"}
              car_id={car._id}
            />
          ))}
          {rentalsList.map((car) => (
            <RemindersCard
              type="RENTAL"
              number_plate={car.number_plate}
              make={car.make}
              model={car.model}
              expiry_text_or_name={`${car.rentals.first_name} ${car.rentals.last_name}`}
              rental_start_date={moment(car.rentals.dates.start_date).format('DD/MM/YYYY')}
              until_text={"until"}
              rental_end_date={moment(car.rentals.dates.end_date).format('DD/MM/YYYY')}
              button_value={"RETURN"}
              rental_Id={car.rentals._id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Reminders;
