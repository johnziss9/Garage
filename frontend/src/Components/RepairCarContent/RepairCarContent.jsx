import React, { useEffect } from 'react';
import { Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Breadcrumbs, Typography, Dialog, DialogTitle, DialogContent, Box, Snackbar, Alert } from '@mui/material';
import _ from 'lodash';
import moment from 'moment';
import CustomTextField from '../CustomTextField/CustomTextField';
import CustomButton from '../CustomButton/CustomButton';
import CustomDatePicker2 from '../CustomDatePicker2/CustomDatePicker2';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import RepairContent from '../RepairContent/RepairContent';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function RepairCarContent(props) {
    const [disableCarDetailsContent, setDisableCarDetailsContent] = React.useState(true);
    const [frameNumber, setFrameNumber] = React.useState(props.car.frame_number);
    const [kmMiles, setKmMiles] = React.useState(props.car.km_miles);
    const [repair, setRepair] = React.useState({}); // Storing the selected repair
    const [repairs, setRepairs] = React.useState([]); // All repairs for selected car that are not deleted
    const [completedRepairs, setCompletedRepairs] = React.useState([]); // All repairs for selected car that are not deleted and are completed
    const [incompleteRepair, setIncompleteRepair] = React.useState({});
    const [fullHistory, setFullHistory] = React.useState(false);
    const [showSelectedRepair, setShowSelectedRepair] = React.useState(false);
    const [fetchedCar, setFetchedCar] = React.useState({});
    const [carDeleted, setCarDeleted] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAddRepairDialog, setOpenAddRepairDialog] = React.useState(false);

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [email, setEmail] = React.useState('');

    const [insuranceName, setInsuranceName] = React.useState('');
    const [insurerName, setInsurerName] = React.useState('');
    const [insurerPhoneNumber, setInsurerPhoneNumber] = React.useState('');
    const [operatorName, setOperatorName] = React.useState('');
    const [operatorPhoneNumber, setOperatorPhoneNumber] = React.useState('');
    const [claimNumber, setClaimNumber] = React.useState('');
    const [paidAmount, setPaidAmount] = React.useState(0);

    const [acceptanceDate, setAcceptanceDate] = React.useState(new Date());
    const [receivedDate, setReceivedDate] = React.useState(new Date());
    const [deliveryDate, setDeliveryDate] = React.useState(new Date());

    const [alignments, setAlignments] = React.useState('');
    const [paintings, setPaintings] = React.useState('');
    const [mechanical, setMechanical] = React.useState('');
    const [electrical, setElectrical] = React.useState('');
    const [airCondition, setAirCondition] = React.useState('');
    const [additionalWork, setAdditionalWork] = React.useState('');

    useEffect(() => {
        handleFetchedCar();
    }, []);

    const handleFetchedCar = () => {
        fetch(`http://localhost:5000/api/cars/repairCarId/${props.car._id}`, {
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
                const carRepairs = [];
                const carCompletedRepairs = [];

                data.repairs.forEach(repair => {
                    if (repair.deleted === false) {
                        carRepairs.push(repair);

                        if (repair.completed === true)
                            carCompletedRepairs.push(repair);
                        else
                            setIncompleteRepair(repair);
                    }
                });

                setFetchedCar(carData);
                setRepairs(carRepairs);
                setCompletedRepairs(carCompletedRepairs);

                setFrameNumber(carData.frame_number);
                setKmMiles(carData.km_miles);
            });
    }

    const handleShowFullHistory = () => setFullHistory(true);
    const handleHideFullHistory = () => setFullHistory(false);

    const handleShowSelectedRepair = () => setShowSelectedRepair(true);
    const handleHideSelectedRepair = () => {
        setShowSelectedRepair(false);
        handleFetchedCar();
    }

    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true)
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleOpenAddRepairDialog = () => setOpenAddRepairDialog(true)
    const handleCloseAddRepairDialog = () => setOpenAddRepairDialog(false);

    const handleShowCarDeletedSB = () => setCarDeleted(true);
    const handleHideCarDeletedSB = () => setCarDeleted(false);

    const handleCarEdit = () => setDisableCarDetailsContent(false);
    const handleCarCancel = () => setDisableCarDetailsContent(true);
    const handleCarSave = () => {
        fetch('http://localhost:5000/api/cars/updateCarDetails', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                car_id: fetchedCar._id,
                frame_number: frameNumber,
                km_miles: kmMiles
            })
        })
            .then((Response) => Response.json())

        handleFetchedCar();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedCar();
        }, 500);

        setDisableCarDetailsContent(true);
    }

    const handleRepair = (repair) => {
        setRepair(repair);
        handleShowSelectedRepair();
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
                car_id: fetchedCar._id,
                deleted: true
            })
        })
            .then((Response) => Response.json());

        setCarDeleted(true);
        handleCloseDeleteDialog();
    }

    const handleAddRepair = () => {
        fetch('http://localhost:5000/api/repairs/add', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                car_id: fetchedCar._id,
                customer_details: {
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phoneNumber,
                    address, address,
                    email: email
                },
                insurance_details: {
                    name: insuranceName,
                    insurer_name: insurerName,
                    insurer_phone_number: insurerPhoneNumber,
                    operator_name: operatorName,
                    operator_phone_number: operatorPhoneNumber,
                    claim_numer: claimNumber,
                    paid_amount: paidAmount
                },
                repair_dates: {
                    acceptance_date: acceptanceDate,
                    received_date: receivedDate,
                    delivery_date: deliveryDate
                },
                alignments: alignments,
                paintings: paintings,
                mechanical: mechanical,
                electrical: electrical,
                air_condition: airCondition,
                additional_work: additionalWork,
                completed: false,
                deleted: false
            })
        })
        .then((Response) => Response.json())

        handleFetchedCar();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedCar();
        }, 500);

        handleCloseAddRepairDialog();

        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setAddress('');
        setEmail('');

        setInsuranceName('');
        setInsurerName('');
        setInsurerPhoneNumber('');
        setOperatorName('');
        setOperatorPhoneNumber('');
        setClaimNumber('');
        setPaidAmount('');

        setAcceptanceDate(new Date());
        setReceivedDate(new Date());
        setDeliveryDate(new Date());

        setAlignments('');
        setPaintings('');
        setMechanical('');
        setElectrical('');
        setAirCondition('');
        setAdditionalWork('');
    }

    return (
        <>
            {showSelectedRepair ?
                <RepairContent clickHideRepair={handleHideSelectedRepair} car={props.car} repairId={repair._id} /> :
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
                        <IconButton onClick={handleOpenDeleteDialog}>
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
                                <IconButton onClick={handleOpenAddRepairDialog}>
                                    <AddCircleIcon style={{ color: '#00cc99' }} fontSize="medium" />
                                </IconButton>
                            </span>
                        </div>
                        <div className='content-listbox'>
                            {props.car.repairs[0]._id === undefined ?
                                <div className='content-listbox-no-items'>No repairs for this car.</div> :
                                <div>
                                    <nav>
                                        {fullHistory ?
                                            <List>
                                                {_.orderBy(repairs, ['repair_dates.received_date'], ['asc']).map((repair) => (
                                                    <ListItem key={repair._id} disablePadding style={{ backgroundColor: repair.completed ? '#fff' : '#00cc99' }} onClick={() => handleRepair(repair)} >
                                                        <ListItemButton>
                                                            <ListItemIcon>
                                                                <ArrowCircleRightIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={`Date Received - ${moment(repair.repair_dates.received_date).format('DD/MM/YYYY')}`} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List> :
                                            <List>
                                                {_.orderBy(completedRepairs, ['repair_dates.received_date'], ['asc']).slice(-3).map((repair) => (
                                                    <ListItem key={repair._id} disablePadding style={{ backgroundColor: '#fff' }} onClick={() => handleRepair(repair)} >
                                                        <ListItemButton>
                                                            <ListItemIcon>
                                                                <ArrowCircleRightIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={`Date Received - ${moment(repair.repair_dates.received_date).format('DD/MM/YYYY')}`} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))}
                                                {Object.keys(incompleteRepair).length !== 0 ?
                                                    <ListItem disablePadding style={{ backgroundColor: '#00cc99' }} onClick={() => handleRepair(incompleteRepair)} >
                                                        <ListItemButton>
                                                            <ListItemIcon>
                                                                <ArrowCircleRightIcon />
                                                            </ListItemIcon>
                                                            <ListItemText primary={`Date Received - ${moment(incompleteRepair.repair_dates.received_date).format('DD/MM/YYYY')}`} />
                                                        </ListItemButton>
                                                    </ListItem> : null}
                                            </List>
                                        }
                                    </nav>
                                </div>}
                        </div>
                        {repairs.length > 4 ?
                            <div>
                                {fullHistory ?
                                    <div className='car_details_full_history_button' onClick={handleHideFullHistory}>{'View Less'}</div> :
                                    <div className='car_details_full_history_button' onClick={handleShowFullHistory}>{'View Full History'}</div>}
                            </div> : null}
                    </div>
                    <Dialog disableEscapeKeyDown={true} open={openDeleteDialog} onClose={(event, reason) => { if (reason !== 'backdropClick') { handleCloseDeleteDialog(event, reason) } }} fullWidth={true}>
                        <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center', minWidth: '300px' }} >
                            <div>{`Repair for ${props.car.make} ${props.car.model} (${props.car.number_plate})`}</div>
                        </DialogTitle>
                        <Divider style={{ width: '100%' }} />
                        <DialogContent>
                            <div className='card-confirmation-message'>Are you sure you want to delete this car?</div>
                            <div className='card-confirmation-buttons'>
                                <Box m={1}>
                                    <CustomButton backgroundColor={'grey'} width={'140px'} height={'40px'} value={'NO'} color={'#fff'} onClick={handleCloseDeleteDialog} />
                                </Box>
                                <Box m={1}>
                                    <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={'YES'} color={'#fff'} onClick={handleDeleteCar} />
                                </Box>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog disableEscapeKeyDown={true} open={openAddRepairDialog} onClose={(event, reason) => { if (reason !== 'backdropClick') { handleCloseAddRepairDialog(event, reason) } }} fullWidth={true}>
                        <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center', minWidth: '300px' }} >
                            <div>{`Add New Repair for ${props.car.make} ${props.car.model} (${props.car.number_plate})`}</div>
                        </DialogTitle>
                        <Divider style={{ width: '100%' }} />
                        <DialogContent style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <form className='add-new-item-form-dialog'>
                                <CustomTextField label='First Name' margin={'dense'} onChange={e => setFirstName(e.target.value)} size={'small'} value={firstName} />
                                <CustomTextField label='Last Name' margin={'dense'} onChange={e => setLastName(e.target.value)} size={'small'} value={lastName} />
                                <CustomTextField label='Phone Number' margin={'dense'} onChange={e => setPhoneNumber(e.target.value)} size={'small'} value={phoneNumber} />
                                <CustomTextField label='Address' margin={'dense'} onChange={e => setAddress(e.target.value)} size={'small'} value={address} />
                                <CustomTextField label='Email' margin={'dense'} onChange={e => setEmail(e.target.value)} size={'small'} value={email} />
                                <br />
                                <CustomTextField label='Insurance Name' margin={'dense'} onChange={e => setInsuranceName(e.target.value)} size={'small'} value={insuranceName} />
                                <CustomTextField label='Insurer Name' margin={'dense'} onChange={e => setInsurerName(e.target.value)} size={'small'} value={insurerName} />
                                <CustomTextField label='Insurer Phone Number' margin={'dense'} onChange={e => setInsurerPhoneNumber(e.target.value)} size={'small'} value={insurerPhoneNumber} />
                                <CustomTextField label='Operator Name' margin={'dense'} onChange={e => setOperatorName(e.target.value)} size={'small'} value={operatorName} />
                                <CustomTextField label='Operator Phone Number' margin={'dense'} onChange={e => setOperatorPhoneNumber(e.target.value)} size={'small'} value={operatorPhoneNumber} />
                                <CustomTextField label='Claim Number' margin={'dense'} onChange={e => setClaimNumber(e.target.value)} size={'small'} value={claimNumber} />
                                <CustomTextField label='Paid Amount' margin={'dense'} onChange={e => setPaidAmount(e.target.value)} size={'small'} value={paidAmount} />
                                <br />
                                <CustomDatePicker2 label="Acceptance Date" value={acceptanceDate} onChange={setAcceptanceDate} margin={'10px 0'} />
                                <CustomDatePicker2 label="Date Received" value={receivedDate} onChange={setReceivedDate} margin={'10px 0'} />
                                <CustomDatePicker2 label="Date Delivered" value={deliveryDate} onChange={setDeliveryDate} margin={'10px 0'} />
                                <br />
                                <CustomTextField label='Alignments' margin={'dense'} onChange={e => setAlignments(e.target.value)} size={'small'} value={alignments} />
                                <CustomTextField label='Paintings' margin={'dense'} onChange={e => setPaintings(e.target.value)} size={'small'} value={paintings} />
                                <CustomTextField label='Mechanical' margin={'dense'} onChange={e => setMechanical(e.target.value)} size={'small'} value={mechanical} />
                                <CustomTextField label='Electrical' margin={'dense'} onChange={e => setElectrical(e.target.value)} size={'small'} value={electrical} />
                                <CustomTextField label='Air Condition' margin={'dense'} onChange={e => setAirCondition(e.target.value)} size={'small'} value={airCondition} />
                                <CustomTextField label='Additional Work' margin={'dense'} onChange={e => setAdditionalWork(e.target.value)} size={'small'} value={additionalWork} />
                            </form>
                            <div className='card-confirmation-buttons'>
                                <Box m={1}>
                                    <CustomButton backgroundColor={'grey'} width={'140px'} height={'40px'} value={'Cancel'} color={'#fff'} onClick={handleCloseAddRepairDialog} />
                                </Box>
                                <Box m={1}>
                                    <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={'Add'} color={'#fff'} onClick={handleAddRepair} />
                                </Box>
                            </div>
                        </DialogContent>
                    </Dialog>
                    {carDeleted ?
                        <Snackbar
                            autoHideDuration={4000}
                            open={handleShowCarDeletedSB}
                            onClose={handleHideCarDeletedSB}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <Alert severity='success' onClose={handleHideCarDeletedSB}>Car Successfully Deleted.</Alert>
                        </Snackbar> : null}
                </>}
        </>
    );
}

export default RepairCarContent;
