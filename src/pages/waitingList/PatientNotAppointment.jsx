import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { onValue, ref, update } from 'firebase/database'
import { useEffect, useState } from 'react'
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import jwtDecode from 'jwt-decode';

import StartFirebase from '../../components/firebaseConfig'
import CustomDialog from '../../components/CustomDialog';

const db = StartFirebase()
const PatientNotAppointment = () => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"))
    const dentist = jwtDecode(loginInfo?.token)
    const [dataPatient, setDataPatient] = useState([])
    const [open, setOpen] = useState(false);
    const [name, setName] = useState()
    const [user, setUser] = useState()

    const [an, setAn] = useState(false)

    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpen(false);
    };
    const handleYes = () => {
        update(ref(db, user.key), {
            status: 1,
            room: dentist.DentistRoom,
            test: '0'
        })
        setOpen(false);
    }
    useEffect(() => {
        let isMounted = true;

        const dbRef = ref(db)
        onValue(dbRef, (snapshot) => {
            let records = [];
            let flag = false;
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "key": keyName, "data": data })
                if (childSnapshot.val().status == '1' && childSnapshot.val().dentistPhone == dentist?.PhoneNumber) {
                    flag = true
                }
            })
            isMounted && setDataPatient(records)
            isMounted && setAn(flag)
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
                            <TableCell>Giờ check in</TableCell>
                            <TableCell>Vào khám</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataPatient.map((item, i) => (
                            (item?.data.status === 0 && item?.data.statusSpecial === 0 && (item?.data.room == dentist?.DentistRoom ||
                                item?.data.dentistName == dentist?.fullName)) ?
                                (<TableRow key={i} >
                                    <TableCell
                                        sx={{
                                            color: item?.data?.color == 'yd' || item?.data?.color == 'ye' ? 'orange' : '#000'
                                        }}
                                    >
                                        {item?.data.fullName}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: item?.data?.color == 'yd' || item?.data?.color == 'ye' ? 'orange' : '#000'
                                        }}
                                    >
                                        {item?.data.sdt}
                                    </TableCell>
                                    <TableCell sx={{
                                        color: item?.data?.color == 'yd' || item?.data?.color == 'ye' ? 'orange' : '#000'
                                    }}>
                                        {item?.data?.timeBooking}
                                    </TableCell>
                                    <TableCell>
                                        {item?.data?.color == 'yd' ? null :
                                            <IconButton
                                                disabled={an}
                                                onClick={() => {
                                                    setName(item?.data.fullName)
                                                    setUser(item)
                                                    setOpen(true)
                                                }}>
                                                <ReplyAllIcon sx={{ color: !an ? 'orange' : '#e0dede' }} />
                                            </IconButton>
                                        }
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

export default PatientNotAppointment