import { Box, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const PatientInfo = () => {
    const [patien, setPatient] = useState()
    return (
        <>
            <TableContainer sx={{ width: '45%' }}>
                <Table>
                    <TableBody >
                        <TableRow >
                            <TableCell sx={{ width: '35%' }} component="th">Họ và tên</TableCell>
                            <TableCell>Khánh Hòa</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ width: '35%' }} component="th">Số điện thoại</TableCell>
                            <TableCell>0334942928</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ width: '35%' }} component="th">Ngày sinh</TableCell>
                            <TableCell>1/1/2000</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ width: '35%' }} component="th">Địa chỉ</TableCell>
                            <TableCell>Bình Dương</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default PatientInfo