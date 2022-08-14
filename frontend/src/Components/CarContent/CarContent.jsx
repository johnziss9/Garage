import React from 'react';
import { IconButton } from '@mui/material';
import CustomTextField from '../../Components/CustomTextField/CustomTextField';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

function CarContent(props) {
    const [disableCarDetailsContent, setDisableCarDetailsContent] = React.useState(true);
    const [frameNumber, setFrameNumber] = React.useState(props.car.frame_number);
    const [kmMiles, setKmMiles] = React.useState(props.car.km_miles);

    const handleCarEdit = () => setDisableCarDetailsContent(false);
    const handleCarCancel = () => setDisableCarDetailsContent(true);
    const handleCarSave = () => {
        // fetch('http://localhost:5000/api/cars/updateCarDetails', {
        //     method: 'put',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'x-access-token': sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         car_id: selectedCar._id,
        //         frame_number: selectedCar.frame_number,
        //         km_miles: selectedCar.km_miles
        //     })
        // })
        // .then((Response) => Response.json())
        // .then(handleClose(), window.location.reload())

        setDisableCarDetailsContent(true);
    }

  return (
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
            Car Details
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
          <div className='car-details-listbox'>
            {props.car.repairs[0]._id === undefined ?
            <div>No repairs for this car.</div> :
            <div>{props.car.repairs.map((car) => (<div>REPAIRS!!!</div>))}
            </div>}
          </div>
        </div>
    </>
  );
}

export default CarContent;
