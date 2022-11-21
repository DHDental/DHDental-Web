import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { TEST_BOOKING } from '../../common/constants/apiConstants'
import { axiosPublic } from '../../api/axiosInstance'
import { push, ref, set } from 'firebase/database'
import StartFirebase from '../../components/firebaseConfig'

const db = StartFirebase()
const TestDemo = () => {
    const [result, setResult] = useState()
    const [resultSDT, setResultSDT] = useState()
    const [action, setAction] = useState('')
    const [loading, setLoading] = useState(false)
    const handleBooking = () => {
        setAction('Test nhiều bệnh nhân đặt lịch khám bệnh')
        const getResult = async () => {
            try {
                setLoading(true)
                setResult()
                setResultSDT()
                const response = await axiosPublic.post(TEST_BOOKING)
                // console.log(response.data);
                setResult(response.data.message)
                setResultSDT(response.data.listPhone)
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
        setAction('Test đăng kí khám bệnh cho nhiều bệnh nhân vãn lai')
        setResult()
        const list = [
            {
                fullName: 'Nguyễn Văn Nhị',
                sdt: '0888289289',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh',
                color: 'b'

            },
            {
                fullName: 'Nguyễn Thị Hai',
                sdt: '0888689689',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh',
                color: 'b'
            },
            {
                fullName: 'Nguyễn Văn Ba',
                sdt: '0888589589',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh',
                color: 'b'
            },
            {
                fullName: 'Nguyễn Văn Tam',
                sdt: '0888389389',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh',
                color: 'b'
            },
            {
                fullName: 'Nguyễn Tuấn Kiệt',
                sdt: '0888189189',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh',
                color: 'b'
            },
            {
                fullName: 'Trần Thị Ngân',
                sdt: '0942691093',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh',
                color: 'b'
            },
            {
                fullName: 'Nguyễn Võ Kim Ngọc',
                sdt: '0934699626',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh',
                color: 'b'
            },
            {
                fullName: 'Hà Thị Phượng',
                sdt: '0814722724',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh',
                color: 'b'
            },
            {
                fullName: 'Nguyễn Văn Tứ',
                sdt: '0888489489',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh',
                color: 'b'
            },
            {
                fullName: 'Trần Minh Trí',
                sdt: '0888789789',
                status: 0,
                statusSpecial: 0,
                timeBooking: '',
                dentistName: '',
                dentistPhone: '',
                room: '',
                dentalCareExamReason: 'khám bệnh',
                color: 'b'
            },
        ]
        setLoading(true)
        list.forEach((item) => {
            const dbRef1 = ref(db)
            const newUser = push(dbRef1)
            set(newUser, item)
        })

        const handler = setTimeout(() =>
            setLoading(false),
            1000)
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
                        >Test đăng kí khám bệnh cho nhiều bệnh nhân vãn lai
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
                                <>
                                    {result}
                                    <div style={{ height: '12px' }}></div>
                                    {resultSDT != undefined ?
                                        <div>
                                            Các bệnh nhân đặt lịch thành công có số điện thoại:
                                            <Grid container spacing={2} sx={{ marginTop: '1px' }}>
                                                {resultSDT.map((item, i) => (
                                                    <Grid item key={i}>{item}</Grid>
                                                ))}
                                            </Grid>
                                        </div>
                                        : null}

                                </>

                            }
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default TestDemo