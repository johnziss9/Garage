import React, { useEffect } from 'react';
import { Divider, IconButton, Dialog, DialogTitle, DialogContent, Box, Snackbar, Alert, Breadcrumbs, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import CustomTextField from '../CustomTextField/CustomTextField';
import CustomButton from '../CustomButton/CustomButton';
import CustomDatePicker2 from '../CustomDatePicker2/CustomDatePicker2';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import SparePartContent from '../SparePartContent/SparePartContent';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function RepairContent(props) {
    const [fetchedRepair, setFetchedRepair] = React.useState({});
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAddSparePartDialog, setOpenAddSparePartDialog] = React.useState(false);
    const [repairDeleted, setRepairDeleted] = React.useState(false);
    const [showSelectedSparePart, setShowSelectedSparePart] = React.useState(false);
    const [sparePart, setSparePart] = React.useState({}); // Storing the selected spare part
    
    const [disableCustomerDetails, setDisableCustomerDetails] = React.useState(true);
    const [disableInsuranceDetails, setDisableInsuranceDetails] = React.useState(true);
    const [disableRepairDates, setDisableRepairDates] = React.useState(true);
    const [disableAlignments, setDisableAlignments] = React.useState(true);
    const [disablePaintings, setDisablePaintings] = React.useState(true);
    const [disableMechanical, setDisableMechanical] = React.useState(true);
    const [disableElectrical, setDisableElectrical] = React.useState(true);
    const [disableAirCondition, setDisableAirCondition] = React.useState(true);
    const [disableAdditionalWork, setDisableAdditionalWork] = React.useState(true);

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

    const [sparePartName, setSparePartName] = React.useState('');
    const [sparePartPrice, setSparePartPrice] = React.useState('');
    
    useEffect(() => {
        handleFetchedRepair();
    }, []); 
    
    const handleFetchedRepair = () => {
        fetch(`http://localhost:5000/api/repairs/repairId/${props.repairId}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            }
        })
        .then((Response) => Response.json())
        .then (data => {
            setFetchedRepair(data);

            // Used to update state immediately.
            setFetchedRepair((state) => {
                console.log(state);
                
                return state;
            });

            setFirstName(data.customer_details.first_name)
            setLastName(data.customer_details.last_name);
            setPhoneNumber(data.customer_details.phone_number);
            setAddress(data.customer_details.address);
            setEmail(data.customer_details.email);

            setInsuranceName(data.insurance_details.name);
            setInsurerName(data.insurance_details.insurer_name);
            setInsurerPhoneNumber(data.insurance_details.insurer_phone_number);
            setOperatorName(data.insurance_details.operator_name);
            setOperatorPhoneNumber(data.insurance_details.operator_phone_number);
            setClaimNumber(data.insurance_details.claim_number);
            setPaidAmount(data.insurance_details.paid_amount);

            setAcceptanceDate(data.repair_dates.acceptance_date);
            setReceivedDate(data.repair_dates.received_date);
            setDeliveryDate(data.repair_dates.delivery_date);

            setAlignments(data.alignments);
            setPaintings(data.paintings);
            setMechanical(data.mechanical);
            setElectrical(data.electrical);
            setAirCondition(data.air_condition);
            setAdditionalWork(data.additional_work);
        });
    }

    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true)
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
    
    const handleOpenAddSparePartDialog = () => setOpenAddSparePartDialog(true)
    const handleCloseAddSparePartDialog = () => setOpenAddSparePartDialog(false);

    const handleShowRepairDeletedSB = () => setRepairDeleted(true);
    const handleHideRepairDeletedSB = () => setRepairDeleted(false);

    const handleShowSelectedSparePart = () => setShowSelectedSparePart(true);
    const handleHideSelectedSparePart = () => {
        setShowSelectedSparePart(false);
        handleFetchedRepair();
    }

    const handleCustomerDetailsEdit = () => setDisableCustomerDetails(false);
    const handleCustomerDetailsCancel = () => setDisableCustomerDetails(true);
    const handleCustomerDetailsSave = () => {
        fetch('http://localhost:5000/api/repairs/updateCustomerDetails', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                repair_id: fetchedRepair._id,
                customer_details: {
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phoneNumber,
                    address: address,
                    email: email
                }
            })
        })
        .then((Response) => Response.json())

        handleFetchedRepair();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRepair();
        }, 500);

        setDisableCustomerDetails(true);
    }

    const handleInsuranceDetailsEdit = () => setDisableInsuranceDetails(false);
    const handleInsuranceDetailsCancel = () => setDisableInsuranceDetails(true);
    const handleInsuranceDetailsSave = () => {
        fetch('http://localhost:5000/api/repairs/updateInsuranceDetails', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                repair_id: fetchedRepair._id,
                insurance_details: {
                    name: insuranceName,
                    insurer_name: insurerName,
                    insurer_phone_number: insurerPhoneNumber,
                    operator_name: operatorName,
                    operator_phone_number: operatorPhoneNumber,
                    claim_number: claimNumber,
                    paid_amount: paidAmount
                }
            })
        })
        .then((Response) => Response.json())

        handleFetchedRepair();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRepair();
        }, 500);

        setDisableInsuranceDetails(true);
    }

    const handleRepairDatesEdit = () => setDisableRepairDates(false);
    const handleRepairDatesCancel = () => setDisableRepairDates(true);
    const handleRepairDatesSave = () => {
        fetch('http://localhost:5000/api/repairs/updateDates', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                repair_id: fetchedRepair._id,
                repair_dates: {
                    acceptance_date: acceptanceDate,
                    received_date: receivedDate,
                    delivery_date: deliveryDate
                }
            })
        })
        .then((Response) => Response.json())

        handleFetchedRepair();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRepair();
        }, 500);

        setDisableRepairDates(true);
    }

    const handleAlignmentsEdit = () => setDisableAlignments(false);
    const handleAlignmentsCancel = () => setDisableAlignments(true);
    const handleAlignmentsSave = () => {
        fetch('http://localhost:5000/api/repairs/updateAlignments', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                repair_id: fetchedRepair._id,
                alignments: alignments
            })
        })
        .then((Response) => Response.json())

        handleFetchedRepair();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRepair();
        }, 500);

        setDisableAlignments(true);
    }

    const handlePaintingsEdit = () => setDisablePaintings(false);
    const handlePaintingsCancel = () => setDisablePaintings(true);
    const handlePaintingsSave = () => {
        fetch('http://localhost:5000/api/repairs/updatePaintings', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                repair_id: fetchedRepair._id,
                paintings: paintings
            })
        })
        .then((Response) => Response.json())

        handleFetchedRepair();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRepair();
        }, 500);

        setDisablePaintings(true);
    }

    const handleMechanicalEdit = () => setDisableMechanical(false);
    const handleMechanicalCancel = () => setDisableMechanical(true);
    const handleMechanicalSave = () => {
        fetch('http://localhost:5000/api/repairs/updateMechanical', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                repair_id: fetchedRepair._id,
                mechanical: mechanical
            })
        })
        .then((Response) => Response.json())

        handleFetchedRepair();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRepair();
        }, 500);

        setDisableMechanical(true);
    }

    const handleElectricalEdit = () => setDisableElectrical(false);
    const handleElectricalCancel = () => setDisableElectrical(true);
    const handleElectricalSave = () => {
        fetch('http://localhost:5000/api/repairs/updateElectrical', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                repair_id: fetchedRepair._id,
                electrical: electrical
            })
        })
        .then((Response) => Response.json())

        handleFetchedRepair();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRepair();
        }, 500);

        setDisableElectrical(true);
    }

    const handleAirConditionEdit = () => setDisableAirCondition(false);
    const handleAirConditionCancel = () => setDisableAirCondition(true);
    const handleAirConditionSave = () => {
        fetch('http://localhost:5000/api/repairs/updateAirCondition', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                repair_id: fetchedRepair._id,
                air_condition: airCondition
            })
        })
        .then((Response) => Response.json())

        handleFetchedRepair();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRepair();
        }, 500);

        setDisableAirCondition(true);
    }

    const handleAdditionalWorkEdit = () => setDisableAdditionalWork(false);
    const handleAdditionalWorkCancel = () => setDisableAdditionalWork(true);
    const handleAdditionalWorkSave = () => {
        fetch('http://localhost:5000/api/repairs/updateAdditionalWork', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                repair_id: fetchedRepair._id,
                additional_work: additionalWork
            })
        })
        .then((Response) => Response.json())

        handleFetchedRepair();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRepair();
        }, 500);

        setDisableAdditionalWork(true);
    }

    const handleDeleteRepair = () => {
        fetch('http://localhost:5000/api/repairs/delete', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                repair_id: fetchedRepair._id,
                deleted: true
            })
        })
        .then((Response) => Response.json());

        setRepairDeleted(true);
        handleCloseDeleteDialog();
    }

    const handleSparePart = (sparePart) => {
        setSparePart(sparePart);
        handleShowSelectedSparePart();
    }

    const handleAddNewSparePart = () => {
        fetch('http://localhost:5000/api/spare_parts/add', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                repair_id: fetchedRepair._id,
                name: sparePartName,
                cost: sparePartPrice,
                deleted: false
            })
        })
        .then((Response) => Response.json())

        handleFetchedRepair();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedRepair();
          }, 500);

        handleCloseAddSparePartDialog();
        setSparePartName('');
        setSparePartPrice('');
    }

  return (
    <>
        {showSelectedSparePart ?
        <SparePartContent clickHideSparePart={handleHideSelectedSparePart} car={props.car} sparePartId={sparePart._id} /> :
        <>
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: "15px" }}>
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    <WarehouseIcon sx={{ mr: 0.7 }} fontSize="inherit" />
                    All Repairs
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                    <DirectionsCarIcon sx={{ mr: 0.7 }} fontSize="inherit" />
                    Car
                </Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
                    <BuildIcon sx={{ mr: 0.7 }} fontSize="inherit" />
                    Repair
                </Typography>
            </Breadcrumbs>
            <div className='car-details-header'>
            <IconButton onClick={props.clickHideRepair} disabled={!disableCustomerDetails || !disableInsuranceDetails || !disableRepairDates || !disableAlignments || !disablePaintings || !disableMechanical || !disableElectrical || !disableAirCondition || !disableAdditionalWork ? true : false}>
                <ArrowBackIosIcon fontSize="large" style={{ color: '#fff' }} />
            </IconButton>
            <div>{`Repair for ${props.car.make} ${props.car.model} (${props.car.number_plate})`}</div>
            <IconButton onClick={handleOpenDeleteDialog}>
                <DeleteForeverIcon fontSize="large" style={{ color: '#fff' }} />
            </IconButton>
            </div>
            <div className='car-details-content'>
                {/* Customer Details */}
                <div className='car-details-content-header'>
                    Customer Details
                    <span className='car-details-content-header-icons'>
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
                <form className='car-details-form'>
                    <CustomTextField label={"First Name"} size={"small"} onChange={e => setFirstName(e.target.value)} value={firstName} disabled={disableCustomerDetails} margin={'dense'} />
                    <CustomTextField label={"Last Name"} size={"small"} onChange={e => setLastName(e.target.value)} value={lastName} disabled={disableCustomerDetails} margin={'dense'} />
                    <CustomTextField label={"Phone Number"} size={"small"} onChange={e => setPhoneNumber(e.target.value)} value={phoneNumber} disabled={disableCustomerDetails} margin={'dense'} />
                    <CustomTextField label={"Address"} size={"small"} onChange={e => setAddress(e.target.value)} value={address} disabled={disableCustomerDetails} margin={'dense'} />
                    <CustomTextField label={"Email"} size={"small"} onChange={e => setEmail(e.target.value)} value={email} disabled={disableCustomerDetails} margin={'dense'} />
                </form>
                <Divider style={{width:'100%'}} />
                {/* Insurance Details */}
                <div className='car-details-content-header'>
                    Insurance Details
                    <span className='car-details-content-header-icons'>
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
                <form className='car-details-form'>
                    <CustomTextField label={"Insurance Name"} size={"small"} onChange={e => setInsuranceName(e.target.value)} value={insuranceName} disabled={disableInsuranceDetails} margin={'dense'} />
                    <CustomTextField label={"Insurer Name"} size={"small"} onChange={e => setInsurerName(e.target.value)} value={insurerName} disabled={disableInsuranceDetails} margin={'dense'} />
                    <CustomTextField label={"Insurer Phone Number"} size={"small"} onChange={e => setInsurerPhoneNumber(e.target.value)} value={insurerPhoneNumber} disabled={disableInsuranceDetails} margin={'dense'} />
                    <CustomTextField label={"Operator Name"} size={"small"} onChange={e => setOperatorName(e.target.value)} value={operatorName} disabled={disableInsuranceDetails} margin={'dense'} />
                    <CustomTextField label={"Operator Phone Number"} size={"small"} onChange={e => setOperatorPhoneNumber(e.target.value)} value={operatorPhoneNumber} disabled={disableInsuranceDetails} margin={'dense'} />
                    <CustomTextField label={"Claim Number"} size={"small"} onChange={e => setClaimNumber(e.target.value)} value={claimNumber} disabled={disableInsuranceDetails} margin={'dense'} />
                    <CustomTextField label={"Paid Amount"} size={"small"} onChange={e => setPaidAmount(parseFloat(e.target.value))} value={paidAmount} disabled={disableInsuranceDetails} margin={'dense'} />
                </form>
                {/* Repair Dates */}
                <div className='car-details-content-header'>
                    Repair Dates
                    <span className='car-details-content-header-icons'>
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
                <form className='car-details-form'>
                    <CustomDatePicker2 label="Acceptance Date" value={acceptanceDate} disabled={disableRepairDates} onChange={setAcceptanceDate} margin={'10px 0'} />
                    <CustomDatePicker2 label="Date Received" value={receivedDate} disabled={disableRepairDates} onChange={setReceivedDate} margin={'10px 0'} />
                    <CustomDatePicker2 label="Date Delivered" value={deliveryDate} disabled={disableRepairDates} onChange={setDeliveryDate} margin={'10px 0'} />
                </form>
                {/* Alignments */}
                <div className='car-details-content-header'>
                    Alignments
                    <span className='car-details-content-header-icons'>
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
                <form className='car-details-form'>
                    <CustomTextField label={"Alignments"} size={"small"} onChange={e => setAlignments(e.target.value)} value={alignments} disabled={disableAlignments} multiline rows={6} labelMargin={-7} fullWidth={true} />
                </form>
                {/* Paintings */}
                <div className='car-details-content-header'>
                    Paintings
                    <span className='car-details-content-header-icons'>
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
                <form className='car-details-form'>
                    <CustomTextField label={"Paintings"} size={"small"} onChange={e => setPaintings(e.target.value)} value={paintings} disabled={disablePaintings} multiline rows={6} labelMargin={-7} fullWidth={true} />
                </form>
                {/* Mechanical */}
                <div className='car-details-content-header'>
                    Mechanical
                    <span className='car-details-content-header-icons'>
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
                <form className='car-details-form'>
                    <CustomTextField label={"Mechanical"} size={"small"} onChange={e => setMechanical(e.target.value)} value={mechanical} disabled={disableMechanical} multiline rows={6} labelMargin={-7} fullWidth={true} />
                </form>
                {/* Electrical */}
                <div className='car-details-content-header'>
                    Electrical
                    <span className='car-details-content-header-icons'>
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
                <form className='car-details-form'>
                    <CustomTextField label={"Electrical"} size={"small"} onChange={e => setElectrical(e.target.value)} value={electrical} disabled={disableElectrical} multiline rows={6} labelMargin={-7} fullWidth={true} />
                </form>
                {/* Air Condition */}
                <div className='car-details-content-header'>
                    Air Condition
                    <span className='car-details-content-header-icons'>
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
                <form className='car-details-form'>
                    <CustomTextField label={"AirCondition"} size={"small"} onChange={e => setAirCondition(e.target.value)} value={airCondition} disabled={disableAirCondition} multiline rows={6} labelMargin={-7} fullWidth={true} />
                </form>
                {/* Additional Work */}
                <div className='car-details-content-header'>
                    Additional Work
                    <span className='car-details-content-header-icons'>
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
                <form className='car-details-form'>
                    <CustomTextField label={"Additional Work"} size={"small"} onChange={e => setAdditionalWork(e.target.value)} value={additionalWork} disabled={disableAdditionalWork} multiline rows={6} labelMargin={-7} fullWidth={true} />
                </form>
                <Divider style={{width:'100%'}} />
                <div className='car-details-content-header'>
                    Spare Parts
                    <span className='car-details-content-header-icons'>
                        <IconButton onClick={handleOpenAddSparePartDialog}>
                            <AddCircleIcon style={{ color: '#00cc99' }} fontSize="medium" />
                        </IconButton>                          
                    </span>
                </div>
                <div className='content-listbox'>
                    {Object.keys(fetchedRepair).length !== 0 && fetchedRepair.spare_parts.length === 0 ?
                    <div className='content-listbox-no-items'>No spare parts needed for this car.</div> :
                    <div>
                        <nav>
                            <List>
                                {Object.keys(fetchedRepair).length !== 0 && fetchedRepair.spare_parts.map((sparePart) => (
                                <ListItem key={sparePart._id} disablePadding style={{ backgroundColor: '#fff' }} onClick={() => handleSparePart(sparePart)}>
                                    <ListItemButton>
                                            <ListItemIcon>
                                                <ArrowCircleRightIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={`${sparePart.name} - £${sparePart.cost}`} />
                                    </ListItemButton>
                                </ListItem>
                                ))}
                            </List>
                        </nav>
                    </div>}
                </div>
            </div>
            <Dialog disableEscapeKeyDown={true} open={openDeleteDialog} onClose={(event, reason) => { if (reason !== 'backdropClick') {handleCloseDeleteDialog(event, reason)} }} fullWidth={true}>
                <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center', minWidth: '300px' }} >
                    <div>{`Repair for ${props.car.make} ${props.car.model} (${props.car.number_plate})`}</div>
                </DialogTitle>
                <Divider style={{width:'100%'}} />
                <DialogContent>
                    <div className='card-confirmation-message'>Are you sure you want to delete this repair?</div>
                    <div className='card-confirmation-buttons'>
                        <Box m={1}>
                            <CustomButton backgroundColor={'grey'} width={'140px'} height={'40px'} value={'NO'} color={'#fff'} onClick={handleCloseDeleteDialog} />
                        </Box>
                        <Box m={1}>
                            <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={'YES'} color={'#fff'} onClick={handleDeleteRepair} />
                        </Box>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog disableEscapeKeyDown={true} open={openAddSparePartDialog} onClose={(event, reason) => { if (reason !== 'backdropClick') {handleCloseAddSparePartDialog(event, reason)} }} fullWidth={true}>
                <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center', minWidth: '300px' }} >
                    <div>{`Add New Spare Part for ${props.car.make} ${props.car.model} (${props.car.number_plate})`}</div>
                </DialogTitle>
                <Divider style={{width:'100%'}} />
                <DialogContent style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <form className='add-new-item-form-dialog'>
                        <CustomTextField label='Item' margin={'dense'} onChange={e => setSparePartName(e.target.value)} value={sparePartName}/>
                        <CustomTextField label='Price' margin={'dense'} onChange={e => setSparePartPrice(e.target.value)} value={sparePartPrice} />
                    </form>
                    <div className='card-confirmation-buttons'>
                        <Box m={1}>
                            <CustomButton backgroundColor={'grey'} width={'140px'} height={'40px'} value={'Cancel'} color={'#fff'} onClick={handleCloseAddSparePartDialog} />
                        </Box>
                        <Box m={1}>
                            <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={'Add'} color={'#fff'} onClick={handleAddNewSparePart} />
                        </Box>
                    </div>
                </DialogContent>
            </Dialog>
            {repairDeleted ?
            <Snackbar
                autoHideDuration={4000}
                open={handleShowRepairDeletedSB}
                onClose={handleHideRepairDeletedSB}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity='success' onClose={handleHideRepairDeletedSB}>Repair Successfully Deleted.</Alert>
            </Snackbar> : null}
        </>}
    </>
  );
}

export default RepairContent;
