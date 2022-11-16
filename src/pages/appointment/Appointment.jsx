import { Box, Card, CircularProgress, IconButton, InputAdornment, Stack, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { BiRefresh, BiSearchAlt2 as Search } from 'react-icons/bi';

import { axiosPrivate } from '../../api/axiosInstance';
import {
    BOOKING_GETALLBOOKINGSCHEDULE,
    BOOKING_SEARCH_BOOKING_SCHEDULE
} from '../../common/constants/apiConstants';
import { formatDateMonthYear, formatYearMonthDate } from '../../common/utils/formatDate';
import StartFirebase from '../../components/firebaseConfig';
import AppointmentIcon from './AppointmentIcon';

// data giả
function createData(ten, sdt, date, time, color) {
    return { ten, sdt, date, time, color };
}


const rows = [
    createData('Sơn', "0123456789", "2/9/2021", "Sáng", '#04b205'),
    createData('Tài', "7896541230", "3/9/2022", "Chiều", '#4036364d'),
    createData('Khôi', "9874563210", "4/9/2022", "Sáng", '#04b205'),
];

const db = StartFirebase()
const Appointment = () => {
    const [open, setOpen] = useState(false);
    // const handleClose = () => {
    //     setOpen(false);
    // };
    const [messageNodata, setMessageNodata] = useState('')
    const [value, setValue] = useState(dayjs());
    var formattedDate = formatYearMonthDate(value);
    // console.log(formatDateMonthYear(value));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(-1);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);

    };

    const [searchTerm, setSearchTerm] = useState('')
    const searchUser = async () => {
        try {
            setMessageNodata('')
            setUserBookingList([])
            setOpen(true)
            const response = await axiosPrivate.post(BOOKING_SEARCH_BOOKING_SCHEDULE, {
                "keySearch": searchTerm
            })

            // console.log("Search", response.data);
            setUserBookingList(response.data)
            setOpen(false)
        } catch (error) {
            setOpen(false)
            // console.log(error.response);
            if (error.response.status === 417 || error.response.status === 404) {
                // console.log('ok');
                setUserBookingList([])
                setMessageNodata(error.response.data)
            } else {
                setUserBookingList([])
                setMessageNodata(error.message)
            }

        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        searchUser()
    }

    const handleRefresh = () => {
        setSearchTerm('')
        fetchUserBookingList()
    }

    const [userBookingList, setUserBookingList] = useState([])

    const fetchUserBookingList = async () => {
        try {
            setMessageNodata('')
            setUserBookingList([])
            setOpen(true)
            const response = await axiosPrivate.post(BOOKING_GETALLBOOKINGSCHEDULE, {
                "time": formattedDate
            }
            )
            // console.log(response.data);
            setUserBookingList(response.data)
            setOpen(false)

        } catch (error) {
            setOpen(false)
            console.log(error)
            // console.log(error.response);
            if (error.response.status === 417) {
                setUserBookingList([])
                setMessageNodata(error.response.data)
                // console.log(userBookingList.length)
            }
            else {
                setUserBookingList([])
                setMessageNodata(error.message)
            }
        }
    }
    const handleSlot = (slot) => {
        if (slot === 'sl1')
            slot = '8:00'
        if (slot === 'sl2')
            slot = '9:00'
        if (slot === 'sl3')
            slot = '10:00'
        if (slot === 'sl4')
            slot = '11:00'
        if (slot === 'sl5')
            slot = '12:00'
        if (slot === 'sl6')
            slot = '13:00'
        if (slot === 'sl7')
            slot = '14:00'
        if (slot === 'sl8')
            slot = '15:00'
        if (slot === 'sl9')
            slot = '16:00'
        return slot
    }
    useEffect(() => {
        fetchUserBookingList()
    }, [value])

    return (
        <>
            <Stack spacing={4}>
                {/* <Typography>Danh sách đặt khám</Typography> */}
                <Stack direction='row'
                    // alignItems='center'
                    sx={{ justifyContent: 'space-between' }}
                >
                    <Box sx={{ width: '250px', display: 'flex' }}>
                        <DatePicker
                            label="ngày-tháng-năm"
                            value={value}
                            minDate={dayjs().year() + ''}
                            maxDate={dayjs().endOf('year').format('YYYY-MM-DD')}
                            onChange={(newValue) => {
                                setValue(newValue);
                            }}
                            inputFormat="DD/MM/YYYY"
                            renderInput={(params) => <TextField {...params}
                            // onKeyDown={(event) => event.preventDefault()}
                            // sx={{
                            //     "& .MuiInputBase-root": {
                            //         pointerEvents: "none",
                            //     },

                            //     "& .MuiInputBase-root button": {
                            //         pointerEvents: "all",
                            //     },
                            // }}
                            />}
                        />
                        <IconButton onClick={handleRefresh} sx={{ marginLeft: '2px' }}>
                            <BiRefresh color='blue' />
                        </IconButton>
                    </Box>

                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                        }}
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            sx={{ width: '250px' }}
                            variant="standard"
                            label="Tìm kiếm..."
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
                </Stack>
                <Card square={true} sx={{ boxShadow: 'none' }}  >
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ backgroundColor: '#8fc9ff94' }}>
                            <TableRow hover>
                                <TableCell align='center'>Họ</TableCell>
                                <TableCell align='center'>Tên đệm</TableCell>
                                <TableCell align='center'>Tên</TableCell>
                                <TableCell align='center'>Số điện thoại</TableCell>
                                <TableCell align='center'>Ngày đặt hẹn</TableCell>
                                <TableCell align='center'>Giờ hẹn</TableCell>
                                <TableCell align='center'>Nha sĩ đặt hẹn</TableCell>
                                <TableCell align='center'>Check in</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                userBookingList.length === 0 && messageNodata === '' ?
                                    (<TableRow>
                                        <TableCell colSpan={8} align='center'>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>) : null
                            }
                            {userBookingList.length === 0 && messageNodata !== '' ?
                                (<TableRow style={{ height: 50 }}>
                                    <TableCell colSpan={8} align='center'>{messageNodata}</TableCell>
                                </TableRow>) : null}
                            {(rowsPerPage > 0
                                ? userBookingList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                :
                                userBookingList).map((user, i) => {

                                    return (
                                        <TableRow key={i} hover >
                                            <TableCell align='center'>{user?.lastName}</TableCell>
                                            <TableCell align='center'>{user?.middleName}</TableCell>
                                            <TableCell align='center'>{user?.firstName}</TableCell>
                                            <TableCell align='center'>{user?.phoneNumber}</TableCell>
                                            <TableCell align='center'>{formatDateMonthYear(user?.dateBooking)}</TableCell>
                                            <TableCell align='center'>
                                                {/* {user?.slotBooking } */}
                                                {handleSlot(user?.slotBooking)}
                                            </TableCell>
                                            <TableCell align='center'>{user?.dentistName}</TableCell>
                                            <TableCell align='center'>

                                                <AppointmentIcon user={user} />


                                            </TableCell>
                                        </TableRow>)
                                })}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[6, 12, { label: 'Tất cả', value: -1 }]}

                                    count={userBookingList.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    labelRowsPerPage='Số hàng trên một trang'
                                    showFirstButton
                                    showLastButton
                                    labelDisplayedRows={({ from, to, count }) =>
                                        (`${from}–${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`)}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Card>

            </Stack>
            {/* <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop> */}
        </>
    )
}

export default Appointment
