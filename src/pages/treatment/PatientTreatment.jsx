import { Grid, Typography } from '@mui/material';
import { NavLink, Outlet, useParams } from 'react-router-dom';

import '../../style/patientTreatment.css';
import { KHAM_BENH } from '../../common/constants/pathConstants';

const PatientTreatment = () => {
    let params = useParams();
    return (
        <>
            <Grid container direction='row' spacing={4}
                sx={{
                    borderBottom: '1px solid #c2c1c1'
                }}
            >
                <Grid item>
                    {/* <NavLink to='/dentist/kham-benh/10/thong-tin-bn' > */}
                    <NavLink to={`${KHAM_BENH}/${params?.id}/thong-tin-bn`} >
                        <Typography className='pt_active'>Thông tin bệnh nhân</Typography>
                    </NavLink>
                </Grid>
                <Grid item>
                    <NavLink to={`${KHAM_BENH}/${params?.id}/lich-su-kham-benh`}>
                        <Typography className='pt_active'>Lịch sử khám bệnh</Typography>
                    </NavLink>
                </Grid>
                <Grid item>
                    <NavLink to={`${KHAM_BENH}/${params?.id}/tao-dental-care-record`}>
                        <Typography className='pt_active'>Khám bệnh</Typography>
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