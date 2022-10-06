import React, { useEffect } from 'react';
import './RentalsCard.css';
import CustomButton from '../CustomButton/CustomButton';

function RentalsCard(props) {

    const handleShowSelectedCar = (car) => {
        props.clickShowCar();
        props.selectedCar(car)
    }

    return (
        <>
            <div className='rentals-card-wrapper'>
            <div className='rentals-cars-status' style={props.car.rented ? { backgroundColor: "grey" } : { backgroundColor: "#00cc99" }}>{props.car.rented ? "Rented" : "Available"}</div>
            <div className='card-number-plate'>{props.car.number_plate}</div> 
            <div className='card-make'>{props.car.make}</div>
            <div className='card-model'>{props.car.model}</div>
            <CustomButton backgroundColor={'#00cc99'} width={'120px'} height={'40px'} value={'Details'} color={'#fff'} onClick={() => handleShowSelectedCar(props.car)}></CustomButton>
        </div>
        </>
    );
}

export default RentalsCard;
