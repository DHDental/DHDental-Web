import { Grid, Typography } from '@mui/material'
import PatientAppointment from './PatientAppointment'
import PatientNotAppointment from './PatientNotAppointment'

import PatientOn from './PatientOn'

const StaffWaitingList = () => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={3.5} >
                <PatientOn />
            </Grid>
            {/* <Divider orientation='vertical' flexItem sx={{ height: '80vh' }} /> */}
            <Grid item xs={8.5} sx={{ borderLeft: '1px black solid' }} >
                <Typography variant='subtitle1' sx={{
                    color: 'blue',
                    fontWeight: '500',
                    marginBottom: '15px',
                }}>Bệnh nhân chờ khám</Typography>

                <Grid container spacing={1}>
                    <Grid item xs={6.75} >
                        <PatientAppointment />
                    </Grid>

                    <Grid item xs={5.25} sx={{ borderLeft: '1px black solid' }}>
                        <PatientNotAppointment />
                    </Grid>
                </Grid>
            </Grid>
            {/* <Grid item xs={3.3}>
                <PatientAppointment />
            </Grid>
            <Divider orientation='vertical' flexItem />
            <Grid item xs={3.3}>
                <PatientOff />
            </Grid> */}

        </Grid>
    )
}

export default StaffWaitingList