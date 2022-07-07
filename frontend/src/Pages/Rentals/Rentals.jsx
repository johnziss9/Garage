import React, { useState, useEffect } from 'react';
import './Rentals.css';
import CustomNavbar from '../../Components/CustomNavbar/CustomNavbar';
import RentalsCard from '../../Components/RentalsCard/RentalsCard';

function Rentals() {
  const [allRentalCars, setAllRentalCars] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/cars/getActiveRentals', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            }
        })
        .then((Response) => Response.json())
        .then (data => {
          const activeCars = [];
          const activeCarsIds = [];

          data.cars.forEach(car => {
            if (car.rentals.length !== 0) {
              activeCars.push(car);
              activeCarsIds.push(car._id);

              if (car.rented === false)
                handleCarRentalStatus(car._id, true);
            }
          });

          handleRentedStatus(activeCarsIds);
        });
    }, []);

    const handleRentedStatus = (activeCarsIds) => {
      fetch('http://localhost:5000/api/cars/getRentals', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            }
        })
        .then((Response) => Response.json())
        .then (data => {
          setAllRentalCars(data.cars)
          data.cars.forEach(car => {
            if (car.rented === true)
              if (!activeCarsIds.includes(car._id)) {
                handleCarRentalStatus(car._id, false);
              }
          });

        });
    }

    const handleCarRentalStatus = (car_id, rentalStatus) => {
      fetch('http://localhost:5000/api/cars/update', {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          car_id: car_id,
          rented: rentalStatus
        })
      })
      .then((Response) => Response.json())
    }

  return (
    <>
      <div className='top'>
        <div className='top-content'>
          <div className='title'>Rentals</div>
          <CustomNavbar />
        </div>
      </div>
      <div className='bottom'>
        <div className='rentals-content'>
          {Array.isArray(allRentalCars) ? allRentalCars.map((car) => (
            <RentalsCard
              car={car}
            />
          )) : null}
        </div>
      </div>
    </>
  );
}

export default Rentals;
