import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { TEST_BOOKING } from '../../common/constants/apiConstants'
import { axiosPublic } from '../../api/axiosInstance'
import { push, ref, set } from 'firebase/database'
import StartFirebase from '../../components/firebaseConfig'

const db = StartFirebase()
const TestDemo = () => {
    const [result, setResult] = useState()
    const [action, setAction] = useState('')
    const [loading, setLoading] = useState(false)
    const handleBooking = () => {
        setAction('Test nhiều bệnh nhân đặt lịch khám bệnh')
        const getResult = async () => {
            try {
                setLoading(true)
                setResult()
                const response = await axiosPublic.post(TEST_BOOKING)
                // console.log(response.data);
                setResult(response.data.message)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error);
                console.log(error.response.data.message);
                setResult(error.response.data.message)
            }
        }
        getResult()
    }
    const handleVanLai = () => {
        setAction('Test nhiều bệnh nhân vãn lai đăng kí khám bệnh')
        setResult()
        const list = [
            {
                fullName: 'Nguyễn Xuân Khánh Hòa',
                sdt: '0334942928',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh test',
                color: 'b'

            },
            {
                fullName: 'Nguyễn Lan',
                sdt: '1234567898',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh test 1',
                color: 'b'
            },
        ]
        setLoading(true)
        list.forEach((item) => {
            const dbRef1 = ref(db)
            const newUser = push(dbRef1)
            set(newUser, item)
        })
        setLoading(false)
        setResult('Đăng kí khám bệnh cho 10 bệnh nhân vãn lai thành công')
    }
    return (
        <>
            <Grid container direction={'row'}>
                <Grid item xs={5}>
                    <Box sx={{ margin: '15px' }}>
                        <Button
                            size='medium'
                            variant='contained'
                            onClick={handleBooking}
                            disableElevation
                            sx={{ marginBottom: '15px' }}
                        >Test nhiều bệnh nhân đặt lịch khám bệnh
                        </Button>

                        <Button
                            size='medium'
                            variant='contained'
                            disableElevation
                            onClick={handleVanLai}
                        >Test nhiều bệnh nhân vãn lai đăng kí khám bệnh
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={7} sx={{ backgroundColor: '#e8f0fe', height: '80vh' }}>
                    <Box sx={{ margin: '15px 15px' }}>
                        <div style={{ borderBottom: '1px solid black', marginBottom: '15px' }}>
                            <Typography>Action: {action}</Typography>
                        </div>
                        <div style={{ justifyContent: 'center' }}>
                            {loading == true ?
                                <CircularProgress size={20} /> :
                                result}
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default TestDemo