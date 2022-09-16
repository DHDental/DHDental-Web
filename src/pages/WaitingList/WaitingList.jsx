import StartFirebase from '../../components/firebaseConfig'
import { ref, onValue } from 'firebase/database'
import { Box, debounce, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react'
import { fontSize, fontWeight } from '@mui/system'

const db = StartFirebase()
const WaitingList = () => {
    var w = window.innerWidth / 18.5;
    console.log(w);
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
                backgroundColor='blue'
            >
                <Typography
                    variant='h4'
                    sx={{
                        color: 'white'

                    }}>Phòng khám nha khoa Đức Hạnh</Typography>
            </Grid>
            <Grid
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
                                        backgroundColor: i === 1 && '#4c8eec',
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
            </Table>
        </Stack >
    )
}

export default WaitingList