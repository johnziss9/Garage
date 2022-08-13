import React, { useEffect } from 'react';
import './Repairs.css';
import { ButtonGroup, IconButton } from '@mui/material';
import CustomNavbar from '../../Components/CustomNavbar/CustomNavbar';
import RepairsCard from '../../Components/RepairsCard/RepairsCard';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomTextField from '../../Components/CustomTextField/CustomTextField';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function Repairs() {
  const [radioActiveClicked, setRadioActiveClicked] = React.useState(true);
  const [radioInactiveClicked, setRadioInactiveClicked] = React.useState(false);
  const [radioAllClicked, setRadioAllClicked] = React.useState(false);
  const [allRepairCars, setAllRepairCars] = React.useState([]);
  const [activeRepairCars, setActiveRepairCars] = React.useState([]);
  const [inactiveRepairCars, setInactiveRepairCars] = React.useState([]);
  const [showCarDetails, setShowCarDetails] = React.useState(false);
  const [selectedCar, setSelectedCar] = React.useState({});
  const [disableCarDetailsContent, setDisableCarDetailsContent] = React.useState(true);

  const [frameNumber, setFrameNumber] = React.useState(selectedCar.frame_number);
  const [kmMiles, setKmMiles] = React.useState(selectedCar.km_miles);

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

  const handleShowCarDetails = () => setShowCarDetails(true);
  const handleHideCarDetails = () => setShowCarDetails(false);

  const handleSelectedCar = (car) => setSelectedCar(car);

  const handleCarEdit = () => setDisableCarDetailsContent(false);
  const handleCarCancel = () => setDisableCarDetailsContent(true);
  const handleCarSave = () => {
      // fetch('http://localhost:5000/api/cars/updateCarDetails', {
      //     method: 'put',
      //     headers: {
      //         'Accept': 'application/json',
      //         'Content-Type': 'application/json',
      //         'x-access-token': sessionStorage.getItem('token')
      //     },
      //     body: JSON.stringify({
      //         car_id: selectedCar._id,
      //         frame_number: selectedCar.frame_number,
      //         km_miles: selectedCar.km_miles
      //     })
      // })
      // .then((Response) => Response.json())
      // .then(handleClose(), window.location.reload())

      setDisableCarDetailsContent(true);
  }

  return (
    <>
      <div className='top'>
        <div className='top-content'>
          <div className='title'>Repairs</div>
          <CustomNavbar />
        </div>
      </div>
      {showCarDetails ?
      <div className='bottom'>
        <div className='car-details-header'>
          <IconButton onClick={handleHideCarDetails}>
            <ArrowBackIosIcon fontSize="large" style={{ color: '#fff' }} />
          </IconButton>
          <div>{selectedCar.make} {selectedCar.model} ({selectedCar.number_plate})</div>
          <IconButton>
            <DeleteForeverIcon fontSize="large" style={{ color: '#fff' }} />
          </IconButton>
        </div>
        <div className='car-details-content'>
          <div className='car-details-content-header'>
            Car Details
            <span className='car-details-content-header-icons'>
                <IconButton onClick={handleCarEdit} style={{display: disableCarDetailsContent ? 'flex' : 'none'}}>
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleCarCancel} style={{display: !disableCarDetailsContent ? 'flex' : 'none'}}>
                    <DisabledByDefaultIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleCarSave} style={{display: !disableCarDetailsContent ? 'flex' : 'none'}}>
                    <SaveIcon fontSize="small" />
                </IconButton>                            
            </span>
          </div>
          <form className='car-details-form'>
            <CustomTextField label={"Frame Number"} size={"small"} onChange={e => setFrameNumber(e.target.value)} value={frameNumber} disabled={disableCarDetailsContent} margin={'dense'} />
            <CustomTextField label={"Km/Miles"} size={"small"} onChange={e => setKmMiles(e.target.value)} value={kmMiles} disabled={disableCarDetailsContent} margin={'dense'} />
          </form>
          <div className='car-details-listbox'>
            {selectedCar.repairs[0]._id === undefined ?
            <div>No repairs for this car.</div> :
            <div>{selectedCar.repairs.map((car) => (<div>REPAIRS!!!</div>))}
            </div>}
          </div>
        </div>
      </div>
      :
      <div className='bottom'>
        <ButtonGroup sx={{ marginBottom: '10px' }}>
          <CustomButton backgroundColor={radioActiveClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'Active'} color={'#fff'} onClick={handleActiveClick}>One</CustomButton>
          <CustomButton backgroundColor={radioInactiveClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'Inactive'} color={'#fff'} onClick={handleInactiveClick}>Two</CustomButton>
          <CustomButton backgroundColor={radioAllClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'All'} color={'#fff'} onClick={handleAllClick}>Three</CustomButton>
        </ButtonGroup>
        <div className='repairs-content'>
          {radioAllClicked && Array.isArray(allRepairCars) ? allRepairCars.map((car) => (
            <RepairsCard car={car} clickShowCar={handleShowCarDetails} selectedCar={handleSelectedCar} />
          )) : null}
          {radioActiveClicked && Array.isArray(activeRepairCars) ? activeRepairCars.map((car) => (
            <RepairsCard car={car} clickShowCar={handleShowCarDetails} selectedCar={handleSelectedCar} />
          )) : null}
          {radioInactiveClicked && Array.isArray(inactiveRepairCars) ? inactiveRepairCars.map((car) => (
            <RepairsCard car={car} clickShowCar={handleShowCarDetails} selectedCar={handleSelectedCar} />
          )) : null}
        </div>
      </div>}
    </>
  );
}

export default Repairs;
