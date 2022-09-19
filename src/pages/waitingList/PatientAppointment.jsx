import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

import StartFirebase from '../../components/firebaseConfig'

const db = StartFirebase()

const PatientAppointment = () => {
    const [dataPatient, setDataPatient] = useState([])

    useEffect(() => {
        const dbRef = ref(db)
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "key": keyName, "data": data })
            })
            setDataPatient(records)

        })

    }, [])
    return (
        <>

            <Typography variant='subtitle2' sx={{
                color: 'blue',
                fontWeight: '400',
                marginBottom: '15px'
            }}>Bệnh nhân đặt lịch trước</Typography>
            <TableContainer component={Paper} square>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Giờ hẹn</TableCell>
                            <TableCell>Vào khám</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataPatient.map((item, i) => (
                            (item?.data.status === 0 && item?.data.statusSpecial === 1) ?
                                (<TableRow key={i}>
                                    <TableCell>{item?.data.fullName}</TableCell>
                                    <TableCell>{item?.data.sdt}</TableCell>
                                    <TableCell>{item?.data.timeBooking}</TableCell>
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

export default PatientAppointment