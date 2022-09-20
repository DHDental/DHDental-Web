import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { onValue, ref, update } from 'firebase/database'
import { useEffect, useState } from 'react'
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

import StartFirebase from '../../components/firebaseConfig'
import CustomDialog from '../../components/CustomDialog';

const db = StartFirebase()
const PatientNotAppointment = () => {
    const [dataPatient, setDataPatient] = useState([])
    const [open, setOpen] = useState(false);
    const [name, setName] = useState()
    const [user, setUser] = useState()

    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpen(false);
    };
    const handleYes = () => {
        update(ref(db, user.key), {
            status: 1
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

export default PatientNotAppointment