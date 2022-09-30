import React, { useEffect } from 'react';
import './RentalsCard.css';
import moment from 'moment';
import _ from 'lodash';
import { Box } from '@mui/system';
import { Divider, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link } from '@mui/material';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';
import CustomTextField from '../CustomTextField/CustomTextField';
import CustomButton from '../CustomButton/CustomButton';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Alert, Snackbar } from '@mui/material';

function RemindersCard(props) {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');

    const [open, setOpen] = React.useState(false);
    const [openSecondDialog, setOpenSecondDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [disableMOT, setDisableMOT] = React.useState(true);
    const [disableRT, setDisableRT] = React.useState(true);
    const [disableCustomer, setDisableCustomer] = React.useState(true);
    const [disableDates, setDisableDates] = React.useState(true);
    const [rentedStatus, setRentedStatus] = React.useState(false);
    const [allRentals, setAllRentals] = React.useState([]);
    const [expiredRentals, setExpiredRentals] = React.useState([]);
    const [futureRentals, setFutureRentals] = React.useState([]);
    const [currentRental, setCurrentRental] = React.useState({});
    const [fullHistory, setFullHistory] = React.useState(false);
    const [rentalId, setRentalId] = React.useState({});
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [MOTStartDate, setMOTStartDate] = React.useState(props.car.mot.start_date);
    const [MOTEndDate, setMOTEndDate] = React.useState(props.car.mot.end_date);
    const [RTStartDate, setRTStartDate] = React.useState(props.car.road_tax.start_date);
    const [RTEndDate, setRTEndDate] = React.useState(props.car.road_tax.end_date);
    const [rentalStartDate, setRentalStartDate] = React.useState(new Date());
    const [rentalEndDate, setRentalEndDate] = React.useState(new Date());
    const [carDeleted, setCarDeleted] = React.useState(false);

    const handleRentals = () => {
        let rentals = [];
        let expRentals = [];
        let futRentals = [];
        let curRental = {};

        props.car.rentals.forEach(rental => {
            if (moment(rental.dates.end_date).format('YYYY-MM-DD') < currentDate)
                expRentals.push(rental);
            else if (moment(rental.dates.start_date).format('YYYY-MM-DD') > currentDate)
                futRentals.push(rental);
            else
                curRental = rental;

            rentals.push(rental);
        });

        setAllRentals(rentals);
        setExpiredRentals(expRentals);
        setFutureRentals(futRentals);
        setCurrentRental(curRental);
    }

    /* This function opens up the Rental Car component and will stay here once everything else goes */
    const handleShowSelectedCar = (car) => {
        props.clickShowCar();
        props.selectedCar(car)
    }

    const handleOpen = () => {
        setOpen(true);
        handleRentals();
        handleStatusText();
    }
    const handleClose = (reason) => setOpen(false);

    const handleOpenSecondDialog = () => setOpenSecondDialog(true)
    const handleCloseSecondDialog = () => setOpenSecondDialog(false);

    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true)
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleMOTEdit = () => setDisableMOT(false);
    const handleMOTCancel = () => setDisableMOT(true);
    const handleMOTSave = () => {
        fetch('http://localhost:5000/api/cars/updateMOT', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                car_id: props.car._id,
                mot: {
                    start_date: MOTStartDate,
                    end_date: MOTEndDate
                }
            })
        })
        .then((Response) => Response.json())
        .then(handleClose(), window.location.reload())

        setDisableMOT(true);
    }

    const handleRTEdit = () => setDisableRT(false);
    const handleRTCancel = () => setDisableRT(true);
    const handleRTSave = () => {
        fetch('http://localhost:5000/api/cars/updateRT', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                car_id: props.car._id,
                road_tax: {
                    start_date: RTStartDate,
                    end_date: RTEndDate
                }
            })
        })
        .then((Response) => Response.json())
        .then(handleClose(), window.location.reload())

        setDisableRT(true);
    }

    const handleCustomerEdit = () => setDisableCustomer(false);
    const handleCustomerCancel = () => setDisableCustomer(true);
    const handleCustomerSave = () => {
        fetch('http://localhost:5000/api/rentals/update', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                rental_id: rentalId,
                first_name: firstName,
                last_name: lastName,
                phone_number: phone,
                address: address
            })
        })
        .then((Response) => Response.json())
        
        setDisableCustomer(true);
    }

    const handleDatesEdit = () => setDisableDates(false);
    const handleDatesCancel = () => setDisableDates(true);
    const handleDatesSave = () => {
        fetch('http://localhost:5000/api/rentals/updateDates', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                rental_id: rentalId,
                dates: {
                    start_date: rentalStartDate,
                    end_date: rentalEndDate
                }
            })
        })
        .then((Response) => Response.json())

        setDisableDates(true);
    }

    const handleShowFullHistory = () => setFullHistory(true);
    const handleHideFullHistory = () => setFullHistory(false);

    // This is called every time the rentalId is updated using setRentalId.
    useEffect(() => {}, [rentalId]);

    const wrappedFunction = (rental) => {
        setRentalId(rental);

        setFirstName(rental.first_name);
        setLastName(rental.last_name);
        setPhone(rental.phone_number);
        setAddress(rental.address);
        setRentalStartDate(rental.dates.start_date);
        setRentalEndDate(rental.dates.end_date);

        handleOpenSecondDialog();
    }

    const handleStatusText = () => {
        props.car.rentals.forEach(rental => {
            if (moment(rental.dates.start_date).format('YYYY-MM-DD') <= currentDate && moment(rental.dates.end_date).format('YYYY-MM-DD') >= currentDate)
                setRentedStatus(true);
        });
    }

    const handleDeleteCar = () => {
        fetch('http://localhost:5000/api/cars/delete', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                car_id: props.car._id,
                deleted: true
            })
        })
        .then((Response) => Response.json())

        handleCloseDeleteDialog();
        handleClose();

        setCarDeleted(true);

        setTimeout(function(){
            window.location.reload();
         }, 2000);
    }

    const handleShowCarDeletedSB = () => setCarDeleted(true);
    const handleHideCarDeletedSB = () => setCarDeleted(false);

    return (
        <>
            {carDeleted ? 
            <Snackbar
                autoHideDuration={4000}
                open={handleShowCarDeletedSB}
                onClose={handleHideCarDeletedSB}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity='success' onClose={handleHideCarDeletedSB}>Car successfully deleted.</Alert>
            </Snackbar>
            : null}
            <div className='rentals-card-wrapper'>
            <div className='rentals-cars-status' style={props.car.rented ? { backgroundColor: "grey" } : { backgroundColor: "#00cc99" }}>{props.car.rented ? "Rented" : "Available"}</div>
            <div className='card-number-plate'>{props.car.number_plate}</div> 
            <div className='card-make'>{props.car.make}</div>
            <div className='card-model'>{props.car.model}</div>
            <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Details'} color={'#fff'} onClick={handleShowSelectedCar}></CustomButton>
            <Dialog disableEscapeKeyDown={true} onBackdropClick={true} open={open} onClose={handleClose} fullWidth={true}>
                <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <div style={{ marginLeft: 'auto', marginRight: '-59px' /*  Used to center the title */ }}>{props.car.make} {props.car.model} ({props.car.number_plate})</div>
                    <IconButton style={{ marginLeft: 'auto' }} onClick={handleOpenDeleteDialog}>
                        <DeleteForeverIcon fontSize="large" style={{ color: '#fff' }} />
                    </IconButton>                
                </DialogTitle>
                <Divider style={{width:'100%'}} />
                <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className='card-section-header'>
                        M.O.T.
                        <span className='card-icons'>
                            <IconButton onClick={handleMOTEdit} style={{display: disableMOT ? 'flex' : 'none'}}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleMOTCancel} style={{display: !disableMOT ? 'flex' : 'none'}}>
                                <DisabledByDefaultIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleMOTSave} style={{display: !disableMOT ? 'flex' : 'none'}}>
                                <SaveIcon fontSize="small" />
                            </IconButton>                            
                        </span>
                    </div>
                    <form className='card-form'>
                        <CustomDatePicker label="M.O.T. Start Date" value={MOTStartDate} allRentals={null} onChange={setMOTStartDate} disabled={disableMOT} margin={'dense'} />
                        <CustomDatePicker label="M.O.T. End Date" value={MOTEndDate} allRentals={null} onChange={setMOTEndDate} disabled={disableMOT} disablePast={true} margin={'dense'} />
                    </form>
                    <div className='card-section-header'>
                        Road Tax
                        <span className='card-icons'>
                            <IconButton onClick={handleRTEdit} style={{display: disableRT ? 'flex' : 'none'}}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleRTCancel} style={{display: !disableRT ? 'flex' : 'none'}}>
                                <DisabledByDefaultIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleRTSave} style={{display: !disableRT ? 'flex' : 'none'}}>
                                <SaveIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </div>
                    <form className='card-form'>
                        <CustomDatePicker label="Road Tax Start Date" value={RTStartDate} onChange={setRTStartDate} allRentals={null} disabled={disableRT} margin={'dense'} />
                        <CustomDatePicker label="Road Tax End Date" value={RTEndDate} onChange={setRTEndDate} allRentals={null} disabled={disableRT} disablePast={true} margin={'dense'} />
                    </form>
                    <div className='rentals-card-rental-status-text' style={{ backgroundColor: rentedStatus ? '#E57D97' : '#00cc99' }}>
                        {rentedStatus ? 'The car is rented out.' : 'The car is available.'}
                    </div>
                    {allRentals.length === 0 ?
                    <div className='rentals-card-no-rentals'>No rentals for this car.</div> :
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Box className="rentals-card-rentals-list">
                            <nav>
                                {fullHistory ?
                                <List>
                                    {_.orderBy(allRentals, ['dates.start_date'], ['asc']).map((rental) => (
                                    <ListItem disablePadding style={{ padding: '0 5px', backgroundColor: moment(rental.dates.start_date).format('YYYY-MM-DD') <= currentDate && moment(rental.dates.end_date).format('YYYY-MM-DD') >= currentDate ? '#00cc99' : '#fff' }} onClick={() => wrappedFunction(rental)}>
                                        <ListItemButton>
                                                <ListItemIcon>
                                                    <ArrowCircleRightIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`${moment(rental.dates.start_date).format('DD/MM/YYYY')} - ${moment(rental.dates.end_date).format('DD/MM/YYYY')}`} />
                                        </ListItemButton>
                                    </ListItem>
                                    ))}
                                </List>
                                :
                                <List>
                                    {_.orderBy(expiredRentals.length > 3 ? expiredRentals.slice(0, 3) : expiredRentals, ['dates.start_date'], ['asc']).map((rental) => (
                                    <ListItem disablePadding style={{ padding: '0 5px' }} onClick={() => wrappedFunction(rental)}>
                                        <ListItemButton>
                                                <ListItemIcon>
                                                    <ArrowCircleRightIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`${moment(rental.dates.start_date).format('DD/MM/YYYY')} - ${moment(rental.dates.end_date).format('DD/MM/YYYY')}`} />
                                        </ListItemButton>
                                    </ListItem>
                                    ))}
                                    {Object.keys(currentRental).length !== 0 ?
                                        <ListItem disablePadding style={{ padding: '0 5px', backgroundColor: '#00cc99' }} onClick={() => wrappedFunction(currentRental)}>
                                        <ListItemButton>
                                                <ListItemIcon>
                                                    <ArrowCircleRightIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`${moment(currentRental.dates.start_date).format('DD/MM/YYYY')} - ${moment(currentRental.dates.end_date).format('DD/MM/YYYY')}`} />
                                        </ListItemButton>
                                    </ListItem>
                                    :
                                    null}
                                    {_.orderBy(futureRentals.length > 3 ? futureRentals.slice(0, 3) : futureRentals, ['dates.start_date'], ['asc']).map((rental) => (
                                    <ListItem disablePadding style={{ padding: '0 5px' }} onClick={() => wrappedFunction(rental)}>
                                        <ListItemButton>
                                                <ListItemIcon>
                                                    <ArrowCircleRightIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`${moment(rental.dates.start_date).format('DD/MM/YYYY')} - ${moment(rental.dates.end_date).format('DD/MM/YYYY')}`} />
                                        </ListItemButton>
                                    </ListItem>
                                    ))}
                                </List>}
                            </nav>
                        </Box>
                        {allRentals.length > 7 ?
                        <div style={{ marginTop: '15px' }}>
                            {fullHistory ?
                                <Link className='card-view-history' onClick={handleHideFullHistory}>View Less</Link>
                                :
                                <Link className='card-view-history' onClick={handleShowFullHistory}>View Full History</Link>                        
                            }
                        </div> :
                        null}
                    </div>}
                    <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Done'} color={'#fff'} onClick={handleClose} disabled={!disableMOT || !disableRT ? true : false} marginTop={20}></CustomButton>
                    <Dialog disableEscapeKeyDown={true} onBackdropClick={true} open={openSecondDialog} onClose={handleCloseSecondDialog} fullWidth={true}>
                        <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center' }} >
                            <div>{props.car.make} {props.car.model} ({props.car.number_plate})</div>
                        </DialogTitle>
                        <Divider style={{width:'100%'}} />
                        <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className='card-section-header'>
                                Customer Details
                                <span className='card-icons'>
                                    <IconButton onClick={handleCustomerEdit} style={{display: disableCustomer ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleCustomerCancel} style={{display: !disableCustomer ? 'flex' : 'none'}}>
                                        <DisabledByDefaultIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleCustomerSave} style={{display: !disableCustomer ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </div>
                            <form className='card-form'>
                                <CustomTextField label={"First Name"} size={"small"} onChange={e => setFirstName(e.target.value)} value={firstName} disabled={disableCustomer} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Last Name"} size={"small"} onChange={e => setLastName(e.target.value)} value={lastName} disabled={disableCustomer} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Phone"} size={"small"} onChange={e => setPhone(e.target.value)} value={phone} disabled={disableCustomer} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Address"} size={"small"} onChange={e => setAddress(e.target.value)} value={address} disabled={disableCustomer} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                            </form>
                            <div className='card-section-header'>
                                Dates
                                <span className='card-icons'>
                                    <IconButton onClick={handleDatesEdit} style={{display: disableDates ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleDatesCancel} style={{display: !disableDates ? 'flex' : 'none'}}>
                                        <DisabledByDefaultIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleDatesSave} style={{display: !disableDates ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </div>
                            <form className='card-form'>
                                <CustomDatePicker label="Start Date" value={rentalStartDate} onChange={setRentalStartDate} allRentals={null} disabled={disableDates} margin={'dense'} />
                                <CustomDatePicker label="End Date" value={rentalEndDate} onChange={setRentalEndDate} allRentals={null} disabled={disableDates} margin={'dense'} />
                            </form>
                            <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Done'} color={'#fff'} onClick={handleCloseSecondDialog} disabled={!disableCustomer || !disableDates ? true : false}  marginTop={20}></CustomButton>
                        </DialogContent>
                    </Dialog>
                    <Dialog disableEscapeKeyDown={true} onBackdropClick={true} open={openDeleteDialog} onClose={handleCloseDeleteDialog} fullWidth={true}>
                        <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center', minWidth: '300px' }} >
                            <div>{props.car.make} {props.car.model} ({props.car.number_plate})</div>
                        </DialogTitle>
                        <Divider style={{width:'100%'}} />
                        <DialogContent>
                            <div className='card-confirmation-message'>Are you sure you want to delete this car?</div>
                            <div className='card-confirmation-buttons'>
                                <Box m={1}>
                                    <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={'NO'} color={'#fff'} onClick={handleCloseDeleteDialog} />
                                </Box>
                                <Box m={1}>
                                    <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={'YES'} color={'#fff'} onClick={handleDeleteCar} />
                                </Box>
                            </div>
                        </DialogContent>
                    </Dialog>
                </DialogContent>
            </Dialog>
        </div>
        </>
    );
}

export default RemindersCard;
