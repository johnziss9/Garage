import React, { useEffect } from 'react';
import { Breadcrumbs, Typography, IconButton, Divider, Dialog, DialogTitle, DialogContent, Box, Snackbar, Alert } from '@mui/material';
import CustomTextField from '../CustomTextField/CustomTextField';
import CustomDatePicker2 from '../CustomDatePicker2/CustomDatePicker2';
import CustomButton from '../CustomButton/CustomButton';

import WarehouseIcon from '@mui/icons-material/Warehouse';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CarRentalIcon from '@mui/icons-material/CarRental';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function RentalContent(props) {
    const [disableCustomerDetails, setDisableCustomerDetails] = React.useState(true);
    const [disableRentalDates, setDisableRentalDates] = React.useState(true);
    const [fetchedRental, setFetchedRental] = React.useState({});
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [rentalDeleted, setRentalDeleted] = React.useState(false);

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [address, setAddress] = React.useState('');

    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    useEffect(() => {
        handleFetchedRental();
    }, []);

    const handleFetchedRental = () => {
        fetch(`http://localhost:5000/api/rentals/rentalId/${props.rentalId}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            }
        })
            .then((Response) => Response.json())
            .then(data => {
                setFetchedRental(data);

                // Used to update state immediately.
                setFetchedRental((state) => {
                    console.log(state);

                    return state;
                });

                setFirstName(data.first_name)
                setLastName(data.last_name);
                setPhoneNumber(data.phone_number);
                setAddress(data.address);

                setStartDate(data.dates.start_date);
                setEndDate(data.dates.end_date);
            });
    }

    const handleCustomerDetailsEdit = () => setDisableCustomerDetails(false);
    const handleCustomerDetailsCancel = () => setDisableCustomerDetails(true);
    const handleCustomerDetailsSave = () => {
        fetch('http://localhost:5000/api/rentals/update', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                rental_id: fetchedRental._id,
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                address: address
            })
        })
            .then((Response) => Response.json())

        handleFetchedRental();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRental();
        }, 500);

        setDisableCustomerDetails(true);
    }

    const handleRentalDatesEdit = () => setDisableRentalDates(false);
    const handleRentalDatesCancel = () => setDisableRentalDates(true);
    const handleRentalDatesSave = () => {
        fetch('http://localhost:5000/api/rentals/updateDates', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                rental_id: fetchedRental._id,
                dates: {
                    start_date: startDate,
                    end_date: endDate
                }
            })
        })
            .then((Response) => Response.json())

        handleFetchedRental();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRental();
        }, 500);

        setDisableRentalDates(true);
    }

    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true)
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleShowRentalDeletedSB = () => setRentalDeleted(true);
    const handleHideRentalDeletedSB = () => setRentalDeleted(false);

    const handleDeleteRental = () => {
        fetch('http://localhost:5000/api/rentals/delete', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                rental_id: fetchedRental._id,
                deleted: true
            })
        })
            .then((Response) => Response.json());

        setRentalDeleted(true);
        handleCloseDeleteDialog();
    }

    return (
        <>
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: "15px" }}>
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    <WarehouseIcon sx={{ mr: 0.7 }} fontSize="inherit" />
                    All Rentals
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    <DirectionsCarIcon sx={{ mr: 0.7 }} fontSize="inherit" />
                    Car
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
                    <CarRentalIcon sx={{ mr: 0.7 }} fontSize="inherit" />
                    Rental
                </Typography>
            </Breadcrumbs>
            <div className='car-details-header'>
                <IconButton onClick={props.clickHideRental} disabled={!disableCustomerDetails || !disableRentalDates ? true : false}>
                    <ArrowBackIosIcon fontSize="large" style={{ color: '#fff' }} />
                </IconButton>
                <div>{`Rental for ${props.car.make} ${props.car.model} (${props.car.number_plate})`}</div>
                <IconButton onClick={handleOpenDeleteDialog}>
                    <DeleteForeverIcon fontSize="large" style={{ color: '#fff' }} />
                </IconButton>
            </div>
            <div className='car-details-content'>
                <div className='car-details-content-header'>
                    Customer Details
                    <span className='car-details-content-header-icons'>
                        <IconButton onClick={handleCustomerDetailsEdit} style={{ display: disableCustomerDetails ? 'flex' : 'none' }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={handleCustomerDetailsCancel} style={{ display: !disableCustomerDetails ? 'flex' : 'none' }}>
                            <DisabledByDefaultIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={handleCustomerDetailsSave} style={{ display: !disableCustomerDetails ? 'flex' : 'none' }}>
                            <SaveIcon fontSize="small" />
                        </IconButton>
                    </span>
                </div>
                <form className='car-details-form'>
                    <CustomTextField label={"First Name"} size={"small"} onChange={e => setFirstName(e.target.value)} value={firstName} disabled={disableCustomerDetails} margin={'dense'} />
                    <CustomTextField label={"Last Name"} size={"small"} onChange={e => setLastName(e.target.value)} value={lastName} disabled={disableCustomerDetails} margin={'dense'} />
                    <CustomTextField label={"Phone Number"} size={"small"} onChange={e => setPhoneNumber(e.target.value)} value={phoneNumber} disabled={disableCustomerDetails} margin={'dense'} />
                    <CustomTextField label={"Address"} size={"small"} onChange={e => setAddress(e.target.value)} value={address} disabled={disableCustomerDetails} margin={'dense'} />
                </form>
                <Divider style={{ width: '100%' }} />
                <div className='car-details-content-header'>
                    Rental Dates
                    <span className='car-details-content-header-icons'>
                        <IconButton onClick={handleRentalDatesEdit} style={{ display: disableRentalDates ? 'flex' : 'none' }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={handleRentalDatesCancel} style={{ display: !disableRentalDates ? 'flex' : 'none' }}>
                            <DisabledByDefaultIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={handleRentalDatesSave} style={{ display: !disableRentalDates ? 'flex' : 'none' }}>
                            <SaveIcon fontSize="small" />
                        </IconButton>
                    </span>
                </div>
                <form className='car-details-form'>
                    <CustomDatePicker2 label="Start Date" value={startDate} disabled={disableRentalDates} onChange={setStartDate} margin={'10px 0'} />
                    <CustomDatePicker2 label="End Date" value={endDate} disabled={disableRentalDates} onChange={setEndDate} margin={'10px 0'} />
                </form>
            </div>
            <Dialog disableEscapeKeyDown={true} open={openDeleteDialog} onClose={(event, reason) => { if (reason !== 'backdropClick') { handleCloseDeleteDialog(event, reason) } }} fullWidth={true}>
                <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center', minWidth: '300px' }} >
                    <div>{`Rental for ${props.car.make} ${props.car.model} (${props.car.number_plate})`}</div>
                </DialogTitle>
                <Divider style={{ width: '100%' }} />
                <DialogContent>
                    <div className='card-confirmation-message'>Are you sure you want to delete this rental?</div>
                    <div className='card-confirmation-buttons'>
                        <Box m={1}>
                            <CustomButton backgroundColor={'grey'} width={'140px'} height={'40px'} value={'NO'} color={'#fff'} onClick={handleCloseDeleteDialog} />
                        </Box>
                        <Box m={1}>
                            <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={'YES'} color={'#fff'} onClick={handleDeleteRental} />
                        </Box>
                    </div>
                </DialogContent>
            </Dialog>
            {rentalDeleted ?
                <Snackbar
                    autoHideDuration={4000}
                    open={handleShowRentalDeletedSB}
                    onClose={handleHideRentalDeletedSB}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity='success' onClose={handleHideRentalDeletedSB}>Rental Successfully Deleted.</Alert>
                </Snackbar> : null
            }
        </>
    );
}

export default RentalContent;
