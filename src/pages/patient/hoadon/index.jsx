import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PatientInformation from './PatientInformation';
import { HoaDon } from './allBill';
import { CustomBackdrop } from '../../../components';



const AllBill = () => {
    const param = useParams()

    const [openBackdrop, setOpenBackdrop] = useState(false)




    // console.log(dataFirebasePatient);
    return (
        // <button onClick={handleThanhToan}>thanh toán</button>
        <>
            <PatientInformation />
            <br />
            <br />
            <HoaDon />
            <CustomBackdrop open={openBackdrop} />
        </>
    )
}

export default AllBill