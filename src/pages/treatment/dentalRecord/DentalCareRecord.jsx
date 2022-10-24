
import { useEffect, useState } from 'react'
import CreateNewRecord from './CreateNewRecord'
import PatientInfoDR from './PatientInfoDR'
import ServiceBill from './ServiceBill'
import NewRecord from './newRecord'
import Record from './taiKham.jsx'
import { useParams } from 'react-router-dom'
import { axiosPublic } from '../../../api/axiosInstance'
import { GETINFOEXAMINATE } from '../../../common/constants/apiConstants'
import { CustomBackdrop } from '../../../components'

// const bill = [
//     {
//         'billId_serviceId': '01',
//         "startDay": '30/09/2022',
//         'services': [
//             {
//                 "id": "TR1",
//                 "serviceName": "Dịch vụ trám răng",
//                 "dacTa": 'r3',
//                 "soLuong": '1',
//                 "status": "not done",
//                 "billDetailId": '1',
//                 "billStatus": 'In Process',
//             },
//             // {
//             //     "serviceName": "Dịch vụ 2",
//             //     "status": "not done"
//             // }
//         ],
//         'record': [
//             {
//                 "recordName": 'record 1',
//             }

//         ]
//     },
//     {
//         'billId_serviceId': '02',
//         "startDay": '22/01/2022',
//         'services': [
//             {
//                 "id": "TR2",
//                 "serviceName": "Dịch vụ trồng răng",
//                 "dacTa": 'r3',
//                 "soLuong": '1',
//                 "status": "not done",
//                 "billDetailId": '2',
//                 "billStatus": 'Paid',
//             },
//             // {
//             //     "serviceName": "Dịch vụ 2",
//             //     "status": "not done"
//             // }
//         ],
//         'record': [
//             {
//                 "recordName": 'record 1'
//             }
//         ]
//     }
// ]

const DentalCareRecord = () => {
    // const location = useLocation();
    // console.log(location?.state?.dentalCareExamReason);

    // console.log(location?.state?.patient);
    const param = useParams()
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [patientInfo, setPatientInfo] = useState()
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
            {patientInfo?.billDetailList?.length == 0 ?
                // <CreateNewRecord />
                <NewRecord />
                // : <ServiceBill />
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