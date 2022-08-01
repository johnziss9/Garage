import React, { useEffect } from 'react';
import './RepairsCard.css';
import CustomButton from '../../Components/CustomButton/CustomButton';

function RepairsCard(props) {

    return (
        <>
            <div className='repairs-card-wrapper'>
            <div className='repairs-cars-status' style={{ backgroundColor: props.car.has_active_repair ? "#00cc99" : 'grey' }}>{props.car.has_active_repair ? "Ongoing" : "Completed"}</div>
            <div className='card-number-plate'>{props.car.number_plate}</div> 
            <div className='card-make'>{props.car.make}</div>
            <div className='card-model'>{props.car.model}</div>
            <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Details'} color={'#fff'} ></CustomButton>
        </div>
        </>
    );
}

export default RepairsCard;
