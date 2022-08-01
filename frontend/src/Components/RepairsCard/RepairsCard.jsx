import React, { useEffect } from 'react';
import './RepairsCard.css';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { Divider, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link, IconButton, Box, Alert, Snackbar } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function RepairsCard(props) {
    const [open, setOpen] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [carDeleted, setCarDeleted] = React.useState(false);

    const handleOpen = () => setOpen(true);
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
                <DialogContent>
                    {/* DIALOG CONTENT GOES HERE */}
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
