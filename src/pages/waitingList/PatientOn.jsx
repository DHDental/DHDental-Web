import { Card, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import StartFirebase from '../../components/firebaseConfig'

const db = StartFirebase()
const PatientOn = () => {
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
      <Typography variant='subtitle1' sx={{
        color: 'blue',
        fontWeight: '500',
        marginBottom: '51px'
      }}>Bệnh nhân vào khám</Typography>
      <TableContainer component={Paper} square>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPatient.map((item, i) => (
              item?.data.status === 1 ?
                (<TableRow key={i}>
                  <TableCell>{item?.data.fullName}</TableCell>
                  <TableCell>{item?.data.sdt}</TableCell>
                  <TableCell><IconButton><RemoveCircleOutlineIcon
                    sx={{ color: 'red' }}
                  /></IconButton></TableCell>
                </TableRow>) : null
            ))}

          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default PatientOn