import { Grid, Typography } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';

import '../../style/patientTreatment.css';

const PatientTreatment = () => {
    return (
        <>
            <Grid container direction='row' spacing={4}
                sx={{
                    borderBottom: '1px solid #c2c1c1'
                }}
            >
                <Grid item>
                    <NavLink to='/dentist/kham-benh/10/thong-tin-bn' >
                        <Typography className='pt_active'>Thông tin bệnh nhân</Typography>
                    </NavLink>
                </Grid>
                <Grid item>
                    <NavLink to='/dentist/kham-benh/10/lich-su-kham-benh'>
                        <Typography className='pt_active'>Lịch sử khám bệnh</Typography>
                    </NavLink>
                </Grid>
                <Grid item>
                    <NavLink to='/dentist/kham-benh/10/create-dental-care-record'>
                        <Typography className='pt_active'>Dental care record</Typography>
                    </NavLink>
                </Grid>
            </Grid>
            <br />
            <div>
                <Outlet />
            </div>
        </>
    )
}

export default PatientTreatment