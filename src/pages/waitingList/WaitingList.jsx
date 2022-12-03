import { Divider, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'

import StartFirebase from '../../components/firebaseConfig'

const db = StartFirebase()
const WaitingList = () => {
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
                <Grid item xs={5} >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={3} align='center' sx={{ color: 'blue', fontSize: '18px' }}>Vào phòng khám</TableCell>
                            </TableRow>
                            <TableRow >

                                <TableCell sx={{ fontSize: '17px' }}>
                                    Họ và tên
                                </TableCell>
                                <TableCell sx={{ fontSize: '17px' }}>
                                    Số điện thoại
                                </TableCell>
                                <TableCell align='center' sx={{ fontSize: '17px' }}>
                                    Phòng số
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataPatient.map((item, i) => (
                                item?.data.status === 1 ?
                                    (<TableRow key={i}>
                                        <TableCell sx={{ fontSize: '16px' }}>
                                            {item?.data.fullName}{item?.data.statusSpecial === 1 && ` (đặt trước)`}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '16px' }}>******{item?.data.sdt.substr(-4)}</TableCell>
                                        <TableCell align='center' sx={{ fontSize: '16px' }}>{item?.data.room}</TableCell>
                                    </TableRow>) : null
                            ))}
                        </TableBody>
                    </Table>
                </Grid>

                <Divider orientation="vertical" flexItem sx={{ backgroundColor: '#000', height: '94vh' }} />

                <Grid container item xs={6.95} sx={{ borderLeft: '1px black solid' }}>
                    <Grid item xs={6} sx={{ borderRight: '1px black solid' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={3} align='center' sx={{ color: 'blue', fontSize: '18px' }}>Chuẩn bị vào khám nha sĩ Vũ Quốc Bảo</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '17px' }}>
                                        Họ và tên
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '17px' }}>
                                        Số điện thoại
                                    </TableCell>
                                    <TableCell>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataPatient.map((item, i) => (
                                    (item?.data.status === 0 && item?.data.dentistName == 'Vũ Quốc Bảo') ?
                                        (<TableRow key={i}>
                                            <TableCell sx={{ fontSize: '16px' }}>{item?.data.fullName}
                                                {item?.data.statusSpecial === 1 && ` (đặt trước)`}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '16px' }}>******{item?.data.sdt.substr(-4)}</TableCell>
                                            {item?.data?.color == 'yd' ?
                                                <TableCell sx={{ fontSize: '16px' }}>
                                                    đang thanh toán
                                                </TableCell> :
                                                <TableCell>
                                                </TableCell>}
                                        </TableRow>) : null
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item xs={6}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={3} align='center' sx={{ color: 'blue', fontSize: '18px' }}>Chuẩn bị vào khám nha sĩ Trần Thị Hà My</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '17px' }}>
                                        Họ và tên
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '17px' }}>
                                        Số điện thoại
                                    </TableCell>
                                    <TableCell>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataPatient.map((item, i) => (
                                    (item?.data.status === 0 && item?.data.dentistName == 'Trần Thị Hà My') ?
                                        (<TableRow key={i}>
                                            <TableCell sx={{ fontSize: '16px' }}>{item?.data.fullName}
                                                {item?.data.statusSpecial === 1 && ` (đặt trước)`}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '16px' }}>******{item?.data.sdt.substr(-4)}</TableCell>
                                            {item?.data?.color == 'yd' ?
                                                <TableCell sx={{ fontSize: '16px' }}>
                                                    đang thanh toán
                                                </TableCell> :
                                                <TableCell>
                                                </TableCell>}
                                        </TableRow>) : null
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Grid >
        </Stack >
    )
}

export default WaitingList
