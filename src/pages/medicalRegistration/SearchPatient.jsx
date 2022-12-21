import { Search } from "@mui/icons-material"
import {
    Box, IconButton, InputAdornment, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material"
import { equalTo, get, onValue, orderByChild, push, query, ref, set } from "firebase/database";
import { useEffect, useState } from "react"

import { axiosPrivate } from '../../api/axiosInstance';
import StartFirebase from '../../components/firebaseConfig';
import { formatStringtoDate } from '../../common/utils/formatDate'
import { CHECK_PAYMENT_OR_NOT } from "../../common/constants/apiConstants";
import { CustomBackdrop, CustomSnackbar } from "../../components";
import dayjs from "dayjs";

const db = StartFirebase()

const SearchPatient = ({ reload, setReload }) => {
    const [openBackdrop, setOpenBackdrop] = useState(false)

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [textSnackbar, setTextSnackbar] = useState('')
    const [severity, setSeverity] = useState('success')

    const [userRegister, setUserRegister] = useState([])

    const [haMyPatient, setHaMyPatient] = useState('')
    const [baoPatient, setBaoPatient] = useState('')

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }
    useEffect(() => {
        let isMounted = true;
        const dbRef = ref(db)
        onValue(dbRef, (snapshot) => {
            let records = [];
            let count1 = 0;
            let count2 = 0;
            snapshot.forEach(childSnapshot => {
                let keyName = childSnapshot.key;
                let data = childSnapshot.val();
                records.push({ "key": keyName, "data": data })
                if (childSnapshot.val().dentistPhone == '0888974974') {
                    count1 = count1 + 1
                }
                if (childSnapshot.val().dentistPhone == '0192837465') {
                    count2 = count2 + 1
                }
            })
            isMounted && setUserRegister(records)
            isMounted && setHaMyPatient(count1)
            isMounted && setBaoPatient(count2)
        })
        return () => {
            isMounted = false
        }
    }, [])
    const checkRegister = (value) => {
        let count = false
        // console.log(userRegister);
        userRegister.forEach((item, index) => {
            if (item.data.sdt === value) {
                count = true
            }
        })
        return count
    }

    const [searchTerm, setSearchTerm] = useState('')
    const [patient, setPatient] = useState([])
    const [loading, setLoading] = useState(false)
    const [messageNodata, setMessageNodata] = useState('')
    const [openPopup, setOpenPopup] = useState(false)
    const [currentPatient, setCurrentPatient] = useState({})
    const [currentPatientReason, setCurrentPatientReason] = useState('')
    const [messageCurrentPatientReason, setMesageCurrentPatientReason] = useState('')

    const [loadingDangKi, setLoadingDangKi] = useState(false)

    const [dentistKham, setDentistKham] = useState("0")

    const handleSubmit = async (e) => {
        if (searchTerm === '') {
            e.preventDefault()
            setPatient([])
            setMessageNodata("Mời bạn nhập từ tìm kiếm")
            return
        }
        e.preventDefault()
        try {
            setMessageNodata('')
            setPatient([])
            setLoading(true)
            const response = await axiosPrivate.post('/user/getUserInfo', {
                "keySearch": searchTerm
            })
            setPatient(response.data)
            setLoading(false)
        } catch (error) {

            setLoading(false)
            console.log(error);
            if (error.response.status === 417) {
                setMessageNodata('Không tìm thấy kết quả')
            } else {
                setMessageNodata(error.message)
            }
        }
    }
    const handleClosePopup = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setMesageCurrentPatientReason('')
        setDentistKham("0")
        setOpenPopup(false);
    };
    const handleYesPopup = async () => {
        if (currentPatientReason.trim() == '') {
            setMesageCurrentPatientReason('Cần nhập lí do khám bệnh')
            return
        }
        try {
            // setOpenBackdrop(true)
            setLoadingDangKi(true)
            const response = await axiosPrivate.post(CHECK_PAYMENT_OR_NOT, {
                "phoneNumber": currentPatient.phoneNumber,
                "dentistName": dentistKham
            })

            // setOpenBackdrop(false)
            let color
            if (response?.data?.color == 'yd') {
                setTextSnackbar('Đăng kí khám bệnh thành công. Bệnh nhân có hóa đơn cần thanh toán')
                setSeverity('success')
                setOpenSnackbar(true)
                color = 'yd'
            } else {
                setTextSnackbar('Đăng kí khám bệnh thành công')
                setSeverity('success')
                setOpenSnackbar(true)
                color = 'b'
            }
            const dbRef1 = ref(db)
            const newUser = push(dbRef1)
            set(newUser, {
                fullName: currentPatient.fullName,
                sdt: currentPatient.phoneNumber,
                status: 0,
                statusSpecial: 0,
                timeBooking: dayjs().format('hh:mm A'),
                dentistName: response?.data?.dentistName,
                dentistPhone: response?.data?.dentistPhone,
                room: '',
                dentalCareExamReason: currentPatientReason,
                color: color
            })
            setMesageCurrentPatientReason('')
            setLoadingDangKi(false)
            setOpenPopup(false)
            setCurrentPatientReason('')
            setDentistKham("0")
            setReload(!reload)
        } catch (error) {
            console.log(error);
            setTextSnackbar('Đăng kí khám bệnh thất bại')
            setSeverity('error')
            setOpenSnackbar(true)
        }

    }
    const handleChangeDentistKham =
        (event) => {
            setDentistKham(event.target.value);
        };

    // console.log(dayjs().format('hh:mm A'));
    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <TextField
                    fullWidth
                    variant="standard"
                    label="Tìm kiếm bệnh nhân"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton type='submit' sx={{ color: '#4285f4' }}>
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <Box sx={{ height: '25px' }} />
            <TableContainer component={Paper} square>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Họ và tên</TableCell>
                            <TableCell align="left">Số điện thoại</TableCell>
                            <TableCell align="left">Ngày sinh</TableCell>
                            <TableCell align="center">Đăng kí</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(loading) ? (
                            <TableRow>
                                <TableCell colSpan={4} align='center'><CircularProgress /></TableCell>
                            </TableRow>
                        ) : null}
                        {
                            (patient.length === 0 && messageNodata !== '') ? (
                                <TableRow>
                                    <TableCell colSpan={6} align='center'>{messageNodata}</TableCell>
                                </TableRow>
                            ) : null
                        }
                        {
                            patient.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell align="left">{item?.fullName}</TableCell>
                                    <TableCell align="left">{item?.phoneNumber}</TableCell>
                                    <TableCell align="left">{formatStringtoDate(item?.dob, "YYYY-MM-DD", "DD/MM/YYYY")}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            variant="contained"
                                            disabled={checkRegister(item?.phoneNumber)}
                                            onClick={() => {
                                                setOpenPopup(true)
                                                setCurrentPatient(item)
                                            }}
                                        >
                                            {checkRegister(item?.phoneNumber) ? 'Đã đăng kí' : 'Đăng kí'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }

                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openPopup} onClose={handleClosePopup}
                PaperProps={{ sx: { position: 'fixed', top: '25px' } }}
                fullWidth
            >
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                        <Typography variant="h6" sx={{

                            color: '#0f3eb4'
                        }}>Đăng kí khám bệnh</Typography>
                    </Box>
                    <Box>
                        <Grid container spacing={2} direction='row'>
                            <Grid item xs={4}>
                                <Typography>Bệnh nhân</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>{currentPatient?.fullName}</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2} direction='row'>
                            <Grid item xs={4}>
                                <Typography>Số điện thoại</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>{currentPatient?.phoneNumber}</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2} direction='row'>
                            <Grid item xs={4}>
                                <Typography>Ngày sinh</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>{formatStringtoDate(currentPatient?.dob, "YYYY-MM-DD", "DD/MM/YYYY")}</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2} direction='row'>
                            <Grid item xs={4}>
                                <Typography>Địa chỉ</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>{currentPatient?.address}</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2} direction='row' sx={{ alignItems: 'flex-end' }}>
                            <Grid item xs={4}>
                                <Typography >Lí do khám bệnh *</Typography>
                            </Grid>
                            <Grid item xs={6} >
                                <TextField
                                    id="dentalCareExamReason"
                                    name="dentalCareExamReason"
                                    onChange={(e) => {
                                        setCurrentPatientReason(e.target.value)
                                    }}
                                    variant="standard"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        {messageCurrentPatientReason != '' ?
                            <Grid container spacing={2} direction='row'>
                                <Grid item xs={4}>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={{ color: 'red' }}>{messageCurrentPatientReason}</Typography>
                                </Grid>
                            </Grid> : null
                        }
                        <br />
                        <Grid container spacing={2} direction='row' sx={{ alignItems: 'flex-end' }}>
                            <Grid item xs={4}>
                                <Typography >Nha sĩ</Typography>
                            </Grid>
                            <Grid item xs={6} >
                                <FormControl
                                    sx={{ width: '100%' }}
                                >
                                    {/* <InputLabel id="demo-simple-select-label">Nha sĩ khám</InputLabel> */}
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={dentistKham}
                                        // label="Nha sĩ khám"
                                        onChange={handleChangeDentistKham}
                                        size='medium'
                                        variant='standard'
                                    >
                                        <MenuItem value={'0'}>Chọn tự động</MenuItem>
                                        <MenuItem value={'0888974974'}>{`Trần Thị Hà My (${haMyPatient})`}</MenuItem>
                                        <MenuItem value={'0192837465'}>{`Vũ Quốc Bảo (${baoPatient})`}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopup} disabled={loadingDangKi}>Hủy</Button>
                    <Button onClick={handleYesPopup}
                        disabled={loadingDangKi}
                        startIcon={loadingDangKi ? <CircularProgress size='0.9rem' /> : null}
                    >
                        {loadingDangKi == true ? 'Đang đăng kí' : 'Đăng kí'}
                    </Button>
                </DialogActions>
            </Dialog>
            <CustomBackdrop open={openBackdrop} />
            <CustomSnackbar handleClose={handleCloseSnackbar}
                open={openSnackbar}
                text={textSnackbar}
                severity={severity}
                variant='standard'
                vertical='top'
                horizontal='right' />
        </>
    )
}

export default SearchPatient