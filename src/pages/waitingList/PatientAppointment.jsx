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
            // onValue(dbRef)
        }
    }, [])
    return (
        <>

            <Typography variant='subtitle2' sx={{
                color: 'blue',
                fontWeight: '400',
                marginBottom: '15px'
            }}>B???nh nh??n ?????t l???ch tr?????c</Typography>
            <TableContainer component={Paper} square>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>H??? v?? t??n</TableCell>
                            <TableCell>S??? ??i???n tho???i</TableCell>
                            <TableCell>Gi??? h???n</TableCell>
                            <TableCell>V??o kh??m</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataPatient.map((item, i) => (
                            (item?.data.status === 0 && item?.data.statusSpecial === 1 && item?.data.dentistPhone === dentist.PhoneNumber) ?
                                (<TableRow key={i}>
                                    <TableCell
                                        sx={{
                                            color: item?.data?.color == 'yd' || item?.data?.color == 'ye' ? 'orange' : '#000'
                                        }}
                                    >{item?.data.fullName}</TableCell>
                                    <TableCell
                                        sx={{
                                            color: item?.data?.color == 'yd' || item?.data?.color == 'ye' ? 'orange' : '#000'
                                        }}
                                    >{item?.data.sdt}</TableCell>
                                    <TableCell
                                        sx={{
                                            color: item?.data?.color == 'yd' || item?.data?.color == 'ye' ? 'orange' : '#000'
                                        }}
                                    >{item?.data.timeBooking}</TableCell>
                                    <TableCell>
                                        {item?.data?.color == 'yd' ? null :
                                            <IconButton
                                                disabled={an}
                                                // disableRipple={true}
                                                onClick={() => {
                                                    setName(item?.data.fullName)
                                                    setUser(item)
                                                    setOpen(true)
                                                }}>
                                                <ReplyAllIcon sx={{
                                                    color: !an ? 'orange' : '#e0dede',
                                                }} />
                                            </IconButton>
                                        }
                                    </TableCell>
                                </TableRow>) : null
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
            <CustomDialog open={open} handleClose={handleClose} handleYes={handleYes}
                text={`B???n ch???c ch???n mu???n chuy???n b???nh nh??n ${name} v??o kh??m`}
            />
        </>
    )
}

export default PatientAppointment