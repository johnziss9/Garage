import React, { useEffect } from 'react';
import { Divider, IconButton, Dialog, DialogTitle, DialogContent, Box, Snackbar, Alert, Breadcrumbs, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import CustomTextField from '../CustomTextField/CustomTextField';
import CustomButton from '../CustomButton/CustomButton';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

function SparePartContent(props) {
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [fetchedSparePart, setFetchedSparePart] = React.useState({});
    const [sparePartDeleted, setSparePartDeleted] = React.useState(false);
    const [itemName, setItemName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [disableSparePartDetails, setDisableSparePartDetails] = React.useState(true);
    
    useEffect(() => {
        handleFetchedSparePart();
    }, []); 
    
    const handleFetchedSparePart = () => {
        fetch(`http://localhost:5000/api/spare_parts/sparePartId/${props.sparePartId}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            }
        })
        .then((Response) => Response.json())
        .then (data => {
            setFetchedSparePart(data);

            // Used to update state immediately.
            setFetchedSparePart((state) => {
                console.log(state);
                
                return state;
            });

            setItemName(data.name);
            setPrice(data.cost);
        });
    }

    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true)
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleShowSparePartDeletedSB = () => setSparePartDeleted(true);
    const handleHideSparePartDeletedSB = () => setSparePartDeleted(false);

    const handleSparePartDetailsEdit = () => setDisableSparePartDetails(false);
    const handleSparePartDetailsCancel = () => setDisableSparePartDetails(true);
    const handleSparePartDetailsSave = () => {
        fetch('http://localhost:5000/api/spare_parts/update', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                spare_part_id: fetchedSparePart._id,
                name: itemName,
                cost: price
            })
        })
        .then((Response) => Response.json())

        handleFetchedSparePart();

        // Using a timeout to fix the async issue on showing the updated results after saving.
        setTimeout(() => {
            handleFetchedSparePart();
          }, 500);

        setDisableSparePartDetails(true);
    }

    const handleDeleteSparePart = () => {
        fetch('http://localhost:5000/api/spare_parts/delete', {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                spare_part_id: fetchedSparePart._id,
                deleted: true
            })
        })
        .then((Response) => Response.json());

        setSparePartDeleted(true);
        handleCloseDeleteDialog();
    }

  return (
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
            <Typography sx={{ display: 'flex', alignItems: 'center' }} color="inherit">
                <BuildIcon sx={{ mr: 0.7 }} fontSize="inherit" />
                Repair
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
                <SettingsSuggestIcon sx={{ mr: 0.7 }} fontSize="inherit" />
                Spare Part
            </Typography>
        </Breadcrumbs>
        <div className='car-details-header'>
          <IconButton 
            onClick={props.clickHideSparePart} disabled={!disableSparePartDetails? true : false}>
            <ArrowBackIosIcon fontSize="large" style={{ color: '#fff' }} />
          </IconButton>
          <div>{`Spare Part for ${props.car.make} ${props.car.model} (${props.car.number_plate})`}</div>
          <IconButton onClick={handleOpenDeleteDialog}>
            <DeleteForeverIcon fontSize="large" style={{ color: '#fff' }} />
          </IconButton>
        </div>
        <div className='car-details-content'>
            <div className='car-details-content-header'>
                Spare Part Details
                <span className='car-details-content-header-icons'>
                    <IconButton onClick={handleSparePartDetailsEdit} style={{display: disableSparePartDetails ? 'flex' : 'none'}}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={handleSparePartDetailsCancel} style={{display: !disableSparePartDetails ? 'flex' : 'none'}}>
                        <DisabledByDefaultIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={handleSparePartDetailsSave} style={{display: !disableSparePartDetails ? 'flex' : 'none'}}>
                        <SaveIcon fontSize="small" />
                    </IconButton>                            
                </span>
            </div>
            <form className='car-details-form'>
                <CustomTextField label={"Item Name"} size={"small"} onChange={e => setItemName(e.target.value)} value={itemName} disabled={disableSparePartDetails} margin={'dense'} />
                <CustomTextField label={"Price"} size={"small"} onChange={e => setPrice(e.target.value)} value={price} disabled={disableSparePartDetails} margin={'dense'} />
            </form>
        </div>
        <Dialog disableEscapeKeyDown={true} open={openDeleteDialog} onClose={(event, reason) => { if (reason !== 'backdropClick') {handleCloseDeleteDialog(event, reason)} }} fullWidth={true}>
            <DialogTitle style={{ backgroundColor: '#00cc99', color: '#fff', display: 'flex', justifyContent: 'center', minWidth: '300px' }} >
                <div>{`Spare Part for ${props.car.make} ${props.car.model} (${props.car.number_plate})`}</div>
            </DialogTitle>
            <Divider style={{width:'100%'}} />
            <DialogContent>
                <div className='card-confirmation-message'>Are you sure you want to delete this spare part?</div>
                <div className='card-confirmation-buttons'>
                    <Box m={1}>
                        <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={'NO'} color={'#fff'} onClick={handleCloseDeleteDialog} />
                    </Box>
                    <Box m={1}>
                        <CustomButton backgroundColor={'#00cc99'} width={'140px'} height={'40px'} value={'YES'} color={'#fff'} onClick={handleDeleteSparePart} />
                    </Box>
                </div>
            </DialogContent>
        </Dialog>
        {sparePartDeleted ?
        <Snackbar
            autoHideDuration={4000}
            open={handleShowSparePartDeletedSB}
            onClose={handleHideSparePartDeletedSB}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert severity='success' onClose={handleHideSparePartDeletedSB}>Spare Part Successfully Deleted.</Alert>
        </Snackbar> : null}
    </>
  );
}

export default SparePartContent;
