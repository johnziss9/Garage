import React, { useState, useEffect } from 'react';
import './RentalsCard.css';
import CustomButton from '../CustomButton/CustomButton';

function RemindersCard(props) {
    return (
        <div className='rentals-card-wrapper'>
            <div className='card-number-plate'>{props.car.number_plate}</div> 
            {/* This line needs to go in the above line */}
            {/* style={{props.rented ? borderTop: "8px solid #00cc99" : "8px solid grey"}} */}
            <div className='card-make'>{props.car.make}</div>
            <div className='card-model'>{props.car.model}</div>
            <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Details'} color={'#fff'}></CustomButton>
        </div>
    );
}

export default RemindersCard;
