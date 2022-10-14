import StartFirebase from '../../components/firebaseConfig'
import { onValue, ref, update } from 'firebase/database';
import PatientInfomation from './PatientInfomation';
import HoaDon from './HoaDon';
import { useEffect, useState } from 'react';
import { CustomBackdrop } from '../../components';

const db = StartFirebase()
const Bill = () => {
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [dataFirebasePatient, setDataFirebasePatient] = useState([])

    useEffect(() => {
        let isMounted = true;
        const dbRef = ref(db)
        setOpenBackdrop(true)
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                if (childSnapshot.val().sdt === '0334942928') {
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
    // console.log(dataFirebasePatient);
    return (
        // <button onClick={handleThanhToan}>thanh toán</button>
        <>
            <PatientInfomation />
            <br />
            <br />
            <HoaDon dataFirebasePatient={dataFirebasePatient} />
            <CustomBackdrop open={openBackdrop} />
        </>
    )
}

export default Bill