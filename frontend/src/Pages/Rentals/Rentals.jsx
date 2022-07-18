import React, { useState, useEffect } from 'react';
import './Rentals.css';
import CustomNavbar from '../../Components/CustomNavbar/CustomNavbar';
import RentalsCard from '../../Components/RentalsCard/RentalsCard';
import AddNewButton from '../../Components/AddNewButton/AddNewButton';
import { Divider, Dialog, DialogTitle, DialogContent } from '@mui/material';
import CustomTextField from '../../Components/CustomTextField/CustomTextField';
import CustomDatePicker from '../../Components/CustomDatePicker/CustomDatePicker';
import CustomButton from '../../Components/CustomButton/CustomButton';
import moment from 'moment';

function Rentals() {
  const [allRentalCars, setAllRentalCars] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [make, setMake] = React.useState('');
  const [model, setModel] = React.useState('');
  const [numberPlate, setNumberPlate] = React.useState('');
  const [MOTStartDate, setMOTStartDate] = React.useState(new Date());
  const [MOTEndDate, setMOTEndDate] = React.useState(new Date());
  const [RTStartDate, setRTStartDate] = React.useState(new Date());
  const [RTEndDate, setRTEndDate] = React.useState(new Date());

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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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

    const handleSaveCar = () => {
      fetch('http://localhost:5000/api/cars/add', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({
            make: make,
            model: model,
            number_plate: numberPlate,
            mot: {
              start_date: MOTStartDate,
              end_date: MOTEndDate
            },
            road_tax: {
              start_date: RTStartDate,
              end_date: MOTEndDate
            },
            deleted: false,
            type: 'rental',
            rented: false
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
      <AddNewButton onClick={handleOpen} />
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', alignItems: 'center', flexDirection: 'column', minWidth: '300px' }} >
          Add New Vehicle
        </DialogTitle>
        <Divider style={{width:'100%'}} />
        <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className='card-section-header' style={{ justifyContent: 'left' }}>Vehicle Details</div>
          <form className='card-form'>
            <CustomTextField label={"Make"} size={"small"} onChange={e => setMake(e.target.value)} value={make} labelMargin={-3} fullWidth={true} height={33} margin={'dense'} />
            <CustomTextField label={"Model"} size={"small"} onChange={e => setModel(e.target.value)} value={model} labelMargin={-3} fullWidth={true} height={33} margin={'dense'} />
            <CustomTextField label={"Number Plate"} size={"small"} onChange={e => setNumberPlate(e.target.value)} value={numberPlate} labelMargin={-3} fullWidth={true} height={33} margin={'dense'} />
          </form>
          <div className='card-section-header' style={{ justifyContent: 'left' }}>M.O.T.</div>
          <form className='card-form'>
            <CustomDatePicker label="M.O.T Start Date" value={MOTStartDate} allRentals={null} margin={'dense'} onChange={setMOTStartDate} />
            <CustomDatePicker label="M.O.T End Date" value={MOTEndDate} allRentals={null} margin={'dense'} onChange={setMOTEndDate} />
          </form>
          <div className='card-section-header' style={{ justifyContent: 'left' }}>Road Tax</div>
          <form className='card-form'>
            <CustomDatePicker label="Road Tax Start Date" value={RTStartDate} allRentals={null} margin={'dense'}  onChange={setRTStartDate} />
            <CustomDatePicker label="Road Tax End Date" value={RTEndDate} allRentals={null} margin={'dense'} onChange={setRTEndDate} />
          </form>
          <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Save'} onClick={handleSaveCar} color={'#fff'} marginTop={20}></CustomButton>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Rentals;
