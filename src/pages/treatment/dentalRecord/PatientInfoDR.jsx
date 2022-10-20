import { async } from '@firebase/util';
import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { axiosPublic } from '../../../api/axiosInstance';
import { GET_USER_INFO } from '../../../common/constants/apiConstants';
import { CustomBackdrop } from '../../../components';
import { caculateAgeFromBirth } from '../../../common/utils/caculate'

const PatientInfoDR = ({ patientInfo }) => {
    const location = useLocation();
    // console.log(location);
    // const param = useParams()
    // console.log(param.id);

    // const [patientInfo, setPatientInfo] = useState()
    const [openBackdrop, setOpenBackdrop] = useState(false)

    // useEffect(() => {
    //     let isMounted = true;
    //     const getPatientInfo = async () => {
    //         try {
    //             setOpenBackdrop(true)
    //             const response = await axiosPublic.post(GET_USER_INFO, {
    //                 "keySearch": param.id
    //             })
    //             isMounted && setPatientInfo(response.data[0])
    //             setOpenBackdrop(false)
    //         } catch (error) {
    //             setOpenBackdrop(false)
    //             console.log(error);
    //         }
    //     }
    //     getPatientInfo()
    //     return () => {
    //         isMounted = false;
    //     }
    // }, [param])
    return (
        <>
            <Grid container item spacing={1} direction='row'>
                <Grid item sm={2}>
                    <Typography>Bệnh nhân</Typography>
                </Grid>
                <Grid item sm={5}>
                    {/* <Typography>{patientInfo?.fullName}</Typography> */}
                    <Typography>{location?.state?.patient?.data?.fullName}</Typography>
                </Grid>
            </Grid>
            <Grid container item spacing={1} direction='row'>
                <Grid item sm={2}>
                    <Typography>Tuổi</Typography>
                </Grid>
                <Grid item sm={5}>
                    <Typography>{patientInfo ? caculateAgeFromBirth(patientInfo?.dateOfBirth) : null}</Typography>
                </Grid>
            </Grid>
            <Grid container item spacing={1} direction='row'>
                <Grid item sm={2}>
                    <Typography>Lí do đến khám</Typography>
                </Grid>
                <Grid item sm={5}>
                    <Typography>{location?.state?.dentalCareExamReason}</Typography>
                </Grid>
            </Grid>
            <Grid container item spacing={1} direction='row'>
                <Grid item sm={2}>
                    <Typography>Lịch sử khám bệnh</Typography>
                </Grid>
                <Grid item sm={5}>
                    <Typography></Typography>
                </Grid>
            </Grid>
            {/* <CustomBackdrop open={openBackdrop} /> */}
        </>
    )
}

export default PatientInfoDR