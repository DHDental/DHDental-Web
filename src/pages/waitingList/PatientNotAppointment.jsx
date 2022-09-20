import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

import StartFirebase from '../../components/firebaseConfig'

const db = StartFirebase()
const PatientNotAppointment = () => {
    const [dataPatient, setDataPatient] = useState([])

    useEffect(() => {
        let isMounted = true;

        const dbRef = ref(db)
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "key": keyName, "data": data })
            })
            isMounted && setDataPatient(records)

        })
        return () => {
            isMounted = false
        }
    }, [])
    return (
        <>
            <Typography variant='subtitle2' sx={{
                color: 'blue',
                fontWeight: '400',
                marginBottom: '15px'
            }}>Bệnh nhân không đặt lịch trước</Typography>
            <TableContainer component={Paper} square>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Vào khám</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataPatient.map((item, i) => (
                            (item?.data.status === 0 && item?.data.statusSpecial === 0) ?
                                (<TableRow key={i}>
                                    <TableCell>{item?.data.fullName}</TableCell>
                                    <TableCell>{item?.data.sdt}</TableCell>
                                    <TableCell><IconButton>
                                        <ReplyAllIcon sx={{ color: 'orange' }} />
                                    </IconButton></TableCell>
                                </TableRow>) : null
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default PatientNotAppointment