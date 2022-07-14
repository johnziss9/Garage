import React from 'react';
import './RentalsCard.css';
import moment from 'moment';
import _ from 'lodash';
import CustomButton from '../CustomButton/CustomButton';
import { Box } from '@mui/system';
import { Divider, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link } from '@mui/material';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';
import CustomTextField from '../CustomTextField/CustomTextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

function RemindersCard(props) {
    const currentDate = moment(new Date()).format('YYYY-MM-DD');

    const [open, setOpen] = React.useState(false);
    const [openSecondDialog, setOpenSecondDialog] = React.useState(false);
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
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [rentalDetails, setRentalDetails] = React.useState({});

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

    const handleOpen = () => {
        setOpen(true);
        handleRentals();
        handleStatusText();
    }
    const handleClose = () => setOpen(false);

    const handleOpenSecondDialog = () => setOpenSecondDialog(true)
    const handleCloseSecondDialog = () => setOpenSecondDialog(false);

    const handleMOTEdit = () => setDisableMOT(false);
    const handleMOTSave = () => setDisableMOT(true);

    const handleRTEdit = () => setDisableRT(false);
    const handleRTSave = () => setDisableRT(true);

    const handleCustomerEdit = () => setDisableCustomer(false);
    const handleCustomerSave = () => setDisableCustomer(true);

    const handleDatesEdit = () => setDisableDates(false);
    const handleDatesSave = () => setDisableDates(true);

    const handleShowFullHistory = () => setFullHistory(true);
    const handleHideFullHistory = () => setFullHistory(false);

    const wrappedFunction = (rental) => {
        setRentalDetails(rental);
        setRentalDetails((state) => {
            return state;
        })

        handleOpenSecondDialog();
    }

    const handleStatusText = () => {
        props.car.rentals.forEach(rental => {
            if (moment(rental.dates.start_date).format('YYYY-MM-DD') <= currentDate && moment(rental.dates.end_date).format('YYYY-MM-DD') >= currentDate)
                setRentedStatus(true);
        });
    }

    return (
        <div className='rentals-card-wrapper'>
            <div className='rentals-cars-status' style={props.car.rented ? { backgroundColor: "grey" } : { backgroundColor: "#00cc99" }}>{props.car.rented ? "Rented" : "Available"}</div>
            <div className='card-number-plate'>{props.car.number_plate}</div> 
            <div className='card-make'>{props.car.make}</div>
            <div className='card-model'>{props.car.model}</div>
            <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Details'} color={'#fff'} onClick={handleOpen}></CustomButton>
            <Dialog open={open} onClose={handleClose} fullWidth={true}>
                <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', alignItems: 'center', flexDirection: 'column', minWidth: '300px' }} >
                    <div>{props.car.make} {props.car.model} ({props.car.number_plate})</div>
                </DialogTitle>
                <Divider style={{width:'100%'}} />
                <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className='rentals-card-dialog-label'>
                        M.O.T.
                        <span className='rentals-card-icons'>
                            <IconButton onClick={handleMOTEdit} style={{display: disableMOT ? 'flex' : 'none'}}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleMOTSave} style={{display: !disableMOT ? 'flex' : 'none'}}>
                                <SaveIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </div>
                    <form className='rentals-card-customer-form'>
                        <CustomDatePicker label="M.O.T. Start Date" value={props.car.mot.start_date} allRentals={null} disabled={disableMOT} margin={'dense'} />
                        <CustomDatePicker label="M.O.T. End Date" value={props.car.mot.end_date} allRentals={null} disabled={disableMOT} disablePast={true} margin={'dense'} />
                    </form>
                    <div className='rentals-card-dialog-label'>
                        Road Tax
                        <span className='rentals-card-icons'>
                            <IconButton onClick={handleRTEdit} style={{display: disableRT ? 'flex' : 'none'}}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleRTSave} style={{display: !disableRT ? 'flex' : 'none'}}>
                                <SaveIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </div>
                    <form className='rentals-card-customer-form'>
                        <CustomDatePicker label="Road Tax Start Date" value={props.car.road_tax.start_date} allRentals={null} disabled={disableRT} margin={'dense'} />
                        <CustomDatePicker label="Road Tax End Date" value={props.car.road_tax.end_date} allRentals={null} disabled={disableRT} disablePast={true} margin={'dense'} />
                    </form>
                    <div className='rentals-card-rental-status-text' style={{ backgroundColor: rentedStatus ? '#E57D97' : '#00cc99' }}>
                        {rentedStatus ? 'The car is rented out.' : 'The car is not rented out.'}
                    </div>
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
                                <ListItem disablePadding style={{ padding: '0 5px', backgroundColor: '#00cc99' }} onClick={() => wrappedFunction(currentRental)}>
                                    <ListItemButton>
                                            <ListItemIcon>
                                                <ArrowCircleRightIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={Object.keys(currentRental).length === 0 ? null : `${moment(currentRental.dates.start_date).format('DD/MM/YYYY')} - ${moment(currentRental.dates.end_date).format('DD/MM/YYYY')}`} />
                                    </ListItemButton>
                                </ListItem>
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
                    {fullHistory ?
                        <Link className='rentals-card-view-history' onClick={handleHideFullHistory}>View Less</Link>
                        :
                        <Link className='rentals-card-view-history' onClick={handleShowFullHistory}>View Full History</Link>                        
                    }
                    <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Done'} color={'#fff'} onClick={handleClose} disabled={!disableMOT || !disableRT ? true : false} marginTop={20}></CustomButton>
                    <Dialog open={openSecondDialog} onClose={handleCloseSecondDialog} fullWidth={true}>
                        <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', alignItems: 'center', flexDirection: 'column', minWidth: '300px' }} >
                            <div>{props.car.make} {props.car.model} ({props.car.number_plate})</div>
                        </DialogTitle>
                        <Divider style={{width:'100%'}} />
                        <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className='rentals-card-dialog-label'>
                                Customer Details
                                <span className='rentals-card-icons'>
                                    <IconButton onClick={handleCustomerEdit} style={{display: disableCustomer ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleCustomerSave} style={{display: !disableCustomer ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </div>
                            <form className='rentals-card-customer-form'>
                                <CustomTextField label={"First Name"} size={"small"} onChange={e => setFirstName(e.target.value)} value={firstName} disabled={disableCustomer} labelMargin={-5} fullWidth={true} height={25} margin={'dense'} />
                                <CustomTextField label={"Last Name"} size={"small"} onChange={e => setLastName(e.target.value)} value={lastName} disabled={disableCustomer} labelMargin={-5} fullWidth={true} height={25} margin={'dense'} />
                                <CustomTextField label={"Phone"} size={"small"} onChange={e => setPhone(e.target.value)} value={phone} disabled={disableCustomer} labelMargin={-5} fullWidth={true} height={25} margin={'dense'} />
                                <CustomTextField label={"Address"} size={"small"} onChange={e => setAddress(e.target.value)} value={address} disabled={disableCustomer} labelMargin={-5} fullWidth={true} height={25} margin={'dense'} />
                            </form>
                            <div className='rentals-card-dialog-label'>
                                Dates
                                <span className='rentals-card-icons'>
                                    <IconButton onClick={handleDatesEdit} style={{display: disableDates ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleDatesSave} style={{display: !disableDates ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </div>
                            <form className='rentals-card-customer-form'>
                                <CustomDatePicker label="Start Date" value={props.car.mot.start_date} allRentals={null} disabled={disableDates} margin={'dense'} />
                                <CustomDatePicker label="End Date" value={props.car.mot.end_date} allRentals={null} disabled={disableDates} margin={'normal'} />
                            </form>
                            <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Done'} color={'#fff'} onClick={handleCloseSecondDialog} disabled={!disableCustomer || !disableDates ? true : false}  marginTop={20}></CustomButton>
                        </DialogContent>
                    </Dialog>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default RemindersCard;
