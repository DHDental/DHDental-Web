import { Divider, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'

import StartFirebase from '../../components/firebaseConfig'

const db = StartFirebase()
const WaitingList = () => {
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
        <Stack direction='column'>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
            // backgroundColor='blue'
            >

                <Typography
                    variant='h4'
                    sx={{
                        color: 'blue',
                        // fontWeight: '500'
                    }}>MỜI BỆNH NHÂN CÓ SỐ</Typography>

            </Grid>
            <Grid container >
                <Grid item xs={6} >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2} align='center' sx={{ color: 'blue', fontSize: '18px' }}>Vào phòng khám</TableCell>
                            </TableRow>
                            <TableRow >

                                <TableCell sx={{ fontSize: '17px' }}>
                                    Họ và tên
                                </TableCell>
                                <TableCell sx={{ fontSize: '17px' }}>
                                    Số điện thoại
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataPatient.map((item, i) => (
                                item?.data.status === 1 ?
                                    (<TableRow key={i}>
                                        <TableCell sx={{ fontSize: '16px' }}>
                                            {item?.data.fullName}{item?.data.statusSpecial === 1 && ' (đặt trước)'}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '16px' }}>******{item?.data.sdt.substr(-4)}</TableCell>
                                    </TableRow>) : null
                            ))}
                        </TableBody>
                    </Table>
                </Grid>

                <Divider orientation="vertical" flexItem sx={{ backgroundColor: '#000', height: '90vh' }} />

                <Grid item xs={5.95} >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2} align='center' sx={{ color: 'blue', fontSize: '18px' }}>Chuẩn bị</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontSize: '17px' }}>
                                    Họ và tên
                                </TableCell>
                                <TableCell sx={{ fontSize: '17px' }}>
                                    Số điện thoại
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataPatient.map((item, i) => (
                                (item?.data.status === 0) ?
                                    (<TableRow key={i}>
                                        <TableCell sx={{ fontSize: '16px' }}>{item?.data.fullName}
                                            {item?.data.statusSpecial === 1 && ' (đặt trước)'}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '16px' }}>******{item?.data.sdt.substr(-4)}</TableCell>
                                    </TableRow>) : null
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid >
        </Stack >
    )
}

export default WaitingList
