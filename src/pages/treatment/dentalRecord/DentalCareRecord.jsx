import { Button, Grid, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

import ServiceBill from './ServiceBill'
import CreateRecord from './CreateRecord'
import PatientInfoDR from './PatientInfoDR'
import { useLocation, useParams } from 'react-router-dom'
import { axiosPublic } from '../../../api/axiosInstance'
import { GET_USER_INFO } from '../../../common/constants/apiConstants'


const DentalCareRecord = () => {
    // const location = useLocation();
    // console.log(location?.state?.dentalCareExamReason);

    return (
        <>
            <Grid container direction='column' spacing={2}>
                <Grid container item>
                    <PatientInfoDR />
                </Grid>

                <Grid container item>
                    <ServiceBill />
                </Grid>
                {/* <Grid container item>
                    <CreateRecord />
                </Grid> */}
            </Grid>
        </>
    )
}

export default DentalCareRecord