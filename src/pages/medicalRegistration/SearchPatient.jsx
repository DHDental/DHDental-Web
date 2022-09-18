import { Search } from "@mui/icons-material"
import { Box, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { useState } from "react"

const SearchPatient = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
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
            <Box sx={{ height: '25px' }} />
            <TableContainer component={Paper} square>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Họ</TableCell>
                            <TableCell>Tên đệm</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Ngày sinh</TableCell>
                            <TableCell>Đăng kí</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default SearchPatient