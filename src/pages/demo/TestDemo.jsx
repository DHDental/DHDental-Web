import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { BILL_SCRIPT, CHECK_IN_CANCEL_SCRIPT, DISABLE_BOOKING, ENABLE_BOOKING, ENABLE_NOTIFY, RECORD_SCRIPT, TEST_BOOKING } from '../../common/constants/apiConstants'
import { axiosPublic } from '../../api/axiosInstance'
import { onValue, push, ref, remove, set, update } from 'firebase/database'
import StartFirebase from '../../components/firebaseConfig'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

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

    const [ngayNotify, setNgayNotify] = useState(null);

    const [ngayCheckIn, setNgayCheckIn] = useState(null);
    const [soLuongCheckIn, setSoLuongCheckIn] = useState('');
    const [soLuongCancel, setSoLuongCancel] = useState('');

    const [dataFirebase, setDataFirebase] = useState([])
    const [dentistRecord, setDentistRecord] = useState('')

    const [dentistThanhToan, setDentistThanhToan] = useState('')

    const [soLuongThanhToan, setSoLuongThanhToan] = useState('')
    const [soLuongCancelBill, setSoLuongCancelBill] = useState('');

    const handleChangeDentistRecord = (event) => {
        setDentistRecord(event.target.value);
    };

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
                            timeBooking: dayjs().format('hh:mm A'),
                            dentistName: item?.dentistName,
                            dentistPhone: item?.dentistName == 'Trần Thị Hà My' ? '0888974974' : '0192837465',
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

    const enableCheck = async () => {
        try {
            setLoading(true)
            setResult()
            setResultSDT()
            setAction('')
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
            setAction('')
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
    const enableNotify = async () => {
        try {
            setLoading(true)
            setResult()
            setResultSDT()
            setAction('')
            const response = await axiosPublic.post(ENABLE_NOTIFY, {
                "date": dayjs(ngayNotify).format('YYYY-MM-DD')
            })
            setResult(`Đã enable notify`)
            setResultSDT()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
            console.log(error.response.data.message);
            setResult(error.response.data.message)
        }
    }
    const checkIn = async () => {
        // console.log(soLuongCheckIn, soLuongCancel, dayjs(ngayCheckIn).format('YYYY-MM-DD'));
        try {
            setLoading(true)
            setResult()
            setResultSDT()
            setAction('')
            const response = await axiosPublic.post(CHECK_IN_CANCEL_SCRIPT, {
                "checkInCount": soLuongCheckIn,
                "cancelCount": soLuongCancel,
                "date": dayjs(ngayCheckIn).format('YYYY-MM-DD')
            })
            response.data.checkInList.forEach((user) => {
                const dbRef = ref(db)
                const newUser = push(dbRef)
                set(newUser, {
                    fullName: user.fullName,
                    sdt: user.phoneNumber,
                    status: 0,
                    statusSpecial: 1,
                    timeBooking: user.slotBooking,
                    dentistName: user.dentistName,
                    dentistPhone: user.dentistPhone,
                    room: '',
                    dentalCareExamReason: user.reason,
                    color: 'b'
                })
            })

            setResult(`Check in / Cancel thành công`)
            setResultSDT()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
            console.log(error.response.data.message);
            setResult(error.response.data.message)
        }
    }
    const handleRecord = async () => {
        try {
            let list = []
            let phoneList = []
            dataFirebase?.forEach((item) => {
                if (item?.data?.dentistName == dentistRecord) {
                    list.push(item)
                }
            })
            list?.forEach((item, index) => {
                // if (!item?.data?.record && index != (list?.length - 1)) {
                if (!item?.data?.record && item?.data?.status != '1') {
                    phoneList = [...phoneList, item?.data?.sdt]
                }
            })
            // console.log(phoneList);
            setLoading(true)
            setResult()
            setResultSDT()
            setAction('')
            const response = await axiosPublic.post(RECORD_SCRIPT, {
                "phoneNumber": phoneList
            })

            list?.forEach((item, index) => {
                if (!item?.data?.record && item?.data?.status != '1') {
                    response.data.forEach((itemS) => {
                        if (item?.data?.sdt == itemS.phoneNumber) {
                            update(ref(db, item?.key), {
                                color: 'yd',
                                status: 0,
                                record: {
                                    paymentConfirmation: '0',
                                    motaList: ["Đau răng", "Cần nhổ răng"],
                                    recordID: itemS.detail.recordID,
                                    serviceHoaDon: itemS.detail.billDetailResponse,
                                    serviceList: [{
                                        dacTa: itemS.detail.billDetailResponse[0].serviceSpecification,
                                        expectedPrice: itemS.detail.billDetailResponse[0].price,
                                        id: itemS.detail.billDetailResponse[0].serviceID,
                                        serviceDesc: itemS.detail.billDetailResponse[0].serviceName,
                                        soLanDuKienThucHien: itemS.detail.billDetailResponse[0].expectedTimes,
                                        soLuong: itemS.detail.billDetailResponse[0].quantity
                                    }]
                                }
                            })
                        }
                    })


                }
            })
            setResult(`Thành công`)
            setResultSDT()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
            // console.log(error.response.data.message);
            setResult('Có lỗi xảy ra, vui lòng thử lại')
        }

    }
    const handleChangeDentistThanhToan = (event) => {
        setDentistThanhToan(event.target.value);
    };

    const handleThanhToan = async () => {
        try {
            setLoading(true)
            setResult()
            setResultSDT()
            setAction('')
            let listBill = []
            // let list
            dataFirebase?.forEach((item) => {
                if (item?.data?.dentistName == dentistThanhToan && item?.data?.color == 'yd') {
                    listBill.push(item?.data?.record?.serviceHoaDon[0]?.billID)
                }
            })
            const response = await axiosPublic.post(BILL_SCRIPT, {
                "billList": listBill,
                "paidCount": soLuongThanhToan,
                "cancelCount": soLuongCancelBill
            })
            dataFirebase?.forEach((item) => {
                response.data.phoneNumberPaid.forEach((res) => {
                    if (item?.data?.sdt == res) {
                        update(ref(db, `${item?.key}`), {
                            color: 'ye',
                        })
                        update(ref(db, `${item?.key}/record`), {
                            paymentConfirmation: '1',
                        })
                        update(ref(db, `${item?.key}/record/serviceHoaDon/0`), {
                            statusThanhToan: 'roi',
                        })
                    }
                })

            })
            dataFirebase?.forEach((item) => {
                response.data.phoneNumberCancel.forEach((res) => {
                    if (item?.data?.sdt == res) {
                        remove(ref(db, item?.key))

                    }
                })

            })
            setResult(`Chạy script Thành công`)
            setResultSDT()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
            // console.log(error.response.data.message);
            setResult('Có lỗi xảy ra, vui lòng thử lại')
        }
    }
    const ketThucKham = () => {
        try {
            setLoading(true)
            setResult()
            setResultSDT()
            setAction('')
            dataFirebase?.forEach((item) => {
                remove(ref(db, item?.key))
            })
            setResult(`Chạy script Thành công`)
            setResultSDT()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
            // console.log(error.response.data.message);
            setResult('Có lỗi xảy ra, vui lòng thử lại')
        }
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
            isMounted && setDataFirebase(records)
        })
        return () => {
            isMounted = false
        }
    }, [])
    console.log(dataFirebase);
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

                            <h4>Check in/ Cancel appointment</h4>
                            <DatePicker
                                // label='Ngày'
                                value={ngayCheckIn}
                                onChange={
                                    (newValue) => {
                                        setNgayCheckIn(newValue)
                                    }
                                }
                                inputFormat="DD/MM/YYYY"
                                placeholder="DD/MM/YYYY"
                                // minDate={dayjs().add(1, 'day').format('YYYY-MM-DD')}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant='standard'
                                        name='ngayCheckIn'
                                        id='ngayCheckIn'
                                    />

                                }
                            />
                            <br />
                            <TextField
                                sx={{ marginTop: '10px' }}
                                variant='standard'
                                label='Số lượng check in'
                                value={soLuongCheckIn}
                                onChange={(event) => {
                                    setSoLuongCheckIn(event.target.value);
                                }}
                            />
                            <br />
                            <TextField
                                sx={{ marginTop: '10px' }}
                                variant='standard'
                                label='Số lượng cancel'
                                value={soLuongCancel}
                                onChange={(event) => {
                                    setSoLuongCancel(event.target.value);
                                }}
                            />
                            <br />
                            <Button
                                size='small'
                                variant='contained'
                                onClick={checkIn}
                                disableElevation
                                sx={{ marginBottom: '15px', marginTop: '15px' }}
                            >Chạy Script</Button>
                        </Box>
                        <hr style={{
                            backgroundColor: '#000', border: ' 0.005px solid'
                        }} />
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
                            <h4>Script tạo record/ hóa đơn dịch vụ</h4>
                            <FormControl sx={{ width: '50%' }}>
                                <InputLabel id="demo-simple-select-label">Nha sĩ khám</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={dentistRecord}
                                    label="Nha sĩ khám"
                                    onChange={handleChangeDentistRecord}
                                    size='medium'
                                // variant='standard'
                                >
                                    <MenuItem value={'Vũ Quốc Bảo'}>Vũ Quốc Bảo</MenuItem>
                                    <MenuItem value={'Trần Thị Hà My'}>Trần Thị Hà My</MenuItem>
                                </Select>
                            </FormControl><br />
                            <Button
                                size='small'
                                variant='contained'
                                onClick={handleRecord}
                                disableElevation
                                sx={{ marginBottom: '15px', marginTop: '15px' }}
                            >Chạy Script</Button>
                        </Box>
                        <hr style={{
                            backgroundColor: '#000', border: ' 0.005px solid'
                        }} />

                        < Box sx={{
                            //  backgroundColor: '#d3d3d6',
                            padding: '5px 5px'
                        }}>
                            <h4>Script thanh toán</h4>
                            <FormControl sx={{ width: '50%' }}>
                                <InputLabel id="demo-simple-select-label">Nha sĩ khám</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={dentistThanhToan}
                                    label="Nha sĩ khám"
                                    onChange={handleChangeDentistThanhToan}
                                    size='medium'
                                // variant='standard'
                                >
                                    <MenuItem value={'Vũ Quốc Bảo'}>Vũ Quốc Bảo</MenuItem>
                                    <MenuItem value={'Trần Thị Hà My'}>Trần Thị Hà My</MenuItem>
                                </Select>
                            </FormControl><br />
                            <TextField
                                sx={{ marginTop: '10px', width: '60%' }}

                                variant='standard'
                                label='Số lượng hoàn tất thanh toán'
                                value={soLuongThanhToan}
                                onChange={(event) => {
                                    setSoLuongThanhToan(event.target.value);
                                }}
                            />
                            <br />
                            <TextField
                                sx={{ marginTop: '10px', width: '60%' }}
                                variant='standard'
                                label='Số lượng hủy thanh toán'
                                value={soLuongCancelBill}
                                onChange={(event) => {
                                    setSoLuongCancelBill(event.target.value);
                                }}
                            />
                            <br />
                            <Button
                                size='small'
                                variant='contained'
                                onClick={handleThanhToan}
                                disableElevation
                                sx={{ marginBottom: '15px', marginTop: '15px' }}
                            >Chạy Script</Button>
                        </Box>

                        <hr style={{
                            backgroundColor: '#000', border: ' 0.005px solid'
                        }} />

                        < Box sx={{
                            //  backgroundColor: '#d3d3d6',
                            padding: '5px 5px'
                        }}>
                            <h4>Chạy script lưu record kết thúc quá trình khám</h4>
                            <Button
                                size='small'
                                variant='contained'
                                onClick={ketThucKham}
                                disableElevation
                                sx={{ marginBottom: '15px', marginTop: '15px' }}
                            >Chạy script</Button>
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
                        <hr style={{
                            backgroundColor: '#000', border: ' 0.005px solid'
                        }} />

                        < Box sx={{
                            //  backgroundColor: '#d3d3d6',
                            padding: '5px 5px'
                        }}>

                            <h4>Enable notify</h4>
                            <DatePicker
                                // label='Ngày'
                                value={ngayNotify}
                                onChange={
                                    (newValue) => {
                                        setNgayNotify(newValue)
                                    }
                                }
                                inputFormat="DD/MM/YYYY"
                                placeholder="DD/MM/YYYY"
                                // minDate={dayjs().add(1, 'day').format('YYYY-MM-DD')}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        variant='standard'
                                        name='ngayNotify'
                                        id='ngayNotify'
                                    />

                                }
                            />
                            <br />
                            <Button
                                size='small'
                                variant='contained'
                                onClick={enableNotify}
                                disableElevation
                                sx={{ marginBottom: '15px', marginTop: '15px' }}
                            >Enable notify</Button>
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