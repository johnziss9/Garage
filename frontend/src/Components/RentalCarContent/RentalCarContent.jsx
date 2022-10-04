import React, { useEffect } from 'react';
import { Breadcrumbs, Typography, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import CustomTextField from '../CustomTextField/CustomTextField';
import moment from 'moment';
import _ from 'lodash';

import WarehouseIcon from '@mui/icons-material/Warehouse';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

function RentalCarContent(props) {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');

    const [showSelectedRental, setShowSelectedRental] = React.useState(false);
    const [disableCarDetailsContent, setDisableCarDetailsContent] = React.useState(true);
    const [frameNumber, setFrameNumber] = React.useState(props.car.frame_number);
    const [kmMiles, setKmMiles] = React.useState(props.car.km_miles);
    const [openAddRentalDialog, setOpenAddRentalDialog] = React.useState(false);
    const [currentRental, setCurrentRental] = React.useState({});
    const [fetchedCar, setFetchedCar] = React.useState({});
    const [allRentals, setAllRentals] = React.useState([]);
    const [pastRentals, setPastRentals] = React.useState([]);
    const [futureRentals, setFutureRentals] = React.useState([]);
    const [showAllRentals, setShowAllRentals] = React.useState(false);

    useEffect(() => {
        handleFetchedCar();
    }, []);

    const handleFetchedCar = () => {
        fetch(`http://localhost:5000/api/cars/rentalCarId/${props.car._id}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            }
        })
            .then((Response) => Response.json())
            .then(data => {
                const carData = data;
                const allCarRentals = [];
                const pastCarRentals = [];
                const futureCarRentals = [];

                data.rentals.forEach(rental => {
                    if (rental.deleted === false) {
                        if (moment(rental.dates.end_date).format('YYYY-MM-DD') < currentDate)
                            pastCarRentals.push(rental);
                        else if (moment(rental.dates.start_date).format('YYYY-MM-DD') > currentDate)
                            futureCarRentals.push(rental);
                        else
                            setCurrentRental(rental);

                        allCarRentals.push(rental);
                    }
                });

                setFetchedCar(carData);
                setAllRentals(allCarRentals);
                setPastRentals(pastCarRentals);
                setFutureRentals(futureCarRentals);

                setFrameNumber(carData.frame_number);
                setKmMiles(carData.km_miles);
            });
    }

    const handleShowSelectedRental = () => setShowSelectedRental(true);
    const handleHideSelectedRental = () => {
        setShowSelectedRental(false);
        // handleFetchedCar();
    }

    const handleOpenAddRentalDialog = () => setOpenAddRentalDialog(true)
    const handleCloseAddRntalrDialog = () => setOpenAddRentalDialog(false);

    const handleShowAllRentals = () => setShowAllRentals(true);
    const handleHideAllRentals = () => setShowAllRentals(false);

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
        //         car_id: fetchedCar._id,
        //         frame_number: frameNumber,
        //         km_miles: kmMiles
        //     })
        // })
        //     .then((Response) => Response.json())

        // handleFetchedCar();

        // // Using a timeout to fix the async issue on showing the updated results after saving.
        // setTimeout(() => {
        //     handleFetchedCar();
        // }, 500);

        setDisableCarDetailsContent(true);
    }

    return (
        <>
            {showSelectedRental ?
                <div>RENTAL CONTENT WILL GO HERE</div> :
                <>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: "15px" }}>
                        <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                            <WarehouseIcon sx={{ mr: 0.7 }} fontSize="inherit" />
                            All Repairs
                        </Typography>
                        <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
                            <DirectionsCarIcon sx={{ mr: 0.7 }} fontSize="inherit" />
                            Car
                        </Typography>
                    </Breadcrumbs>
                    <div className='car-details-header'>
                        <IconButton onClick={props.clickHideCar}>
                            <ArrowBackIosIcon fontSize="large" style={{ color: '#fff' }} />
                        </IconButton>
                        <div>{props.car.make} {props.car.model} ({props.car.number_plate})</div>
                        <IconButton onClick={props.clickHideCar}>
                            <DeleteForeverIcon fontSize="large" style={{ color: '#fff' }} />
                        </IconButton>
                    </div>
                    <div className='car-details-content'>
                        <div className='car-details-content-header'>
                            Details
                            <span className='car-details-content-header-icons'>
                                <IconButton onClick={handleCarEdit} style={{ display: disableCarDetailsContent ? 'flex' : 'none' }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={handleCarCancel} style={{ display: !disableCarDetailsContent ? 'flex' : 'none' }}>
                                    <DisabledByDefaultIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={handleCarSave} style={{ display: !disableCarDetailsContent ? 'flex' : 'none' }}>
                                    <SaveIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </div>
                        <form className='car-details-form'>
                            <CustomTextField label={"Frame Number"} size={"small"} onChange={e => setFrameNumber(e.target.value)} value={frameNumber} disabled={disableCarDetailsContent} margin={'dense'} />
                            <CustomTextField label={"Km/Miles"} size={"small"} onChange={e => setKmMiles(e.target.value)} value={kmMiles} disabled={disableCarDetailsContent} margin={'dense'} />
                        </form>
                        <Divider style={{ width: '100%' }} />
                        <div className='car-details-content-header'>
                            Repairs
                            <span className='car-details-content-header-icons'>
                                <IconButton onClick={handleOpenAddRentalDialog}>
                                    <AddCircleIcon style={{ color: '#00cc99' }} fontSize="medium" />
                                </IconButton>
                            </span>
                        </div>
                        <div className='content-listbox'>
                            {props.car.rentals.length === 0 ?
                                <div className='content-listbox-no-items'>No rentals for this car.</div> :
                                <div>
                                    <nav>
                                        {showAllRentals ?
                                            <List>
                                                {_.orderBy(allRentals, ['dates.start_date'], ['asc']).map((rental) => (
                                                    <ListItem key={rental._id} disablePadding style={{ backgroundColor: moment(rental.dates.start_date).format('YYYY-MM-DD') <= currentDate && moment(rental.dates.end_date).format('YYYY-MM-DD') >= currentDate ? '#00cc99' : '#fff' }}> {/* onClick={() => handleRepair(repair)} */}
                                                        <ListItemButton>
                                                            <ListItemIcon>
                                                                <ArrowCircleRightIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={`${moment(rental.dates.start_date).format('DD/MM/YYYY')} - ${moment(rental.dates.end_date).format('DD/MM/YYYY')}`} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List> :
                                            <List>
                                                {_.orderBy(pastRentals, ['dates.start_date'], ['asc']).slice(-2).map((rental) => (
                                                    <ListItem key={rental._id} disablePadding style={{ backgroundColor: '#fff' }}> {/* onClick={() => handleRepair(repair)} */}
                                                        <ListItemButton>
                                                            <ListItemIcon>
                                                                <ArrowCircleRightIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={`${moment(rental.dates.start_date).format('DD/MM/YYYY')} - ${moment(rental.dates.end_date).format('DD/MM/YYYY')}`} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                                {Object.keys(currentRental).length !== 0 ?
                                                    <ListItem disablePadding style={{ backgroundColor: '#00cc99' }}> {/* onClick={() => handleRepair(incompleteRepair)} */}
                                                        <ListItemButton>
                                                            <ListItemIcon>
                                                                <ArrowCircleRightIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={`${moment(currentRental.dates.start_date).format('DD/MM/YYYY')} - ${moment(currentRental.dates.end_date).format('DD/MM/YYYY')}`} />
                                                        </ListItemButton>
                                                    </ListItem> : null
                                                }
                                                {_.orderBy(futureRentals, ['dates.start_date'], ['asc']).slice(-2).map((rental) => (
                                                    <ListItem key={rental._id} disablePadding style={{ backgroundColor: '#fff' }}> {/* onClick={() => handleRepair(repair)} */}
                                                        <ListItemButton>
                                                            <ListItemIcon>
                                                                <ArrowCircleRightIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={`${moment(rental.dates.start_date).format('DD/MM/YYYY')} - ${moment(rental.dates.end_date).format('DD/MM/YYYY')}`} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        }
                                    </nav>
                                </div>
                            }
                        </div>
                        {pastRentals.length > 2 || futureRentals.length > 2 || allRentals.length > 5 ?
                            <div>
                                {showAllRentals ?
                                    <div className='car_details_full_history_button' onClick={handleHideAllRentals}>{'View Less Rentals'}</div> :
                                    <div className='car_details_full_history_button' onClick={handleShowAllRentals}>{'View All Rentals'}</div>
                                }
                            </div> : null
                        }
                    </div>
                </>
            }
        </>
    )
}

export default RentalCarContent;