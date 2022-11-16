import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { axiosPrivate } from '../../../api/axiosInstance'
import { GET_USER_INFO } from '../../../common/constants/apiConstants'
import { CustomBackdrop } from '../../../components'

const PatientInformation = () => {
    const param = useParams()

    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [patientInfo, setPatientInfo] = useState([])

    useEffect(() => {
        let isMounted = true;
        const getPatientInfo = async () => {
            try {
                setOpenBackdrop(true)
                const response = await axiosPrivate.post(GET_USER_INFO, {
                    "keySearch": param.id
                })
                // console.log(response.data);
                isMounted && setPatientInfo(response.data)
                setOpenBackdrop(false)
            } catch (error) {
                setOpenBackdrop(false)
                console.log(error);
            }
        }
        getPatientInfo()
        return () => {
            isMounted = false;
        }
    }, [param])
    // console.log(patientInfo?.firstName);
    return (
        <>
            <Grid container spacing={1} direction='column'>
                <Grid container item direction='row' spacing={2}>
                    <Grid item xs={1.5}>
                        <Typography>Bệnh nhân</Typography>
                    </Grid>
                    <Grid item >
                        <Typography>
                            {patientInfo[0] ?
                                patientInfo[0]?.lastName + ' ' + patientInfo[0]?.middleName + ' ' + patientInfo[0]?.firstName
                                : null
                            }
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item direction='row' spacing={2}>
                    <Grid item xs={1.5}>
                        <Typography>Số điện thoại</Typography>
                    </Grid>
                    <Grid item >
                        <Typography>
                            {patientInfo[0] ?
                                patientInfo[0]?.phoneNumber
                                : null
                            }
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item direction='row' spacing={2}>
                    <Grid item xs={1.5}>
                        <Typography>Địa chỉ</Typography>
                    </Grid>
                    <Grid item >
                        <Typography>
                            {patientInfo[0] ?
                                patientInfo[0]?.address
                                : null
                            }
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <CustomBackdrop open={openBackdrop} />
        </>
    )
}

export default PatientInformation