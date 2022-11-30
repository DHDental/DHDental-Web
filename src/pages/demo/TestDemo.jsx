import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { DISABLE_BOOKING, ENABLE_BOOKING, TEST_BOOKING } from '../../common/constants/apiConstants'
import { axiosPublic } from '../../api/axiosInstance'
import { push, ref, set } from 'firebase/database'
import StartFirebase from '../../components/firebaseConfig'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { async } from '@firebase/util'

const db = StartFirebase()
const TestDemo = () => {
    const [result, setResult] = useState()
    const [resultSDT, setResultSDT] = useState()
    const [action, setAction] = useState('')
    const [loading, setLoading] = useState(false)

    const [value1, setValue1] = useState(null);
    const [value2, setValue2] = useState(null);
    const [soLuong1, setSoLuong1] = useState('');
    const [soLuong2, setSoLuong2] = useState('');
    const handleChange1 = (event) => {
        setSoLuong1(event.target.value);
    };
    const handleChange2 = (event) => {
        setSoLuong2(event.target.value);
    };
    const handleBooking = () => {
        setAction('Test nhiều bệnh nhân đặt lịch khám bệnh')
        const getResult = async () => {
            try {
                setLoading(true)
                setResult()
                setResultSDT()
                const response = await axiosPublic.post(TEST_BOOKING, {
                    "dateBooking": dayjs(value1).format('YYYY-MM-DD'),
                    "onlineNum": soLuong1,
                    "offlineNum": "0",
                    "caseBooking": "A1"

                })
                // console.log(response.data);
                setResult(`Số người đặt lịch thành công ${response.data.userOnlineSuccess.length}`)
                setResultSDT(response.data.userOnlineSuccess)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error);
                console.log(error.response.data.message);
                setResult(error.response.data.message)
            }
        }
        getResult()
        console.log(soLuong1, dayjs(value1).format('YYYY-MM-DD'));

    }
    const handleVanLai = () => {
        setAction('Test đăng kí khám bệnh cho nhiều bệnh nhân vãn lai')
        const getResult = async () => {
            try {
                setLoading(true)
                setResult()
                setResultSDT()
                console.log({
                    "dateBooking": dayjs(value2).format('YYYY-MM-DD'),
                    "onlineNum": "0",
                    "offlineNum": soLuong2,
                    "caseBooking": "A1"

                });
                const response = await axiosPublic.post(TEST_BOOKING, {
                    "dateBooking": dayjs(value2).format('YYYY-MM-DD'),
                    "onlineNum": "0",
                    "offlineNum": soLuong2,
                    "caseBooking": "A1"

                })
                // console.log(response.data);
                if (response.data.userOfflineSuccess.length != 0) {
                    response.data.userOfflineSuccess?.forEach((item) => {
                        const dbRef1 = ref(db)
                        const newUser = push(dbRef1)
                        set(newUser, {
                            fullName: item?.fullname,
                            sdt: item?.phone,
                            status: 0,
                            statusSpecial: 0,
                            timeBooking: '',
                            dentistName: '',
                            dentistPhone: '',
                            room: '',
                            dentalCareExamReason: 'khám bệnh',
                            color: 'b'
                        })
                    })
                }
                setResult(`Số người đăng kí khám vãn lai thành công ${response.data.userOfflineSuccess.length}`)
                setResultSDT(response.data.userOfflineSuccess)
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
    // const handleVanLai = () => {
    //     setAction('Test đăng kí khám bệnh cho nhiều bệnh nhân vãn lai')
    //     setResult()
    //     const list = [
    //         {
    //             fullName: 'Nguyễn Văn Nhị',
    //             sdt: '0888289289',
    //             status: 0,
    //             statusSpecial: 0,
    //             timeBooking: '',
    //             dentistName: '',
    //             dentistPhone: '',
    //             room: '',
    //             dentalCareExamReason: 'khám bệnh',
    //             color: 'b'

    //         },
    //         {
    //             fullName: 'Nguyễn Thị Hai',
    //             sdt: '0888689689',
    //             status: 0,
    //             statusSpecial: 0,
    //             timeBooking: '',
    //             dentistName: '',
    //             dentistPhone: '',
    //             room: '',
    //             dentalCareExamReason: 'khám bệnh',
    //             color: 'b'
    //         },
    //         {
    //             fullName: 'Nguyễn Văn Ba',
    //             sdt: '0888589589',
    //             status: 0,
    //             statusSpecial: 0,
    //             timeBooking: '',
    //             dentistName: '',
    //             dentistPhone: '',
    //             room: '',
    //             dentalCareExamReason: 'khám bệnh',
    //             color: 'b'
    //         },
    //         {
    //             fullName: 'Nguyễn Văn Tam',
    //             sdt: '0888389389',
    //             status: 0,
    //             statusSpecial: 0,
    //             timeBooking: '',
    //             dentistName: '',
    //             dentistPhone: '',
    //             room: '',
    //             dentalCareExamReason: 'khám bệnh',
    //             color: 'b'
    //         },
    //     ]
    //     setLoading(true)
    //     list.forEach((item) => {
    //         const dbRef1 = ref(db)
    //         const newUser = push(dbRef1)
    //         set(newUser, item)
    //     })

    //     const handler = setTimeout(() =>
    //         setLoading(false),
    //         1000)
    //     setResult('Đăng kí khám bệnh cho 10 bệnh nhân vãn lai thành công')
    // }
    const enableCheck = async () => {
        try {
            setLoading(true)
            setResult()
            setResultSDT()
            const response = await axiosPublic.post(ENABLE_BOOKING)
            setResult(`Đã enable check in`)
            setResultSDT()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
            console.log(error.response.data.message);
            setResult(error.response.data.message)
        }
    }
    const disableCheck = async () => {
        try {
            setLoading(true)
            setResult()
            setResultSDT()
            const response = await axiosPublic.post(DISABLE_BOOKING)
            setResult(`Đã set check in to normal`)
            setResultSDT()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
            console.log(error.response.data.message);
            setResult(error.response.data.message)
        }
    }
    return (
        <>
            <Grid container direction={'row'}>
                <Grid item xs={5}>
                    <Box sx={{ margin: '1px' }}>
                        <Box sx={{
                            //  backgroundColor: '#d3d3d6',
                            padding: '5px 5px'
                        }}>
                            <h4>Test nhiều bệnh nhân đặt lịch khám bệnh</h4>
                            <TextField
                                variant='standard'
                                sx={{ marginBottom: '15px' }}
                                label='Số lượng'
                                value={soLuong1}
                                onChange={handleChange1}
                            />
                            <br />
                            <DatePicker
                                // label='Ngày'
                                value={value1}
                                onChange={
                                    (newValue) => {
                                        setValue1(newValue)
                                    }
                                }
                                inputFormat="DD/MM/YYYY"
                                placeholder="DD/MM/YYYY"
                                // minDate={dayjs().add(1, 'day').format('YYYY-MM-DD')}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant='standard'
                                        name='ngay'
                                        id='ngay'
                                    />

                                }
                            />
                            <br />
                            <Button
                                size='small'
                                variant='contained'
                                onClick={handleBooking}
                                disableElevation
                                sx={{ marginBottom: '15px', marginTop: '15px' }}

                            >Test</Button>
                        </Box>
                        <hr style={{
                            backgroundColor: '#000', border: ' 0.005px solid'
                        }} />
                        {/* <Button
                            size='medium'
                            variant='contained'
                            disableElevation
                            onClick={handleVanLai}
                        >Test đăng kí khám bệnh cho nhiều bệnh nhân vãn lai
                        </Button> */}
                        < Box sx={{
                            //  backgroundColor: '#d3d3d6',
                            padding: '5px 5px'
                        }}>
                            <h4>Test đăng kí khám bệnh cho nhiều bệnh nhân vãn lai</h4>
                            <TextField
                                variant='standard'
                                sx={{ marginBottom: '15px' }}
                                label='Số lượng'
                                value={soLuong2}
                                onChange={handleChange2}
                            />
                            <br />
                            <DatePicker
                                // label='Ngày'
                                value={value2}
                                onChange={
                                    (newValue) => {
                                        setValue2(newValue)
                                    }
                                }
                                inputFormat="DD/MM/YYYY"
                                placeholder="DD/MM/YYYY"
                                // minDate={dayjs().add(1, 'day').format('YYYY-MM-DD')}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant='standard'
                                        name='ngay2'
                                        id='ngay2'
                                    />

                                }
                            />
                            <br />
                            <Button
                                size='small'
                                variant='contained'
                                onClick={handleVanLai}
                                disableElevation
                                sx={{ marginBottom: '15px', marginTop: '15px' }}
                            >Test</Button>
                        </Box>
                        <hr style={{
                            backgroundColor: '#000', border: ' 0.005px solid'
                        }} />
                        < Box sx={{
                            //  backgroundColor: '#d3d3d6',
                            padding: '5px 5px'
                        }}>
                            <h4>Enable check in for demo</h4>
                            <Button
                                size='small'
                                variant='contained'
                                onClick={enableCheck}
                                disableElevation
                                sx={{ marginBottom: '15px', marginTop: '15px' }}
                            >Enable check in</Button>
                        </Box>

                        <hr style={{
                            backgroundColor: '#000', border: ' 0.005px solid'
                        }} />

                        < Box sx={{
                            //  backgroundColor: '#d3d3d6',
                            padding: '5px 5px'
                        }}>
                            <h4>Set check in to normal</h4>
                            <Button
                                size='small'
                                variant='contained'
                                onClick={disableCheck}
                                disableElevation
                                sx={{ marginBottom: '15px', marginTop: '15px' }}
                            >Set check in to normal</Button>
                        </Box>
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
                                    {(resultSDT != undefined && resultSDT?.length != 0) ?
                                        <div>
                                            Các bệnh nhân đặt lịch thành công có số điện thoại:
                                            <Grid container spacing={2} sx={{ marginTop: '1px' }}>
                                                {resultSDT.map((item, i) => (
                                                    <Grid item key={i}>{item?.phone}</Grid>
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