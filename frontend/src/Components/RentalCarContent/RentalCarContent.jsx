import React, { useEffect } from 'react';
import { Breadcrumbs, Typography } from '@mui/material';

import WarehouseIcon from '@mui/icons-material/Warehouse';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

function RentalCarContent(props) {
    const [showSelectedRental, setShowSelectedRental] = React.useState(false);

    return (
        <>
            {showSelectedRental ?
                <div>RENTAL CONTENT WILL GO HERE</div> :
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
                </>
            }
        </>
    )
}

export default RentalCarContent;