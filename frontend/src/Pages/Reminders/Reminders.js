import React, { useState, useEffect } from 'react';
import './Reminders.css';
import '../../styles.css';
import moment from 'moment';
import RemindersCard from '../../Components/RemindersCard/RemindersCard';

function Reminders() {

  const [expiringMOTs, setExpiringMOTs] = useState([]);
  const [expiringRTs, setExpiringRTs] = useState([]);
  const [expiringRentals, setExpiringRentals] = useState([]);

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
      setExpiringRentals(expiringRentalsData.cars);
      console.log(expiringMOTs);
      console.log(expiringRTs);
      console.log(expiringRentals);
    })
  }, []);

  return (
    <>
      <div className='top'>
        <div className='top-content'>
          <text className='title'>Reminders</text>
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
              expiry_date_type="Expiring on"
              expiry_date={moment(car.mot.end_date).format('DD/MM/YYYY')}
              button_value={"RENEWED"}
            />
          ))}
          {expiringRTs.map((car) => (
            <RemindersCard
              type="ROAD TAX"
              number_plate={car.number_plate}
              make={car.make}
              model={car.model}
              expiry_date_type="Expiring on"
              expiry_date={moment(car.road_tax.end_date).format('DD/MM/YYYY')}
              button_value={"RENEWED"}
            />
          ))}
          {expiringRentals.map((car) => (
            <RemindersCard
              type="RENTAL"
              number_plate={car.number_plate}
              make={car.make}
              model={car.model}
              expiry_date_type="Due date is on"
              expiry_date={moment(car.rentals[0].dates.end_date).format('DD/MM/YYYY')}
              button_value={"RETURNED"}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Reminders;
