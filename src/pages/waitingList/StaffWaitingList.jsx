import { Divider, Grid, Stack, Typography } from '@mui/material'
import PatientAppointment from './PatientAppointment'

import PatientOff from './PatientOff'
import PatientOn from './PatientOn'

const StaffWaitingList = () => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3.3}>
                <PatientOn />
            </Grid>
            <Divider orientation='vertical' flexItem />
            <Grid item xs={3.3}>
                <PatientAppointment />
            </Grid>
            <Divider orientation='vertical' flexItem />
            <Grid item xs={3.3}>
                <PatientOff />
            </Grid>

        </Grid>
    )
}

export default StaffWaitingList