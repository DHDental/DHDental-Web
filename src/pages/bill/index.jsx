import StartFirebase from '../../components/firebaseConfig'
import { onValue, ref, update } from 'firebase/database';
import PatientInformation from './PatientInformation';
import { HoaDon } from './hoaDon';
import { useEffect, useState } from 'react';
import { CustomBackdrop } from '../../components';
import { useParams } from 'react-router-dom';

const db = StartFirebase()
const Bill = () => {
    const param = useParams()

    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [dataFirebasePatient, setDataFirebasePatient] = useState([])

    useEffect(() => {
        let isMounted = true;
        const dbRef = ref(db)
        setOpenBackdrop(true)
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                if (childSnapshot.val().sdt == param?.id) {
                    let keyName = childSnapshot.key;
                    let data = childSnapshot.val();
                    records.push({ "key": keyName, "data": data })
                }
            })
            isMounted && setDataFirebasePatient(records)
        })
        setOpenBackdrop(false)
        return () => {
            isMounted = false;
        }
    }, [])
    useEffect(() => {
        // console.log('change');
    }, [dataFirebasePatient])
    // console.log(dataFirebasePatient);
    return (
        // <button onClick={handleThanhToan}>thanh toán</button>
        <>
            <PatientInformation />
            <br />
            <br />
            <HoaDon dataFirebasePatient={dataFirebasePatient} />
            <CustomBackdrop open={openBackdrop} />
        </>
    )
}

export default Bill