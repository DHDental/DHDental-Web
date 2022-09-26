import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { onValue, ref, update } from 'firebase/database'
import { useEffect, useState } from 'react'
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

import StartFirebase from '../../components/firebaseConfig'
import CustomDialog from '../../components/CustomDialog';
import jwtDecode from 'jwt-decode';

const db = StartFirebase()

const PatientAppointment = () => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"))
    const dentist = jwtDecode(loginInfo?.token)

    const [open, setOpen] = useState(false);
    const [dataPatient, setDataPatient] = useState([])
    const [name, setName] = useState()
    const [user, setUser] = useState()

    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpen(false);
    };
    const handleYes = () => {
        update(ref(db, user.key), {
            status: 1,
            room: '01',
        })
        setOpen(false);
    }
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
            // onValue(dbRef)
        }
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
                            (item?.data.status === 0 && item?.data.statusSpecial === 1 && item?.data.dentistPhone === dentist.sub) ?
                                (<TableRow key={i}>
                                    <TableCell>{item?.data.fullName}</TableCell>
                                    <TableCell>{item?.data.sdt}</TableCell>
                                    <TableCell>{item?.data.timeBooking}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            setName(item?.data.fullName)
                                            setUser(item)
                                            setOpen(true)
                                        }}>
                                            <ReplyAllIcon sx={{ color: 'orange' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>) : null
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
            <CustomDialog open={open} handleClose={handleClose} handleYes={handleYes}
                text={`Bạn chắc chắn muốn chuyển bệnh nhân ${name} vào khám`}
            />
        </>
    )
}

export default PatientAppointment