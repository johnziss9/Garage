import React, { useEffect } from 'react';
import './Repairs.css';
import { ButtonGroup } from '@mui/material';
import CustomNavbar from '../../Components/CustomNavbar/CustomNavbar';
import RepairsCard from '../../Components/RepairsCard/RepairsCard';
import CustomButton from '../../Components/CustomButton/CustomButton';
import RepairCarContent from '../../Components/RepairCarContent/RepairCarContent';

function Repairs() {
  const [radioActiveClicked, setRadioActiveClicked] = React.useState(true);
  const [radioInactiveClicked, setRadioInactiveClicked] = React.useState(false);
  const [radioAllClicked, setRadioAllClicked] = React.useState(false);
  const [allRepairCars, setAllRepairCars] = React.useState([]);
  const [activeRepairCars, setActiveRepairCars] = React.useState([]);
  const [inactiveRepairCars, setInactiveRepairCars] = React.useState([]);
  const [showSelectedCar, setShowSelectedCar] = React.useState(false);
  const [selectedCar, setSelectedCar] = React.useState({});

  useEffect(() => {
    handleFetchedCars();
  }, []);

  const handleFetchedCars = () => {
    fetch('http://localhost:5000/api/cars/getRepairs', {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': sessionStorage.getItem('token')
        }
    })
    .then((Response) => Response.json())
    .then (data => {
      const allRepairCars = [];
      const activeRepairCars = [];
      const inactiveRepairCars = [];

      data.cars.forEach(car => {
        allRepairCars.push(car);

        if (car.has_active_repair)
          activeRepairCars.push(car);
        else
          inactiveRepairCars.push(car);
      });

      setAllRepairCars(allRepairCars);
      setActiveRepairCars(activeRepairCars);
      setInactiveRepairCars(inactiveRepairCars);
    });
  }

  const handleActiveClick = () => {
    setRadioActiveClicked(true);
    setRadioInactiveClicked(false);
    setRadioAllClicked(false);
  }

  const handleInactiveClick = () => {
    setRadioActiveClicked(false);
    setRadioInactiveClicked(true);
    setRadioAllClicked(false);
  }

  const handleAllClick = () => {
    setRadioActiveClicked(false);
    setRadioInactiveClicked(false);
    setRadioAllClicked(true);
  }

  const handleShowSelectedCar = () => setShowSelectedCar(true);
  const handleHideSelectedCar = () => {
    setShowSelectedCar(false);
    handleFetchedCars();
  }

  // When the Repair Card Details button is clicked it brings back the car object and the below function is called and saves the car to the state.
  const handleSelectedCar = (car) => setSelectedCar(car);

  return (
    <>
      <div className='top'>
        <div className='top-content'>
          <div className='title'>Repairs</div>
          <CustomNavbar />
        </div>
      </div>
      <div className='bottom'>
        {showSelectedCar ?
          <RepairCarContent 
            car={selectedCar}
            clickHideCar={handleHideSelectedCar}
          /> :
          <>
            <ButtonGroup sx={{ marginBottom: '10px' }}>
              <CustomButton backgroundColor={radioActiveClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'Active'} color={'#fff'} onClick={handleActiveClick}>One</CustomButton>
              <CustomButton backgroundColor={radioInactiveClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'Inactive'} color={'#fff'} onClick={handleInactiveClick}>Two</CustomButton>
              <CustomButton backgroundColor={radioAllClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'All'} color={'#fff'} onClick={handleAllClick}>Three</CustomButton>
            </ButtonGroup>
            <div className='repairs-content'>
              {radioAllClicked && Array.isArray(allRepairCars) ? allRepairCars.map((car) => (
                <RepairsCard key={car._id} car={car} clickShowCar={handleShowSelectedCar} selectedCar={handleSelectedCar} />
              )) : null}
              {radioActiveClicked && Array.isArray(activeRepairCars) ? activeRepairCars.map((car) => (
                <RepairsCard key={car._id} car={car} clickShowCar={handleShowSelectedCar} selectedCar={handleSelectedCar} />
              )) : null}
              {radioInactiveClicked && Array.isArray(inactiveRepairCars) ? inactiveRepairCars.map((car) => (
                <RepairsCard key={car._id} car={car} clickShowCar={handleShowSelectedCar} selectedCar={handleSelectedCar} />
              )) : null}
            </div>
          </>}
      </div>
    </>
  );
}

export default Repairs;
