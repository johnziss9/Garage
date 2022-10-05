import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../Components/CustomNavbar/CustomNavbar';
import RentalsCard from '../../Components/RentalsCard/RentalsCard';
import AddNewButton from '../../Components/AddNewButton/AddNewButton';
import { Divider, Dialog, DialogTitle, DialogContent, Box, ButtonGroup, Snackbar, Alert } from '@mui/material';
import CustomTextField from '../../Components/CustomTextField/CustomTextField';
import CustomDatePicker2 from '../../Components/CustomDatePicker2/CustomDatePicker2';
import CustomButton from '../../Components/CustomButton/CustomButton';
import RentalCarContent from '../../Components/RentalCarContent/RentalCarContent';

function Rentals() {
    const [allRentals, setAllRentals] = useState([]);
    const [activeRentals, setActiveRentals] = useState([]);
    const [inactiveRentals, setInactiveRentals] = useState([]);
    const [radioActiveClicked, setRadioActiveClicked] = React.useState(true);
    const [radioInactiveClicked, setRadioInactiveClicked] = React.useState(false);
    const [radioAllClicked, setRadioAllClicked] = React.useState(false);
    const [make, setMake] = React.useState('');
    const [model, setModel] = React.useState('');
    const [numberPlate, setNumberPlate] = React.useState('');
    const [frameNumber, setFrameNumber] = React.useState('');
    const [kmMiles, setKmMiles] = React.useState('');
    const [MOTStartDate, setMOTStartDate] = React.useState(new Date());
    const [MOTEndDate, setMOTEndDate] = React.useState(new Date());
    const [RTStartDate, setRTStartDate] = React.useState(new Date());
    const [RTEndDate, setRTEndDate] = React.useState(new Date());
    const [showSelectedCar, setShowSelectedCar] = React.useState(false);
    const [selectedCar, setSelectedCar] = React.useState({});
    const [openAddNewCarDialog, setOpenAddNewCarDialog] = React.useState(false);
    const [carAdded, setCarAdded] = React.useState(false);

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
                const allRentalCars = [];
                const activeRentalCars = [];
                const inactiveRentalCars = [];

                data.cars.forEach(car => {
                    allRentalCars.push(car);

                    if (car.rented)
                        activeRentalCars.push(car);
                    else
                        inactiveRentalCars.push(car);
                });

                setAllRentals(allRentalCars);
                setActiveRentals(activeRentalCars);
                setInactiveRentals(inactiveRentalCars);
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

    const handleOpenAddNewCarDialog = () => setOpenAddNewCarDialog(true)
    const handleCloseAddNewCarDialog = () => setOpenAddNewCarDialog(false);

    const handleShowCarAddedSB = () => setCarAdded(true);
    const handleHideCarAddedSB = () => setCarAdded(false);

    const handleShowSelectedCar = () => setShowSelectedCar(true);
    const handleHideSelectedCar = () => {
        setShowSelectedCar(false);
        handleFetchedCars();
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
                type: 'rental',
                rented: false,
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
        setMOTStartDate(new Date());
        setMOTEndDate(new Date());
        setRTStartDate(new Date());
        setRTEndDate(new Date());
    }

    // When the Repair Card Details button is clicked it brings back the car object and the below function is called and saves the car to the state.
    const handleSelectedCar = (car) => setSelectedCar(car);

    return (
        <>
            <div className='top'>
                <div className='top-content'>
                    <div className='title'>Rentals</div>
                    <CustomNavbar />
                </div>
            </div>
            <div className='bottom'>
                {showSelectedCar ?
                    <RentalCarContent
                        car={selectedCar}
                        clickHideCar={handleHideSelectedCar}
                    /> :
                    <>
                        <ButtonGroup sx={{ marginBottom: '10px' }}>
                            <CustomButton backgroundColor={radioActiveClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'Active'} color={'#fff'} onClick={handleActiveClick}>One</CustomButton>
                            <CustomButton backgroundColor={radioInactiveClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'Inactive'} color={'#fff'} onClick={handleInactiveClick}>Two</CustomButton>
                            <CustomButton backgroundColor={radioAllClicked ? '#00cc99' : 'grey'} width={'120px'} height={'40px'} value={'All'} color={'#fff'} onClick={handleAllClick}>Three</CustomButton>
                        </ButtonGroup>
                        <div className='cards-content'>
                            {radioAllClicked && Array.isArray(allRentals) ? allRentals.map((car) => (
                                <RentalsCard key={car._id} car={car} clickShowCar={handleShowSelectedCar} selectedCar={handleSelectedCar} />
                            )) : null}
                            {radioActiveClicked && Array.isArray(activeRentals) ? activeRentals.map((car) => (
                                <RentalsCard key={car._id} car={car} clickShowCar={handleShowSelectedCar} selectedCar={handleSelectedCar} />
                            )) : null}
                            {radioInactiveClicked && Array.isArray(inactiveRentals) ? inactiveRentals.map((car) => (
                                <RentalsCard key={car._id} car={car} clickShowCar={handleShowSelectedCar} selectedCar={handleSelectedCar} />
                            )) : null}
                        </div>
                    </>}
            </div>
            {!showSelectedCar ? <AddNewButton onClick={handleOpenAddNewCarDialog} /> : null}
            <Dialog disableEscapeKeyDown={true} open={openAddNewCarDialog} onClose={(event, reason) => { if (reason !== 'backdropClick') { handleCloseAddNewCarDialog(event, reason) } }} fullWidth={true}>
                <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center', minWidth: '300px' }} >
                    <div>Add New Car for Rental</div>
                </DialogTitle>
                <Divider style={{ width: '100%' }} />
                <DialogContent style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <form className='add-new-item-form-dialog'>
                        <CustomTextField label='Make' margin={'dense'} onChange={e => setMake(e.target.value)} value={make} />
                        <CustomTextField label='Model' margin={'dense'} onChange={e => setModel(e.target.value)} value={model} />
                        <CustomTextField label='Number Plate' margin={'dense'} onChange={e => setNumberPlate(e.target.value)} value={numberPlate} />
                        <CustomTextField label='Frame Number' margin={'dense'} onChange={e => setFrameNumber(e.target.value)} value={frameNumber} />
                        <CustomTextField label='Km/Miles' margin={'dense'} onChange={e => setKmMiles(e.target.value)} value={kmMiles} />
                        <br />
                        <CustomDatePicker2 label="M.O.T Start Date" value={MOTStartDate} margin={'10px 0'} onChange={setMOTStartDate} />
                        <CustomDatePicker2 label="M.O.T End Date" value={MOTEndDate} margin={'10px 0'} onChange={setMOTEndDate} />
                        <br />
                        <CustomDatePicker2 label="Road Tax Start Date" value={RTStartDate} margin={'10px 0'} onChange={setRTStartDate} />
                        <CustomDatePicker2 label="Road Tax End Date" value={RTEndDate} margin={'10px 0'} onChange={setRTEndDate} />
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

export default Rentals;
