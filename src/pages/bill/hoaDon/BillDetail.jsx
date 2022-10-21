import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react'

const BillDetail = ({ item, handleHuyBo, dataFirebasePatient }) => {
    console.log(dataFirebasePatient);
    const [trangThaiCapNhat, setTrangThaiCapNhat] = useState('')
    return (
        <Grid container item>
            <Card square={true} sx={{
                // boxShadow: 'none',
                // border: 'blue 1px solid'
            }}
            // variant="outlined"

            >
                <CardContent>
                    <Grid container direction='column' spacing={2}>
                        <Grid container item direction='row' spacing={2}>
                            <Grid item sx={{ fontWeight: '500' }}>Ngày tạo hóa đơn:</Grid>
                            <Grid item>{item?.ngayTaoBill}</Grid>
                        </Grid>
                        <Grid container item direction='row' spacing={2}>
                            <Grid item sx={{ fontWeight: '500' }}>Trạng thái:</Grid>
                            <Grid item
                                sx={{
                                    color: 'red'
                                }}
                            >
                                {item?.status == 'Unpaid' ? 'Chưa thanh toán'
                                    : 'Chưa thanh toán xong'
                                }
                                {/* {item?.status} */}
                            </Grid>
                        </Grid>
                        <Grid container item direction='row' spacing={2}>
                            <Grid item sx={{ fontWeight: '500' }}>Tổng tiền:</Grid>
                            <Grid item>
                                {new Intl.NumberFormat('vi-VN'
                                    , { style: 'currency', currency: 'VND' }
                                ).format(item?.tongTien)}
                            </Grid>
                        </Grid>
                        {
                            item?.soTienTraTruoc ?
                                <Grid container item direction='row' spacing={2}>
                                    <Grid item sx={{ fontWeight: '500' }}>Số tiền trả trước:</Grid>
                                    <Grid item>
                                        {new Intl.NumberFormat('vi-VN'
                                            , { style: 'currency', currency: 'VND' }
                                        ).format(item?.soTienTraTruoc)}
                                    </Grid>
                                </Grid> : null
                        }
                        <Grid container item direction='row' spacing={2} sx={{ alignItems: 'center' }}>
                            <Grid item sx={{ fontWeight: '500' }}>Cập nhật trạng thái:</Grid>
                            <Grid item xs={3}>
                                <FormControl fullWidth size='small'>
                                    <InputLabel id="capNhatStatus">Trạng thái</InputLabel>
                                    <Select
                                        // size='small'
                                        labelId="capNhatStatus"
                                        id="demo-simple-select"
                                        value={trangThaiCapNhat}
                                        label="Trạng thái"
                                        onChange={
                                            (event) => {
                                                setTrangThaiCapNhat(event.target.value);
                                            }
                                        }
                                    >
                                        {
                                            item?.trangThaiCoTheCapNhat?.map((statusChange, iStatus) => (
                                                <MenuItem key={iStatus} value={statusChange}>{statusChange}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button size='medium'
                                    variant='contained'
                                    disableElevation
                                >
                                    Cập nhật
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Table
                                size="small"
                                sx={{ border: '#ddd 1px solid' }}
                            >
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f2f2f2' }}>
                                        <TableCell align='center'>Dịch vụ</TableCell>
                                        <TableCell align='center'>Số lần thực hiện (dự kiến)</TableCell>
                                        <TableCell align='center'>Số lượng</TableCell>
                                        <TableCell align='center'>Đơn giá</TableCell>
                                        <TableCell align='center'>Thành tiền</TableCell>
                                        <TableCell align='center'></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {item?.billDetails?.map((service, iSer) => (
                                        <TableRow key={iSer}>
                                            <TableCell align='center'>
                                                {service.tenDichVu}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {service.soLanDuKien}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {service.soLuong}
                                            </TableCell>
                                            <TableCell align='center'>

                                                {new Intl.NumberFormat('vi-VN'
                                                    , { style: 'currency', currency: 'VND' }
                                                ).format(service.donGia)}
                                            </TableCell>
                                            <TableCell align='center'>

                                                {new Intl.NumberFormat('vi-VN'
                                                    , { style: 'currency', currency: 'VND' }
                                                ).format(service.thanhTien)}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {service?.trangThaiDichVu != 'done' ?
                                                    <Button
                                                        size='small'
                                                        sx={{ color: 'red' }}
                                                        onClick={handleHuyBo}
                                                    >Hủy bỏ</Button>
                                                    : null}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>



                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default BillDetail