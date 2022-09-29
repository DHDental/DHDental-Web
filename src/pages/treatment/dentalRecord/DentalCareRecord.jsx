import { Button, Grid, TextField } from '@mui/material'
import { useState } from 'react'

import ServiceBill from './ServiceBill'
import CreateRecord from './CreateRecord'
import PatientInfoDR from './PatientInfoDR'
import { useLocation } from 'react-router-dom'


const DentalCareRecord = () => {
    const location = useLocation();
    console.log(location?.state?.symtom);

    return (
        <>
            <Grid container direction='column' spacing={2}>
                <Grid container item>
                    <PatientInfoDR />
                </Grid>

                <Grid container item>
                    <ServiceBill />
                </Grid>
                <Grid container item>
                    <CreateRecord />
                </Grid>
            </Grid>
        </>
    )
}

export default DentalCareRecord