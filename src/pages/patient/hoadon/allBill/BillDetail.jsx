import { Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { formatDateMonthYear2 } from '../../../../common/utils/formatDate';


const BillDetail = ({ item, setReload, reload,
    setTextSnackbar, setSeverity, setOpenSnackbar, setOpenBackdrop
}) => {







    return (
        <>
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
                                        : item?.status == 'Paid' ? 'Đã thanh toán'
                                            : 'Đã trả tiền cọc'
                                    }
                                </Grid>
                            </Grid>
                            <Grid container item direction='row' spacing={2}>
                                <Grid item sx={{ fontWeight: '500' }}>Tổng tiền:</Grid>
                                <Grid item>
                                    {/* {new Intl.NumberFormat('vi-VN'
                                        , { style: 'currency', currency: 'VND' }
                                    ).format(item?.totalPrice)} */}
                                    {item?.totalPrice}
                                </Grid>
                            </Grid>
                            {
                                item?.prepaid != item?.totalPrice ?
                                    <Grid container item direction='row' spacing={2}>
                                        <Grid item sx={{ fontWeight: '500' }}>Số tiền cọc:</Grid>
                                        <Grid item>
                                            {/* {new Intl.NumberFormat('vi-VN'
                                                , { style: 'currency', currency: 'VND' }
                                            ).format(item?.prepaid)} */}
                                            {item?.prepaid}
                                        </Grid>
                                    </Grid> : null
                            }

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

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {item?.billDetailList?.map((service, iSer) => {
                                            if (service?.serviceStatus != 'Cancel')
                                                return (
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

                                                            {/* {new Intl.NumberFormat('vi-VN'
                                                                , { style: 'currency', currency: 'VND' }
                                                            ).format(service.price)} */}
                                                            {service.price}
                                                        </TableCell>
                                                        <TableCell align='center'>

                                                            {/* {new Intl.NumberFormat('vi-VN'
                                                                , { style: 'currency', currency: 'VND' }
                                                            ).format(service.totalPrice)} */}
                                                            {service.totalPrice}
                                                        </TableCell>

                                                    </TableRow>
                                                )
                                            return null
                                        }
                                        )}
                                    </TableBody>
                                </Table>
                            </Grid>



                        </Grid>
                    </CardContent>
                </Card>
            </Grid>


        </>
    )
}

export default BillDetail