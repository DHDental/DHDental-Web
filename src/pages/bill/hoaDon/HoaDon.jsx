import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { ref, update } from 'firebase/database'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosPublic } from '../../../api/axiosInstance'
import { STAFF_BILL } from '../../../common/constants/pathConstants'
import { CustomBackdrop, CustomSnackbar } from '../../../components'

import StartFirebase from '../../../components/firebaseConfig'
import BillDetail from './BillDetail'

const db = StartFirebase()

const HoaDon = ({ dataFirebasePatient }) => {
    const param = useParams()

    const [bill, setBill] = useState()
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [reload, setReload] = useState(false)

    const [openSnackbar, setOpenSnackbar] = useState();
    const [textSnackbar, setTextSnackbar] = useState('');
    const [severity, setSeverity] = useState('success');

    // console.log(dataFirebasePatient);
    const handleThanhToan = () => {
        // check xem có có dataFirebasePatient hay ko, có payment Confirmation hay ko 
        // thì mới đụng tới firebase, không thì chỉ gọi api thanh toán thôi
        if (dataFirebasePatient[0]?.key && dataFirebasePatient[0]?.data?.record?.paymentConfirmation == 0) {
            update(ref(db, '-NE0UKLIS4i7uY3mlPAQ/record'), {
                paymentConfirmation: 1,
            })
            console.log('ok');
        } else {
            console.log('nok');
        }
    }

    useEffect(() => {
        // console.log('load');
        let isMounted = true;
        const getBill = async () => {
            try {
                setOpenBackdrop(true)
                const response = await axiosPublic.post(STAFF_BILL, {
                    "phoneNumber": param.id,
                    "type": "W"
                })
                isMounted && setBill(response.data)
                setOpenBackdrop(false)
            } catch (error) {
                setOpenBackdrop(false)
                console.log(error);
            }
        }
        getBill()
        return () => {
            isMounted = false;
        }
    }, [reload])
    return (
        <>
            <Grid container spacing={1} direction='column'>
                {
                    bill?.map((item, i) => (
                        <BillDetail
                            key={i}
                            item={item}
                            dataFirebasePatient={dataFirebasePatient}
                            setReload={setReload}
                            reload={reload}
                            setTextSnackbar={setTextSnackbar}
                            setSeverity={setSeverity}
                            setOpenSnackbar={setOpenSnackbar}
                            setOpenBackdrop={setOpenBackdrop}
                        />
                    ))
                }
                {bill?.length === 0 &&
                    <Grid item>
                        Không có hóa đơn cần thanh toán
                    </Grid>
                }
            </Grid>
            <CustomBackdrop open={openBackdrop} />
            <CustomSnackbar handleClose={() => {
                setOpenSnackbar(false)
            }}
                open={openSnackbar}
                text={textSnackbar}
                severity={severity}
                variant='standard'
                vertical='top'
                horizontal='right'
            />
        </>
    )
}

export default HoaDon