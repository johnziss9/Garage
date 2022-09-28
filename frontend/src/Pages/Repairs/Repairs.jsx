import React, { useEffect } from 'react';
import './Repairs.css';
import { ButtonGroup, Dialog, DialogTitle, DialogContent, Divider, Box, Snackbar, Alert } from '@mui/material';
import CustomNavbar from '../../Components/CustomNavbar/CustomNavbar';
import RepairsCard from '../../Components/RepairsCard/RepairsCard';
import CustomButton from '../../Components/CustomButton/CustomButton';
import RepairCarContent from '../../Components/RepairCarContent/RepairCarContent';
import AddNewButton from '../../Components/AddNewButton/AddNewButton';
import CustomTextField from '../../Components/CustomTextField/CustomTextField';

function Repairs() {
  const [radioActiveClicked, setRadioActiveClicked] = React.useState(true);
  const [radioInactiveClicked, setRadioInactiveClicked] = React.useState(false);
  const [radioAllClicked, setRadioAllClicked] = React.useState(false);
  const [allRepairCars, setAllRepairCars] = React.useState([]);
  const [activeRepairCars, setActiveRepairCars] = React.useState([]);
  const [inactiveRepairCars, setInactiveRepairCars] = React.useState([]);
  const [showSelectedCar, setShowSelectedCar] = React.useState(false);
  const [carAdded, setCarAdded] = React.useState(false);
  const [selectedCar, setSelectedCar] = React.useState({});
  const [openAddNewCarDialog, setOpenAddNewCarDialog] = React.useState(false);
  const [make, setMake] = React.useState('');
  const [model, setModel] = React.useState('');
  const [numberPlate, setNumberPlate] = React.useState('');
  const [frameNumber, setFrameNumber] = React.useState('');
  const [kmMiles, setKmMiles] = React.useState('');

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

  const handleAddNewCar = () => {
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
        frame_number: frameNumber,
        km_miles: kmMiles,
        deleted: false,
        type: 'repair',
        has_active_repair: false,
        mot: {
          start_date: "0001-01-01T00:00:00Z",
          end_date: "0001-01-01T00:00:00Z"
        },
        road_tax: {
          start_date: "0001-01-01T00:00:00Z",
          end_date: "0001-01-01T00:00:00Z"
        }
      })
    })
    .then((Response) => Response.json())

    handleFetchedCars();

    // Using a timeout to fix the async issue on showing the updated results after saving.
    setTimeout(() => {
      handleFetchedCars();
    }, 500);

    setCarAdded(true);
    handleCloseAddNewCarDialog();

    setMake('');
    setModel('');
    setNumberPlate('');
    setFrameNumber('');
    setKmMiles('');
  }

  const handleOpenAddNewCarDialog = () => setOpenAddNewCarDialog(true)
  const handleCloseAddNewCarDialog = () => setOpenAddNewCarDialog(false);

  const handleShowCarAddedSB = () => setCarAdded(true);
  const handleHideCarAddedSB = () => setCarAdded(false);

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
      {!showSelectedCar ? <AddNewButton onClick={handleOpenAddNewCarDialog} /> : null}
      <Dialog disableEscapeKeyDown={true} open={openAddNewCarDialog} onClose={(event, reason) => { if (reason !== 'backdropClick') {handleCloseAddNewCarDialog(event, reason)} }} fullWidth={true}>
        <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center', minWidth: '300px' }} >
          <div>Add New Car for Repair</div>
        </DialogTitle>
        <Divider style={{width:'100%'}} />
        <DialogContent style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <form className='add-new-item-form-dialog'>
            <CustomTextField label='Make' margin={'dense'} onChange={e => setMake(e.target.value)} value={make}/>
            <CustomTextField label='Model' margin={'dense'} onChange={e => setModel(e.target.value)} value={model} />
            <CustomTextField label='Number Plate' margin={'dense'} onChange={e => setNumberPlate(e.target.value)} value={numberPlate} />
            <CustomTextField label='Frame Number' margin={'dense'} onChange={e => setFrameNumber(e.target.value)} value={frameNumber} />
            <CustomTextField label='Km/Miles' margin={'dense'} onChange={e => setKmMiles(e.target.value)} value={kmMiles} />
          </form>
          <div className='card-confirmation-buttons'>
            <Box m={1}>
              <CustomButton backgroundColor={'grey'} width={'140px'} height={'40px'} value={'Cancel'} color={'#fff'} onClick={handleCloseAddNewCarDialog} />
            </Box>
            <Box m={1}>
              <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={'Add'} color={'#fff'} onClick={handleAddNewCar} />
            </Box>
          </div>
        </DialogContent>
      </Dialog>
      {carAdded ?
        <Snackbar
          autoHideDuration={4000}
          open={handleShowCarAddedSB}
          onClose={handleHideCarAddedSB}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity='success' onClose={handleHideCarAddedSB}>Car Successfully Added.</Alert>
        </Snackbar> : null
      }
    </>
  );
}

export default Repairs;
