import React, { useEffect } from 'react';
import './Repairs.css';
import { ButtonGroup, Button } from '@mui/material';
import CustomNavbar from '../../Components/CustomNavbar/CustomNavbar';
import RepairsCard from '../../Components/RepairsCard/RepairsCard';
import CustomButton from '../../Components/CustomButton/CustomButton';

function Repairs() {
  const [radioActiveClicked, setRadioActiveClicked] = React.useState(true);
  const [radioInactiveClicked, setRadioInactiveClicked] = React.useState(false);
  const [radioAllClicked, setRadioAllClicked] = React.useState(false);
  const [allRepairs, setAllRepairs] = React.useState([]);
  const [activeRepairs, setActiveRepairs] = React.useState([]);
  const [inactiveRepairs, setInactiveRepairs] = React.useState([]);

  useEffect(() => {
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
      const allRepairs = [];
      const activeRepairs = [];
      const inactiveRepairs = [];

      data.cars.forEach(car => {
        allRepairs.push(car);

        if (car.has_active_repair)
          activeRepairs.push(car);
        else
          inactiveRepairs.push(car);
      });

      setAllRepairs(allRepairs);
      setActiveRepairs(activeRepairs);
      setInactiveRepairs(inactiveRepairs);
    });
  }, []);

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

  return (
    <>
      <div className='top'>
        <div className='top-content'>
          <div className='title'>Repairs</div>
          <CustomNavbar />
        </div>
      </div>
      <div className='bottom'>
        <ButtonGroup sx={{ marginBottom: '10px' }}>
          <CustomButton backgroundColor={radioActiveClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'Active'} color={'#fff'} onClick={handleActiveClick}>One</CustomButton>
          <CustomButton backgroundColor={radioInactiveClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'Inactive'} color={'#fff'} onClick={handleInactiveClick}>Two</CustomButton>
          <CustomButton backgroundColor={radioAllClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'All'} color={'#fff'} onClick={handleAllClick}>Three</CustomButton>
        </ButtonGroup>
        <div className='repairs-content'>
          {radioAllClicked && Array.isArray(allRepairs) ? allRepairs.map((car) => (
            <RepairsCard car={car} />
          )) : null}
          {radioActiveClicked && Array.isArray(activeRepairs) ? activeRepairs.map((car) => (
            <RepairsCard car={car} />
          )) : null}
          {radioInactiveClicked && Array.isArray(inactiveRepairs) ? inactiveRepairs.map((car) => (
            <RepairsCard car={car} />
          )) : null}
        </div>
      </div>
    </>
  );
}

export default Repairs;
