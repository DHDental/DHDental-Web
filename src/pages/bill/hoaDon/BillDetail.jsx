import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react'
import { formatDateMonthYear, formatDateMonthYear2 } from '../../../common/utils/formatDate';

const BillDetail = ({ item, handleHuyBo, dataFirebasePatient }) => {
    // console.log(dataFirebasePatient);
    console.log(item);
    console.log(formatDateMonthYear(item?.billDateCreate));
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
                        <Grid item
                            sx={{ color: 'red', fontStyle: 'italic' }}
                        > {item?.billID == 1 ?
                            '* Cần thanh toán cho lượt khám này'
                            : null}
                        </Grid>
                        <Grid container item direction='row' spacing={2}>
                            <Grid item sx={{ fontWeight: '500' }}>Ngày tạo hóa đơn:</Grid>
                            <Grid item>{formatDateMonthYear2(item?.billDateCreate)}</Grid>
                        </Grid>
                        <Grid container item direction='row' spacing={2}>
                            <Grid item sx={{ fontWeight: '500' }}>Trạng thái:</Grid>
                            <Grid item
                                sx={{
                                    color: 'red'
                                }}
                            >
                                {item?.status == 'Unpaid' ? 'Chưa thanh toán'
                                    : 'Đã trả tiền cọc'
                                }
                            </Grid>
                        </Grid>
                        <Grid container item direction='row' spacing={2}>
                            <Grid item sx={{ fontWeight: '500' }}>Tổng tiền:</Grid>
                            <Grid item>
                                {new Intl.NumberFormat('vi-VN'
                                    , { style: 'currency', currency: 'VND' }
                                ).format(item?.totalPrice)}
                            </Grid>
                        </Grid>
                        {
                            item?.prepaid != item?.totalPrice ?
                                <Grid container item direction='row' spacing={2}>
                                    <Grid item sx={{ fontWeight: '500' }}>Số tiền cọc:</Grid>
                                    <Grid item>
                                        {new Intl.NumberFormat('vi-VN'
                                            , { style: 'currency', currency: 'VND' }
                                        ).format(item?.prepaid)}
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
                                            item?.statusUpdates?.map((statusChange, iStatus) => (
                                                <MenuItem key={iStatus} value={statusChange}>
                                                    {statusChange == 'Paid' ? 'Đã thanh toán' : 'Đã trả tiền cọc'}
                                                </MenuItem>
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
                                    {item?.billDetailList?.map((service, iSer) => (
                                        <TableRow key={iSer}>
                                            <TableCell align='center'>
                                                {service.serviceName}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {service.expectedTime}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {service.quantity}
                                            </TableCell>
                                            <TableCell align='center'>

                                                {new Intl.NumberFormat('vi-VN'
                                                    , { style: 'currency', currency: 'VND' }
                                                ).format(service.price)}
                                            </TableCell>
                                            <TableCell align='center'>

                                                {new Intl.NumberFormat('vi-VN'
                                                    , { style: 'currency', currency: 'VND' }
                                                ).format(service.totalPrice)}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {service?.serviceStatus != 'Done' ?
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