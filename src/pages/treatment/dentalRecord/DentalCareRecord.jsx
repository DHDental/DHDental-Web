
import { useEffect } from 'react'
import CreateNewRecord from './CreateNewRecord'
import PatientInfoDR from './PatientInfoDR'
import ServiceBill from './ServiceBill'

const bill = [
    // {
    //     'billId_serviceId': '01',
    //     "startDay": '30/09/2022',
    //     'services': [
    //         {
    //             "serviceName": "Dịch vụ trám răng",
    //             "status": "not done"
    //         },
    //         // {
    //         //     "serviceName": "Dịch vụ 2",
    //         //     "status": "not done"
    //         // }
    //     ],
    //     'record': [
    //         {
    //             "recordName": 'record 1',
    //         }

    //     ]
    // },
    // {
    //     'billId_serviceId': '02',
    //     "startDay": '22/01/2022',
    //     'services': [
    //         {
    //             "serviceName": "Dịch vụ trồng răng",
    //             "status": "not done"
    //         },
    //         // {
    //         //     "serviceName": "Dịch vụ 2",
    //         //     "status": "not done"
    //         // }
    //     ],
    //     'record': [
    //         {
    //             "recordName": 'record 1'
    //         }
    //     ]
    // }
]

const DentalCareRecord = () => {
    // const location = useLocation();
    // console.log(location?.state?.dentalCareExamReason);

    // console.log(location?.state?.patient);

    return (
        <>
            {/* <Grid container direction='column' spacing={2}> */}
            {/* <Grid container item> */}
            <PatientInfoDR />
            {/* </Grid> */}
            <br />
            {/* <Grid container item> */}
            {bill.length === 0 ? <CreateNewRecord /> : <ServiceBill />}


            {/* </Grid> */}
            {/* <Grid container item>
                    <CreateRecord />
                </Grid> */}
            {/* </Grid> */}
        </>
    )
}

export default DentalCareRecord