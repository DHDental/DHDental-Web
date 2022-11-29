import StartFirebase from '../../components/firebaseConfig'
import { onValue, ref, remove, update } from 'firebase/database';
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
        let count = 0;
        dataFirebasePatient[0]?.data?.record?.serviceHoaDon?.forEach((service, i) => {
            // console.log(service?.statusThanhToan);
            if (service?.statusThanhToan != 'roi' && service?.statusThanhToan != 'cancel') {
                count = 1
            }
        })
        if (count == 0) {
            if (dataFirebasePatient[0]?.data?.record?.paymentConfirmation == 0) {
                update(ref(db, `${dataFirebasePatient[0]?.key}/record`), {
                    paymentConfirmation: 1
                })
                update(ref(db, `${dataFirebasePatient[0]?.key}`), {
                    color: 'ye'
                })
            }
        }
        if (dataFirebasePatient?.length != 0) {
            if (dataFirebasePatient[0]?.data?.record) {
                if (!dataFirebasePatient[0]?.data?.record?.serviceHoaDon && dataFirebasePatient[0]?.data?.record?.paymentConfirmation != undefined) {
                    remove(ref(db, `${dataFirebasePatient[0]?.key}`))
                }
            }

        }
    }, [dataFirebasePatient])
    console.log(dataFirebasePatient[0]?.data?.record?.serviceHoaDon);
    console.log(dataFirebasePatient);
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