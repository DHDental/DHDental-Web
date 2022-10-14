import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { onValue, ref, update } from 'firebase/database';

import Mota from './Mota'
import StartFirebase from '../../../../components/firebaseConfig'
import { useLocation } from 'react-router-dom';
import { CustomBackdrop } from '../../../../components';
import Service from './Service';

const db = StartFirebase()
const NewRecord = () => {
    const location = useLocation()

    const [motaList, setMotaList] = useState([])
    const [dataFirebasePatient, setDataFirebasePatient] = useState([])
    const [openBackdrop, setOpenBackdrop] = useState(false)

    const [serviceList, setServiceList] = useState([])
    const [serviceHoaDon, setServiceHoaDon] = useState([])
    const [taoHoaDon, setTaoHoaDon] = useState('')
    // console.log(motaList);
    useEffect(() => {
        let isMounted = true;
        const dbRef = ref(db)
        setOpenBackdrop(true)
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                if (childSnapshot.key === location?.state?.patient?.key) {
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
        // if (dataFirebasePatient[0]?.data.treatment) {
        //     // console.log('yes');
        //     setServiceList(dataFirebasePatient[0]?.data.treatment)
        //     setTaoHoaDon('daTao')
        //     if (dataFirebasePatient[0]?.data.serviceHoaDon)
        //         setServiceHoaDon(dataFirebasePatient[0]?.data.serviceHoaDon)
        // }

        if (dataFirebasePatient[0]?.data?.record?.motaList) {
            setMotaList(dataFirebasePatient[0]?.data?.record?.motaList)
        }
        if (dataFirebasePatient[0]?.data?.record?.serviceList) {
            setServiceList(dataFirebasePatient[0]?.data?.record?.serviceList)
        }
        if (dataFirebasePatient[0]?.data?.record?.serviceHoaDon) {
            setServiceHoaDon(dataFirebasePatient[0]?.data?.record?.serviceHoaDon)
            setTaoHoaDon('daTao')
        }

    }, [dataFirebasePatient])
    // console.log(serviceList);
    return (
        <>
            <Grid container spacing={1} direction='column'>
                <Grid item> <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>I. Tạo dental care record</Typography></Grid>
                <Mota motaList={motaList} setMotaList={setMotaList} />
                <br />
                <Service serviceList={serviceList} setServiceList={setServiceList}
                    serviceHoaDon={serviceHoaDon} setServiceHoaDon={setServiceHoaDon}
                    taoHoaDon={taoHoaDon} setTaoHoaDon={setTaoHoaDon}
                    dataFirebasePatient={dataFirebasePatient}
                />
            </Grid>
            <CustomBackdrop open={openBackdrop} />
        </>
    )
}

export default NewRecord