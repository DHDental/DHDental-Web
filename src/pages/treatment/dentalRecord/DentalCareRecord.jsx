
import { useEffect, useState } from 'react'
import CreateNewRecord from './CreateNewRecord'
import PatientInfoDR from './PatientInfoDR'
import ServiceBill from './ServiceBill'
import NewRecord from './newRecord'
import Record from './taiKham'
import { useParams } from 'react-router-dom'
import { axiosPublic } from '../../../api/axiosInstance'
import { GETINFOEXAMINATE } from '../../../common/constants/apiConstants'
import { CustomBackdrop } from '../../../components'

const DentalCareRecord = () => {
    // const location = useLocation();
    // console.log(location?.state?.dentalCareExamReason);

    // console.log(location?.state?.patient);
    const param = useParams()
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [patientInfo, setPatientInfo] = useState()
    // console.log(patientInfo?.billDetailList);
    useEffect(() => {
        let isMounted = true;
        const getPatientInfo = async () => {
            try {
                setOpenBackdrop(true)
                const response = await axiosPublic.post(GETINFOEXAMINATE, {
                    "phoneNumber": param.id
                })
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
    // console.log(patientInfo);
    return (
        <>
            {/* <Grid container direction='column' spacing={2}> */}
            {/* <Grid container item> */}
            <PatientInfoDR patientInfo={patientInfo} />
            {/* </Grid> */}
            <br />
            {/* <Grid container item> */}
            {patientInfo?.billDetailList?.length === 0 ?
                <NewRecord />
                : <Record bill={patientInfo?.billDetailList} />
            }


            {/* </Grid> */}
            {/* <Grid container item>
                    <CreateRecord />
                </Grid> */}
            {/* </Grid> */}
            <CustomBackdrop open={openBackdrop} />
        </>
    )
}

export default DentalCareRecord