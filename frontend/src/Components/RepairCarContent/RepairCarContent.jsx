import React, { useEffect } from 'react';
import { Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Breadcrumbs, Typography } from '@mui/material';
import _ from 'lodash';
import moment from 'moment';
import CustomTextField from '../CustomTextField/CustomTextField';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import RepairContent from '../RepairContent/RepairContent';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

function RepairCarContent(props) {
    const [disableCarDetailsContent, setDisableCarDetailsContent] = React.useState(true);
    const [frameNumber, setFrameNumber] = React.useState(props.car.frame_number);
    const [kmMiles, setKmMiles] = React.useState(props.car.km_miles);
    const [repair, setRepair] = React.useState({}); // Selected repair coming from RepairContent.jsx
    const [repairs, setRepairs] = React.useState([]); // All repairs for selected car that are not deleted
    const [completedRepairs, setCompletedRepairs] = React.useState([]); // All repairs for selected car that are not deleted and are completed
    const [incompleteRepair, setIncompleteRepair] = React.useState({});
    const [fullHistory, setFullHistory] = React.useState(false);
    const [showSelectedRepair, setShowSelectedRepair] = React.useState(false);
    const [fetchedCar, setFetchedCar] = React.useState({});

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
      .then (data => {
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
    const handleHideSelectedRepair = () => setShowSelectedRepair(false);

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

      setDisableCarDetailsContent(true);
  }

  const handleRepair = (repair) => {
    setRepair(repair);
    handleShowSelectedRepair();
  }

  return (
    <>
      {!showSelectedRepair ?
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: "15px" }}>
        <Typography sx={{ display: 'flex', alignItems: 'center' }}>
          <WarehouseIcon sx={{ mr: 0.7 }} fontSize="inherit" />
          All Repairs
        </Typography>
        <Typography sx={{ display: 'flex', alignItems: 'center' }} color="text.primary">
          <DirectionsCarIcon sx={{ mr: 0.7 }} fontSize="inherit" />
          Car
        </Typography>
      </Breadcrumbs> : null}
      {showSelectedRepair ?
      <RepairContent clickHideRepair={handleHideSelectedRepair} car={props.car} repairId={repair._id} /> :
      <>
        <div className='car-details-header'>
          <IconButton onClick={props.clickHideCar}>
            <ArrowBackIosIcon fontSize="large" style={{ color: '#fff' }} />
          </IconButton>
          <div>{props.car.make} {props.car.model} ({props.car.number_plate})</div>
          <IconButton>
            <DeleteForeverIcon fontSize="large" style={{ color: '#fff' }} />
          </IconButton>
        </div>
        <div className='car-details-content'>
          <div className='car-details-content-header'>
            Details
            <span className='car-details-content-header-icons'>
                <IconButton onClick={handleCarEdit} style={{display: disableCarDetailsContent ? 'flex' : 'none'}}>
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleCarCancel} style={{display: !disableCarDetailsContent ? 'flex' : 'none'}}>
                    <DisabledByDefaultIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleCarSave} style={{display: !disableCarDetailsContent ? 'flex' : 'none'}}>
                    <SaveIcon fontSize="small" />
                </IconButton>
            </span>
          </div>
          <form className='car-details-form'>
            <CustomTextField label={"Frame Number"} size={"small"} onChange={e => setFrameNumber(e.target.value)} value={frameNumber} disabled={disableCarDetailsContent} margin={'dense'} />
            <CustomTextField label={"Km/Miles"} size={"small"} onChange={e => setKmMiles(e.target.value)} value={kmMiles} disabled={disableCarDetailsContent} margin={'dense'} />
          </form>
          <Divider style={{width:'100%'}} />
          <div className='car-details-content-header-no-buttons'>Repairs</div>
          <div className='car-details-listbox'>
            {props.car.repairs[0]._id === undefined ?
            <div>No repairs for this car.</div> :
            <div>
                <nav>
                    {fullHistory ?
                    <List>
                        {_.orderBy(repairs, ['repair_dates.received_date'], ['asc']).map((repair) => (
                        <ListItem disablePadding style={{ backgroundColor: repair.completed ? '#fff' : '#00cc99' }} onClick={() => handleRepair(repair)} >
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
                      <ListItem disablePadding style={{ backgroundColor: '#fff' }} onClick={() => handleRepair(repair)} >
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
      </>}
    </>
  );
}

export default RepairCarContent;
