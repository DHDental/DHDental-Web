import { Box, Divider, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material'
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

    console.log(dataPatient);

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
                        color: 'blue'

                    }}>MỜI BỆNH NHÂN CÓ SỐ</Typography>

            </Grid>
            <Grid container>
                <Grid xs={5.75}>
                    <Table>
                        <TableHead>
                            <TableCell colSpan={2} align='center' sx={{ color: 'blue', fontSize: '18px' }}>Vào phòng</TableCell>
                            <TableRow>
                                <TableCell>
                                    Số điện thoại
                                </TableCell>
                                <TableCell>
                                    Họ và tên
                                </TableCell>
                            </TableRow>
                        </TableHead>

                    </Table>
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid xs={5.75}>
                    <Table>
                        <TableHead>
                            <TableCell colSpan={2} align='center' sx={{ color: 'blue', fontSize: '18px' }}>Chuẩn bị</TableCell>
                            <TableRow>
                                <TableCell>
                                    Số điện thoại
                                </TableCell>
                                <TableCell>
                                    Họ và tên
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </Grid>
            </Grid>


            {/* <Grid
                container
                alignItems="center"
                justifyContent="center"
                backgroundColor='orange'
            >
                <Box>
                    {dataPatient.map((item, i) => (

                        <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                            {item?.data?.status === 1 ?
                                `${item?.key} - ${item?.data?.name}`
                                : null}
                        </Typography>

                    ))}
                </Box>
            </Grid>
            <Table>
                <TableHead sx={{
                    backgroundColor: 'green',
                }}>
                    <TableRow>
                        <TableCell align='center' sx={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}> STT</TableCell>
                        <TableCell align='center' sx={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}> Bệnh nhân chờ</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataPatient.map((item, i) =>

                    (
                        item?.data.status === 0 ?
                            (<TableRow key={i} >
                                <TableCell
                                    align='center'
                                    sx={{
                                        backgroundColor: i === 0 && '#4c8eec',
                                        fontSize: '18px',
                                        fontWeight: '500'
                                    }}
                                >{item?.key}</TableCell>
                                <TableCell align='center' sx={{

                                    fontSize: '18px',
                                    fontWeight: '500'
                                }}>{item?.data?.name}</TableCell>
                            </TableRow>
                            )
                            : null

                    )

                    )}

                </TableBody>
            </Table> */}
        </Stack >
    )
}

export default WaitingList
