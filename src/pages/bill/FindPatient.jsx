import { Search } from "@mui/icons-material"
import { Box, CircularProgress, IconButton, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { axiosPublic } from "../../api/axiosInstance"
import { STAFF_HOADON } from "../../common/constants/pathConstants"
import { formatStringtoDate } from "../../common/utils/formatDate"

const FindPatient = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [patient, setPatient] = useState([])
    const [loading, setLoading] = useState(false)
    const [messageNodata, setMessageNodata] = useState('')
    const handleSubmit = async (e) => {
        if (searchTerm.trim() === '') {
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
            // console.log(response.data);
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
            <Box sx={{ height: '30px' }} />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Họ và tên</TableCell>
                            <TableCell align="center">Số điện thoại</TableCell>
                            <TableCell align="center">Ngày sinh</TableCell>
                            <TableCell align="center">Địa chỉ</TableCell>
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
                                    <TableCell colSpan={4} align='center'>{messageNodata}</TableCell>
                                </TableRow>
                            ) : null
                        }
                        {
                            patient.map((item, index) => {
                                let fullName = item.lastName + ' ' + item.middleName + ' ' + item.firstName
                                return (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            <NavLink to={`${STAFF_HOADON}/${item?.phoneNumber}`}
                                                style={{
                                                    color: 'blue',
                                                    fontWeight: '500',
                                                    textDecoration: 'underline',
                                                }}>
                                                {fullName}
                                            </NavLink>

                                        </TableCell>
                                        <TableCell align="center">{item?.phoneNumber}</TableCell>
                                        <TableCell align="center">{formatStringtoDate(item?.dob, "YYYY-MM-DD", "DD/MM/YYYY")}</TableCell>
                                        <TableCell align="center">{item?.address}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default FindPatient