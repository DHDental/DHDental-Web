import { Card, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { onValue, push, ref, remove, set, update } from 'firebase/database'
import { useEffect, useState } from 'react'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import jwtDecode from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import StartFirebase from '../../components/firebaseConfig'
import CustomDialog from '../../components/CustomDialog';
import { KHAM_BENH } from '../../common/constants/pathConstants';


const db = StartFirebase()
const PatientOn = () => {
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"))
  const dentist = jwtDecode(loginInfo?.token)

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
    // remove(ref(db, user.key))
    // console.log(user);
    if (user?.data?.countRemove == undefined) {
      // console.log(user?.data?.countRemove);
      const dbRef = ref(db)
      const newUser = push(dbRef)
      set(newUser, {
        fullName: user?.data?.fullName,
        sdt: user?.data?.sdt,
        status: 0,
        statusSpecial: user?.data?.statusSpecial,
        timeBooking: user.data?.timeBooking,
        dentistName: user.data?.dentistName,
        dentistPhone: user.data?.dentistPhone,
        room: user.data?.room,
        dentalCareExamReason: user.data?.dentalCareExamReason,
        color: user.data?.color,
        countRemove: 1
      })
      remove(ref(db, user.key))
    } else {
      // console.log(user?.data?.countRemove);
      if (user?.data?.countRemove >= 1) {
        remove(ref(db, user.key))
      } else {
        const dbRef = ref(db)
        const newUser = push(dbRef)
        set(newUser, {
          fullName: user?.data?.fullName,
          sdt: user?.data?.sdt,
          status: 0,
          statusSpecial: user?.data?.statusSpecial,
          timeBooking: user.data?.timeBooking,
          dentistName: user.data?.dentistName,
          dentistPhone: user.data?.dentistPhone,
          room: user.data?.room,
          dentalCareExamReason: user.data?.dentalCareExamReason,
          color: user.data?.color,
          countRemove: (user.data?.countRemove + 1)
        })
        remove(ref(db, user.key))
      }
    }
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
      <Typography variant='subtitle1' sx={{
        color: 'blue',
        fontWeight: '500',
        marginBottom: '51px'
      }}>B???nh nh??n v??o kh??m</Typography>
      <TableContainer component={Paper} square>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>H??? v?? t??n</TableCell>
              <TableCell>S??? ??i???n tho???i</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPatient.map((item, i) => (
              (item?.data.status === 1
                && item?.data.room === dentist.DentistRoom
              ) ?
                (

                  <TableRow key={i}>

                    <TableCell >
                      <NavLink to={`${KHAM_BENH}/${item?.data.sdt}`}
                        style={{
                          color: 'blue',
                          fontWeight: '500',
                          textDecoration: 'underline',
                        }}
                        state={{ dentalCareExamReason: item?.data.dentalCareExamReason, patient: item }}>
                        {item?.data.fullName}
                      </NavLink>
                    </TableCell>

                    <TableCell >{item?.data.sdt}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => {
                        setName(item?.data.fullName)
                        setUser(item)
                        setOpen(true)
                      }}>
                        <RemoveCircleOutlineIcon
                          sx={{ color: 'red' }}
                        /></IconButton>
                    </TableCell>
                  </TableRow>

                ) : null
            ))}

          </TableBody>
        </Table>
      </TableContainer>
      <CustomDialog open={open} handleClose={handleClose} handleYes={handleYes}
        text={`B???n ch???c ch???n mu???n x??a b???nh nh??n ${name} kh???i v??o kh??m`}
      // text={<span>B???n ch???c ch???n mu???n  x??a b???nh nh??n
      //   <span style={{ color: 'red' }}> {name} </span>
      //   kh???i v??o kh??m
      // </span>}
      />
    </>
  )
}

export default PatientOn