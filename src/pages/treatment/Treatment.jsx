import { Search } from "@mui/icons-material"
import { Box, Button, CircularProgress, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { axiosPrivate } from "../../api/axiosInstance"
import { GET_USER_INFO } from "../../common/constants/apiConstants"
import { RECORD_HISTORY } from "../../common/constants/pathConstants"
import { formatStringtoDate } from "../../common/utils/formatDate"

const Treatment = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [patient, setPatient] = useState([])
    const [loading, setLoading] = useState(false)
    const [messageNodata, setMessageNodata] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (searchTerm.trim() == '') {
            return
        }
        try {
            setMessageNodata('')
            setPatient([])
            setLoading(true)
            const response = await axiosPrivate.post(GET_USER_INFO, {
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
                            <TableCell align="center">Lịch sử khám bệnh</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(loading) ? (
                            <TableRow>
                                <TableCell colSpan={4} align='center'><CircularProgress /></TableCell>
                            </TableRow>
                        ) : null}
                        {
                            (patient.length == 0 && messageNodata != '') ? (
                                <TableRow>
                                    <TableCell colSpan={6} align='center'>{messageNodata}</TableCell>
                                </TableRow>
                            ) : null
                        }
                        {
                            patient.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">{item?.fullName}</TableCell>
                                    <TableCell align="center">{item?.phoneNumber}</TableCell>
                                    <TableCell align="center">{formatStringtoDate(item?.dob, "YYYY-MM-DD", "DD/MM/YYYY")}</TableCell>
                                    <TableCell align="center">
                                        <NavLink to={`${RECORD_HISTORY}/${item?.phoneNumber}`}
                                            state={{ patient: item }}
                                        >
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                onClick={() => {
                                                }}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </NavLink>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Treatment