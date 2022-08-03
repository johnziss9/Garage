import React, { useEffect } from 'react';
import './RepairsCard.css';
import moment from 'moment';
import _ from 'lodash';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomTextField from '../CustomTextField/CustomTextField';
import { Divider, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link, IconButton, Box, Alert, Snackbar } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { datePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';

function RepairsCard(props) {
    const [open, setOpen] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [carDeleted, setCarDeleted] = React.useState(false);
    const [disableCarDetails, setDisableCarDetails] = React.useState(true);
    const [disableCustomerDetails, setDisableCustomerDetails] = React.useState(true);

    const [arithmosPlaisiou, setArithmosPlaisiou] = React.useState('');
    const [kmMiles, setKmMiles] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [email, setEmail] = React.useState('');

    const [allRepairs, setAllRepairs] = React.useState([]);
    const [expiredRepairs, setExpiredRepairs] = React.useState([]);
    const [currentRepair, setCurrentRepair] = React.useState({});
    const [fullHistory, setFullHistory] = React.useState(false);

    const handleOpen = () => {
        handleRepairsCount();
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true)
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleShowCarDeletedSB = () => setCarDeleted(true);
    const handleHideCarDeletedSB = () => setCarDeleted(false);

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

    const handleCarEdit = () => setDisableCarDetails(false);
    const handleCarCancel = () => setDisableCarDetails(true);
    const handleCarSave = () => {
        // fetch('http://localhost:5000/api/cars/updateMOT', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: props.car._id,
        //         mot: {
        //             start_date: MOTStartDate,
        //             end_date: MOTEndDate
        //         }
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        // setDisableMOT(true);
    }

    const handleCustomerEdit = () => setDisableCustomerDetails(false);
    const handleCustomerCancel = () => setDisableCustomerDetails(true);
    const handleCustomerSave = () => {
        // fetch('http://localhost:5000/api/cars/updateMOT', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: props.car._id,
        //         mot: {
        //             start_date: MOTStartDate,
        //             end_date: MOTEndDate
        //         }
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        // setDisableMOT(true);
    }

    const handleShowFullHistory = () => setFullHistory(true);
    const handleHideFullHistory = () => setFullHistory(false);

    const handleRepairsCount = () => {
        fetch(`http://localhost:5000/api/cars/repairCarId/${props.car._id}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            }
        })
        .then((Response) => Response.json())
        .then (data => {
            if (data.repairs.length > 0)
                handleRepairs();
        });
    }

    const handleRepairs = () => {
        let repairs = [];
        let expRepairs = [];

        props.car.repairs.forEach(repair => {
            if (repair.completed)
                expRepairs.push(repair);
            else
                setCurrentRepair(repair);
            
            repairs.push(repair);
        });

        setAllRepairs(repairs);
        setExpiredRepairs(expRepairs);
    }

    const wrappedFunction = (repair) => {
        // setRentalDetails(rental);

        // // This is done so the setRentalDetails above gets updated instantly.
        // setRentalDetails((state) => {
        //     return state;
        // })

        // setFirstName(rental.first_name);
        // setLastName(rental.last_name);
        // setPhone(rental.phone_number);
        // setAddress(rental.address);
        // setRentalStartDate(rental.dates.start_date);
        // setRentalEndDate(rental.dates.end_date);

        // handleOpenSecondDialog();
    }

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
            <div className='repairs-card-wrapper'>
            <div className='repairs-cars-status' style={{ backgroundColor: props.car.has_active_repair ? "#00cc99" : 'grey' }}>{props.car.has_active_repair ? "Ongoing" : "Completed"}</div>
            <div className='card-number-plate'>{props.car.number_plate}</div> 
            <div className='card-make'>{props.car.make}</div>
            <div className='card-model'>{props.car.model}</div>
            <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Details'} color={'#fff'} onClick={handleOpen}></CustomButton>
            <Dialog disableEscapeKeyDown={true} onBackdropClick={true} open={open} onClose={handleClose} fullWidth={true}>
                <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <div style={{ marginLeft: 'auto', marginRight: '-59px' /*  Used to center the title */ }}>{props.car.make} {props.car.model} ({props.car.number_plate})</div>
                    <IconButton style={{ marginLeft: 'auto' }} onClick={handleOpenDeleteDialog}>
                        <DeleteForeverIcon fontSize="large" style={{ color: '#fff' }} />
                    </IconButton>                
                </DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className='card-section-header'>
                        Car Details
                        <span className='card-icons'>
                            <IconButton onClick={handleCarEdit} style={{display: disableCarDetails ? 'flex' : 'none'}}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleCarCancel} style={{display: !disableCarDetails ? 'flex' : 'none'}}>
                                <DisabledByDefaultIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleCarSave} style={{display: !disableCarDetails ? 'flex' : 'none'}}>
                                <SaveIcon fontSize="small" />
                            </IconButton>                            
                        </span>
                    </div>
                    <form className='card-form'>
                        <CustomTextField label={"Arithmos Plaisiou"} size={"small"} onChange={e => setArithmosPlaisiou(e.target.value)} value={arithmosPlaisiou} disabled={disableCarDetails} fullWidth={true} margin={'dense'} />
                        <CustomTextField label={"Km/Miles"} size={"small"} onChange={e => setKmMiles(e.target.value)} value={kmMiles} disabled={disableCarDetails} fullWidth={true} margin={'dense'} />
                    </form>
                    <div className='card-section-header'>
                        Customer Details
                        <span className='card-icons'>
                            <IconButton onClick={handleCustomerEdit} style={{display: disableCustomerDetails ? 'flex' : 'none'}}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleCustomerCancel} style={{display: !disableCustomerDetails ? 'flex' : 'none'}}>
                                <DisabledByDefaultIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={handleCustomerSave} style={{display: !disableCustomerDetails ? 'flex' : 'none'}}>
                                <SaveIcon fontSize="small" />
                            </IconButton>                            
                        </span>
                    </div>
                    <form className='card-form'>
                        <CustomTextField label={"First Name"} size={"small"} onChange={e => setFirstName(e.target.value)} value={firstName} disabled={disableCarDetails} fullWidth={true} margin={'dense'} />
                        <CustomTextField label={"Last Name"} size={"small"} onChange={e => setLastName(e.target.value)} value={lastName} disabled={disableCarDetails} fullWidth={true} margin={'dense'} />
                        <CustomTextField label={"Phone"} size={"small"} onChange={e => setPhone(e.target.value)} value={phone} disabled={disableCarDetails} fullWidth={true} margin={'dense'} />
                        <CustomTextField label={"Address"} size={"small"} onChange={e => setAddress(e.target.value)} value={address} disabled={disableCarDetails} fullWidth={true} margin={'dense'} />
                        <CustomTextField label={"Email"} size={"small"} onChange={e => setEmail(e.target.value)} value={email} disabled={disableCarDetails} fullWidth={true} margin={'dense'} />
                    </form>
                    {allRepairs.length === 0 ?
                    <div className='repairs-card-no-repairs'>No repairs for this car.</div> :
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Box className="repairs-card-repairs-list">
                            <nav>
                                {fullHistory ?
                                <List>
                                    {_.orderBy(allRepairs, ['repair_details.receieved_date'], ['asc']).map((repair) => (
                                    <ListItem disablePadding style={{ padding: '0 5px', height: '32px', backgroundColor: repair.completed ? '#fff' : '#00cc99' }} onClick={() => wrappedFunction(repair)}>
                                        <ListItemButton>
                                                <ListItemIcon>
                                                    <ArrowCircleRightIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`Date Received - ${moment(repair.repair_details.receieved_date).format('DD/MM/YYYY')}`} />
                                        </ListItemButton>
                                    </ListItem>
                                    ))}
                                </List>
                                :
                                <List>
                                    {_.orderBy(expiredRepairs.length > 3 ? expiredRepairs.slice(0, 3) : expiredRepairs, ['repair_details.receieved_date'], ['asc']).map((repair) => (
                                    <ListItem disablePadding style={{ padding: '0 5px', height: '32px' }} onClick={() => wrappedFunction(repair)}>
                                        <ListItemButton>
                                                <ListItemIcon>
                                                    <ArrowCircleRightIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`Date Received - ${moment(repair.repair_details.receieved_date).format('DD/MM/YYYY')}`} />
                                        </ListItemButton>
                                    </ListItem>
                                    ))}
                                    {Object.keys(currentRepair).length !== 0 ?
                                        <ListItem disablePadding style={{ padding: '0 5px', height: '32px', backgroundColor: '#00cc99' }} onClick={() => wrappedFunction(currentRepair)}>
                                        <ListItemButton>
                                                <ListItemIcon>
                                                    <ArrowCircleRightIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={`Date Received - ${moment(currentRepair.repair_details.receieved_date).format('DD/MM/YYYY')}`} />
                                        </ListItemButton>
                                    </ListItem>
                                    :
                                    null}
                                </List>}
                            </nav>
                        </Box>
                        {allRepairs.length > 4 ?
                        <div style={{ marginTop: '15px' }}>
                            {fullHistory ?
                                <Link className='card-view-history' onClick={handleHideFullHistory}>View Less</Link>
                                :
                                <Link className='card-view-history' onClick={handleShowFullHistory}>View Full History</Link>                        
                            }
                        </div> :
                        null}
                    </div>}
                    <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Done'} color={'#fff'} onClick={handleClose} disabled={!disableCarDetails || !disableCustomerDetails ? true : false} marginTop={20}></CustomButton>
                    {/* SECOND DIALOG CONTENT GOES HERE */}
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

export default RepairsCard;
