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
    DialogActions
} from "@mui/material"
import { equalTo, get, onValue, orderByChild, query, ref } from "firebase/database";
import { useEffect, useState } from "react"

import { axiosPublic } from '../../api/axiosInstance';
import StartFirebase from '../../components/firebaseConfig';

const db = StartFirebase()

const SearchPatient = () => {
    const [userRegister, setUserRegister] = useState([])
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
            isMounted && setUserRegister(records)
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

    const handleSubmit = async (e) => {
        if (searchTerm === '') {
            e.preventDefault()
            return
        }
        e.preventDefault()
        try {
            setMessageNodata('')
            setPatient([])
            setLoading(true)
            const response = await axiosPublic.post('/user/getUserInfo', {
                "keySearch": searchTerm
            })
            console.log(response.data);
            setPatient(response.data)
            setLoading(false)
        } catch (error) {
            setPatient([])
            setLoading(false)
            console.log(error);
            if (error.response.status === 417) {
                setMessageNodata('Không tìm thấy kết quả')
            } else {
                setMessageNodata(error.message)
            }
        }
    }
    const handleClosePopup = () => {
        setOpenPopup(false);
    };
    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <TextField
                    fullWidth
                    variant="standard"
                    label="Tìm kiếm bệnh nhân..."
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
                                    <TableCell>{item?.fullName}</TableCell>
                                    <TableCell>{item?.phoneNumber}</TableCell>
                                    <TableCell>{item?.dob}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            variant="contained"
                                            disabled={checkRegister(item?.phoneNumber)}
                                            onClick={() => (setOpenPopup(true))}
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
            <Dialog open={openPopup} onClose={handleClosePopup}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopup}>Cancel</Button>
                    <Button onClick={handleClosePopup}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SearchPatient