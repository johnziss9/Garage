import React, { useEffect } from 'react';
import './RepairsCard.css';
import moment from 'moment';
import _ from 'lodash';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomTextField from '../CustomTextField/CustomTextField';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';
import { Divider, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link, IconButton, Box, Alert, Snackbar, TextField } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

function RepairsCard(props) {
    const [open, setOpen] = React.useState(false);
    const [openSecondDialog, setOpenSecondDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [carDeleted, setCarDeleted] = React.useState(false);
    const [disableCarDetails, setDisableCarDetails] = React.useState(true);
    const [disableCustomerDetails, setDisableCustomerDetails] = React.useState(true);
    const [disableInsuranceDetails, setDisableInsuranceDetails] = React.useState(true);
    const [disableRepairDates, setDisableRepairDates] = React.useState(true);
    const [disableAlignments, setDisableAlignments] = React.useState(true);
    const [disablePaintings, setDisablePaintings] = React.useState(true);
    const [disableMechanical, setDisableMechanical] = React.useState(true);
    const [disableElectrical, setDisableElectrical] = React.useState(true);
    const [disableAirCondition, setDisableAirCondition] = React.useState(true);
    const [disableAdditionalWork, setDisableAdditionalWork] = React.useState(true);

    const [frameNumber, setFrameNumber] = React.useState('');
    const [kmMiles, setKmMiles] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [insuranceName, setInsuranceName] = React.useState('');
    const [insurerName, setInsurerName] = React.useState('');
    const [insurerPhoneNumber, setInsurerPhoneNumber] = React.useState('');
    const [operatorName, setOperatorName] = React.useState('');
    const [operatorPhoneNumber, setOperatorPhoneNumber] = React.useState('');
    const [claimNumber, setClaimNumber] = React.useState('');
    const [paidAmount, setPaidAmount] = React.useState('');
    const [repairAcceptanceDate, setRepairAcceptanceDate] = React.useState(new Date());
    const [receivedDate, setReceivedDate] = React.useState(new Date());
    const [deliveryDate, setDeliveryDate] = React.useState(new Date());
    const [alignments, setAlignments] = React.useState('');
    const [paintings, setPaintings] = React.useState('');
    const [mechanical, setMechanical] = React.useState('');
    const [electrical, setElectrical] = React.useState('');
    const [airCondition, setAirCondition] = React.useState('');
    const [additionalWork, setAdditionalWork] = React.useState('');

    const [allRepairs, setAllRepairs] = React.useState([]);
    const [expiredRepairs, setExpiredRepairs] = React.useState([]);
    const [currentRepair, setCurrentRepair] = React.useState({});
    const [fullHistory, setFullHistory] = React.useState(false);

    const handleOpen = () => {
        handleRepairsCount();
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const handleOpenSecondDialog = () => setOpenSecondDialog(true)
    const handleCloseSecondDialog = () => setOpenSecondDialog(false);

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
        fetch('http://localhost:5000/api/cars/updateCarDetails', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                car_id: props.car._id,
                frame_number: frameNumber,
                km_miles: kmMiles
            })
        })
        .then((Response) => Response.json())
        .then(handleClose(), window.location.reload())

        setDisableCarDetails(true);
    }

    const handleCustomerDetailsEdit = () => setDisableCustomerDetails(false);
    const handleCustomerDetailsCancel = () => setDisableCustomerDetails(true);
    const handleCustomerDetailsSave = () => {
        // fetch('http://localhost:5000/api/cars/updateCarDetails', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: props.car._id,
        //         frame_number: frameNumber,
        //         km_miles: kmMiles
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        setDisableCustomerDetails(true);
    }

    const handleInsuranceDetailsEdit = () => setDisableInsuranceDetails(false);
    const handleInsuranceDetailsCancel = () => setDisableInsuranceDetails(true);
    const handleInsuranceDetailsSave = () => {
        // fetch('http://localhost:5000/api/cars/updateCarDetails', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: props.car._id,
        //         frame_number: frameNumber,
        //         km_miles: kmMiles
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        setDisableInsuranceDetails(true);
    }

    const handleRepairDatesEdit = () => setDisableRepairDates(false);
    const handleRepairDatesCancel = () => setDisableRepairDates(true);
    const handleRepairDatesSave = () => {
        // fetch('http://localhost:5000/api/cars/updateCarDetails', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: props.car._id,
        //         frame_number: frameNumber,
        //         km_miles: kmMiles
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        setDisableRepairDates(true);
    }

    const handleAlignmentsEdit = () => setDisableAlignments(false);
    const handleAlignmentsCancel = () => setDisableAlignments(true);
    const handleAlignmentsSave = () => {
        // fetch('http://localhost:5000/api/cars/updateCarDetails', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: props.car._id,
        //         frame_number: frameNumber,
        //         km_miles: kmMiles
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        setDisableAlignments(true);
    }

    const handlePaintingsEdit = () => setDisablePaintings(false);
    const handlePaintingsCancel = () => setDisablePaintings(true);
    const handlePaintingsSave = () => {
        // fetch('http://localhost:5000/api/cars/updateCarDetails', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: props.car._id,
        //         frame_number: frameNumber,
        //         km_miles: kmMiles
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        setDisablePaintings(true);
    }

    const handleMechanicalEdit = () => setDisableMechanical(false);
    const handleMechanicalCancel = () => setDisableMechanical(true);
    const handleMechanicalSave = () => {
        // fetch('http://localhost:5000/api/cars/updateCarDetails', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: props.car._id,
        //         frame_number: frameNumber,
        //         km_miles: kmMiles
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        setDisableMechanical(true);
    }

    const handleElectricalEdit = () => setDisableElectrical(false);
    const handleElectricalCancel = () => setDisableElectrical(true);
    const handleElectricalSave = () => {
        // fetch('http://localhost:5000/api/cars/updateCarDetails', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: props.car._id,
        //         frame_number: frameNumber,
        //         km_miles: kmMiles
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        setDisableElectrical(true);
    }

    const handleAirConditionEdit = () => setDisableAirCondition(false);
    const handleAirConditionCancel = () => setDisableAirCondition(true);
    const handleAirConditionSave = () => {
        // fetch('http://localhost:5000/api/cars/updateCarDetails', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: props.car._id,
        //         frame_number: frameNumber,
        //         km_miles: kmMiles
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        setDisableAirCondition(true);
    }

    const handleAdditionalWorkEdit = () => setDisableAdditionalWork(false);
    const handleAdditionalWorkCancel = () => setDisableAdditionalWork(true);
    const handleAdditionalWorkSave = () => {
        // fetch('http://localhost:5000/api/cars/updateCarDetails', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: props.car._id,
        //         frame_number: frameNumber,
        //         km_miles: kmMiles
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        setDisableAdditionalWork(true);
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

        handleOpenSecondDialog();
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
                        <CustomTextField label={"Frame Number"} size={"small"} onChange={e => setFrameNumber(e.target.value)} value={frameNumber} disabled={disableCarDetails} fullWidth={true} margin={'dense'} />
                        <CustomTextField label={"Km/Miles"} size={"small"} onChange={e => setKmMiles(e.target.value)} value={kmMiles} disabled={disableCarDetails} fullWidth={true} margin={'dense'} />
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
                    <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Done'} color={'#fff'} onClick={handleClose} disabled={!disableCarDetails ? true : false} marginTop={20}></CustomButton>
                    <Dialog disableEscapeKeyDown={true} onBackdropClick={true} open={openSecondDialog} onClose={handleCloseSecondDialog} fullWidth={true}>
                        <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center' }} >
                            <div>{props.car.make} {props.car.model} ({props.car.number_plate})</div>
                        </DialogTitle>
                        <Divider style={{width:'100%'}} />
                        <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Customer Details */}
                            <div className='card-section-header'>
                                Customer Details
                                <span className='card-icons'>
                                    <IconButton onClick={handleCustomerDetailsEdit} style={{display: disableCustomerDetails ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleCustomerDetailsCancel} style={{display: !disableCustomerDetails ? 'flex' : 'none'}}>
                                        <DisabledByDefaultIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleCustomerDetailsSave} style={{display: !disableCustomerDetails ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>                            
                                </span>
                            </div>
                            <form className='card-form'>
                                <CustomTextField label={"First Name"} size={"small"} onChange={e => setFirstName(e.target.value)} value={firstName} disabled={disableCustomerDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Last Name"} size={"small"} onChange={e => setLastName(e.target.value)} value={lastName} disabled={disableCustomerDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Phone"} size={"small"} onChange={e => setPhone(e.target.value)} value={phone} disabled={disableCustomerDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Address"} size={"small"} onChange={e => setAddress(e.target.value)} value={address} disabled={disableCustomerDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Email"} size={"small"} onChange={e => setEmail(e.target.value)} value={email} disabled={disableCustomerDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                            </form>
                            {/* Insurance Details */}
                            <div className='card-section-header'>
                                Insurance Details
                                <span className='card-icons'>
                                    <IconButton onClick={handleInsuranceDetailsEdit} style={{display: disableInsuranceDetails ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleInsuranceDetailsCancel} style={{display: !disableInsuranceDetails ? 'flex' : 'none'}}>
                                        <DisabledByDefaultIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleInsuranceDetailsSave} style={{display: !disableInsuranceDetails ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>                            
                                </span>
                            </div>
                            <form className='card-form'>
                                <CustomTextField label={"Insurance Name"} size={"small"} onChange={e => setInsuranceName(e.target.value)} value={insuranceName} disabled={disableInsuranceDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Insurer Name"} size={"small"} onChange={e => setInsurerName(e.target.value)} value={insurerName} disabled={disableInsuranceDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Insurer Phone Number"} size={"small"} onChange={e => setInsurerPhoneNumber(e.target.value)} value={insurerPhoneNumber} disabled={disableInsuranceDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Operator Name"} size={"small"} onChange={e => setOperatorName(e.target.value)} value={operatorName} disabled={disableInsuranceDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Operator Phone Number"} size={"small"} onChange={e => setOperatorPhoneNumber(e.target.value)} value={operatorPhoneNumber} disabled={disableInsuranceDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Claim Number"} size={"small"} onChange={e => setClaimNumber(e.target.value)} value={claimNumber} disabled={disableInsuranceDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                                <CustomTextField label={"Paid Amount"} size={"small"} onChange={e => setPaidAmount(e.target.value)} value={paidAmount} disabled={disableInsuranceDetails} labelMargin={-7} fullWidth={true} height={27} margin={'dense'} />
                            </form>
                            {/* Repair Dates */}
                            <div className='card-section-header'>
                                Repair Dates
                                <span className='card-icons'>
                                    <IconButton onClick={handleRepairDatesEdit} style={{display: disableRepairDates ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleRepairDatesCancel} style={{display: !disableRepairDates ? 'flex' : 'none'}}>
                                        <DisabledByDefaultIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleRepairDatesSave} style={{display: !disableRepairDates ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>                            
                                </span>
                            </div>
                            <form className='card-form'>
                                <CustomDatePicker label="Repair Acceptance Date" value={repairAcceptanceDate} onChange={setRepairAcceptanceDate} disabled={disableRepairDates} allRentals={null} margin={'dense'} />
                                <CustomDatePicker label="Date Received" value={receivedDate} onChange={setReceivedDate} allRentals={null} disabled={disableRepairDates} margin={'dense'} />
                                <CustomDatePicker label="Date Delivered" value={deliveryDate} onChange={setDeliveryDate} allRentals={null} disabled={disableRepairDates} margin={'dense'} />
                            </form>
                            {/* Alignments */}
                            <div className='card-section-header'>
                                Alignments
                                <span className='card-icons'>
                                    <IconButton onClick={handleAlignmentsEdit} style={{display: disableAlignments ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleAlignmentsCancel} style={{display: !disableAlignments ? 'flex' : 'none'}}>
                                        <DisabledByDefaultIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleAlignmentsSave} style={{display: !disableAlignments ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>                            
                                </span>
                            </div>
                            <form className='card-form'>
                                <CustomTextField label={"Alignments"} size={"small"} onChange={e => setAlignments(e.target.value)} value={alignments} disabled={disableAlignments} multiline rows={6} labelMargin={-7} fullWidth={true} />
                            </form>
                            {/* Paintings */}
                            <div className='card-section-header'>
                                Paintings
                                <span className='card-icons'>
                                    <IconButton onClick={handlePaintingsEdit} style={{display: disablePaintings ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handlePaintingsCancel} style={{display: !disablePaintings ? 'flex' : 'none'}}>
                                        <DisabledByDefaultIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handlePaintingsSave} style={{display: !disablePaintings ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>                            
                                </span>
                            </div>
                            <form className='card-form'>
                                <CustomTextField label={"Paintings"} size={"small"} onChange={e => setPaintings(e.target.value)} value={paintings} disabled={disablePaintings} multiline rows={6} labelMargin={-7} fullWidth={true} />
                            </form>
                            {/* Mechanical */}
                            <div className='card-section-header'>
                                Mechanical
                                <span className='card-icons'>
                                    <IconButton onClick={handleMechanicalEdit} style={{display: disableMechanical ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleMechanicalCancel} style={{display: !disableMechanical ? 'flex' : 'none'}}>
                                        <DisabledByDefaultIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleMechanicalSave} style={{display: !disableMechanical ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>                            
                                </span>
                            </div>
                            <form className='card-form'>
                                <CustomTextField label={"Mechanical"} size={"small"} onChange={e => setMechanical(e.target.value)} value={mechanical} disabled={disableMechanical} multiline rows={6} labelMargin={-7} fullWidth={true} />
                            </form>
                            {/* Electrical */}
                            <div className='card-section-header'>
                                Electrical
                                <span className='card-icons'>
                                    <IconButton onClick={handleElectricalEdit} style={{display: disableElectrical ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleElectricalCancel} style={{display: !disableElectrical ? 'flex' : 'none'}}>
                                        <DisabledByDefaultIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleElectricalSave} style={{display: !disableElectrical ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>                            
                                </span>
                            </div>
                            <form className='card-form'>
                                <CustomTextField label={"Electrical"} size={"small"} onChange={e => setElectrical(e.target.value)} value={electrical} disabled={disableElectrical} multiline rows={6} labelMargin={-7} fullWidth={true} />
                            </form>
                            {/* Air Condition */}
                            <div className='card-section-header'>
                                Air Condition
                                <span className='card-icons'>
                                    <IconButton onClick={handleAirConditionEdit} style={{display: disableAirCondition ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleAirConditionCancel} style={{display: !disableAirCondition ? 'flex' : 'none'}}>
                                        <DisabledByDefaultIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleAirConditionSave} style={{display: !disableAirCondition ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>                            
                                </span>
                            </div>
                            <form className='card-form'>
                                <CustomTextField label={"AirCondition"} size={"small"} onChange={e => setAirCondition(e.target.value)} value={airCondition} disabled={disableAirCondition} multiline rows={6} labelMargin={-7} fullWidth={true} />
                            </form>
                            {/* Additional Work */}
                            <div className='card-section-header'>
                                Additional Work
                                <span className='card-icons'>
                                    <IconButton onClick={handleAdditionalWorkEdit} style={{display: disableAdditionalWork ? 'flex' : 'none'}}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleAdditionalWorkCancel} style={{display: !disableAdditionalWork ? 'flex' : 'none'}}>
                                        <DisabledByDefaultIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={handleAdditionalWorkSave} style={{display: !disableAdditionalWork ? 'flex' : 'none'}}>
                                        <SaveIcon fontSize="small" />
                                    </IconButton>                            
                                </span>
                            </div>
                            <form className='card-form'>
                                <CustomTextField label={"Additional Work"} size={"small"} onChange={e => setAdditionalWork(e.target.value)} value={additionalWork} disabled={disableAdditionalWork} multiline rows={6} labelMargin={-7} fullWidth={true} />
                            </form>
                            {/* The button height wasn't working below so I placed it inside a div */}
                            <div style={{ width: '100%', height: '60px', display: 'flex', justifyContent: 'center' }}> 
                                <CustomButton 
                                    backgroundColor={'#00cc99'} 
                                    width={'120px'} 
                                    height={'40px'} 
                                    value={'Done'} 
                                    color={'#fff'} 
                                    onClick={handleCloseSecondDialog} 
                                    disabled={!disableCustomerDetails || !disableInsuranceDetails || !disableRepairDates || !disableAlignments || !disablePaintings || !disableMechanical || !disableElectrical || !disableAirCondition || !disableAdditionalWork ? true : false} 
                                    marginTop={20}>
                                </CustomButton>
                            </div>
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

export default RepairsCard;
