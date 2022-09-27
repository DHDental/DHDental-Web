import { Grid, Typography } from '@mui/material'
import React from 'react'

const PatientInfoDR = () => {
    return (
        <>
            <Grid container item spacing={1} direction='row'>
                <Grid item sm={2}>
                    <Typography>Bệnh nhân</Typography>
                </Grid>
                <Grid item sm={5}>
                    <Typography>Nguyễn Hoàng Long</Typography>
                </Grid>
            </Grid>
            <Grid container item spacing={1} direction='row'>
                <Grid item sm={2}>
                    <Typography>Tuổi</Typography>
                </Grid>
                <Grid item sm={5}>
                    <Typography>22</Typography>
                </Grid>
            </Grid>


        </>
    )
}

export default PatientInfoDR