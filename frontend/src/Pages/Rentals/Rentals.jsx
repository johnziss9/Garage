import React, { useState, useEffect } from 'react';
import './Rentals.css';
import CustomNavbar from '../../Components/CustomNavbar/CustomNavbar';
import RentalsCard from '../../Components/RentalsCard/RentalsCard';

function Rentals() {
  const [allRentals, setAllRentals] = useState([]); 

    useEffect(() => {
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
            setAllRentals(data.cars);
        });
    }, []);

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
          {Array.isArray(allRentals) ? allRentals.map((car) => (
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
