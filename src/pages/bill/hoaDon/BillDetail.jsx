import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { ref, remove, update } from 'firebase/database';
import React, { useState } from 'react'
import { axiosPublic } from '../../../api/axiosInstance';
import { CANCEL_SERVICE, UPDATE_STATUS_BILL } from '../../../common/constants/apiConstants';
import { formatDateMonthYear, formatDateMonthYear2 } from '../../../common/utils/formatDate';
import { CustomBackdrop, CustomSnackbar } from '../../../components';
import CustomDialog from '../../../components/CustomDialog';
import StartFirebase from '../../../components/firebaseConfig';

const db = StartFirebase()
const BillDetail = ({ item, dataFirebasePatient, setReload, reload,
    setTextSnackbar, setSeverity, setOpenSnackbar, setOpenBackdrop
}) => {
    // console.log(dataFirebasePatient);

    // console.log(item);
    // console.log(formatDateMonthYear(item?.billDateCreate));
    const [trangThaiCapNhat, setTrangThaiCapNhat] = useState('')
    const [openPopupCancel, setOpenPopupCancel] = useState(false)

    const [currentService, setCurrentService] = useState()

    const handleClosePopupCancel = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopupCancel(false);
    };
    const handleYesPopupCancel = async () => {
        try {
            setOpenPopupCancel(false);
            setOpenBackdrop(true)


            const response = await axiosPublic.post(CANCEL_SERVICE, {
                "billDetailId": currentService?.billDetailId
            })
            if (dataFirebasePatient.length !== 0) {
                dataFirebasePatient[0]?.data?.record?.serviceHoaDon?.forEach((service, i) => {
                    if (service?.billDetailID == currentService?.billDetailId) {
                        console.log(i);
                        // update(ref(db, `${dataFirebasePatient[0]?.key}/record/serviceHoaDon/${i}`), {
                        //     statusThanhToan: 'cancel'
                        // })
                        remove(ref(db, `${dataFirebasePatient[0]?.key}/record/serviceHoaDon/${i}`))
                    }
                });
            }

            setTextSnackbar('Hủy bỏ thành công')
            setSeverity('success')
            setOpenSnackbar(true)
            setOpenBackdrop(false)
            setReload(!reload)
        } catch (error) {
            setOpenBackdrop(false)
            console.log(error);
        }
    }

    const handleHuyBo = (service) => {
        // nhấn hủy bỏ, thì gọi api, cập nhật trạng thái hủy bỏ, xóa khỏi state dịch vụ để load lại table dịch vụ
        // cập nhật trạng thái dịch vụ hóa đơn trong firebase, có thể bỏ luôn, à phải check
        // check xem có dataFirebasePatient hay ko, có payment Confirmation hay ko thì mới cập nhật
        setCurrentService(service)
        setOpenPopupCancel(true)

    }
    const handleCapNhat = async () => {
        if (trangThaiCapNhat == '') {
            setTextSnackbar('Bạn chưa chọn trạng thái cập nhật')
            setSeverity('warning')
            setOpenSnackbar(true)
            return
        }
        try {
            setOpenBackdrop(true)
            const response = await axiosPublic.post(UPDATE_STATUS_BILL, {
                "billId": item?.billId,
                "status": trangThaiCapNhat
            })
            if (dataFirebasePatient.length !== 0) {
                // console.log('1');
                dataFirebasePatient[0]?.data?.record?.serviceHoaDon.forEach((service, i) => {
                    if (service.billID == item?.billId) {
                        console.log(i);
                        update(ref(db, `${dataFirebasePatient[0]?.key}/record/serviceHoaDon/${i}`), {
                            statusThanhToan: 'roi'
                        })
                    }
                });

            }


            setTextSnackbar('Cập nhật thành công')
            setSeverity('success')
            setOpenSnackbar(true)

            setOpenBackdrop(false)

            setReload(!reload)
        } catch (error) {
            setOpenBackdrop(false)
            console.log(error);
        }
    }
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
                                        onClick={handleCapNhat}
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
                                                            {item?.status == 'Unpaid' && service?.serviceStatus != 'Done' ?
                                                                <Button
                                                                    size='small'
                                                                    sx={{ color: 'red' }}
                                                                    onClick={
                                                                        () => {
                                                                            handleHuyBo(service)
                                                                        }
                                                                    }
                                                                >Hủy bỏ</Button>
                                                                : null}
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
            <CustomDialog open={openPopupCancel} handleClose={handleClosePopupCancel} handleYes={handleYesPopupCancel}
                text={`Bạn chắc chắn muốn hủy bỏ dịch vụ này`} />

        </>
    )
}

export default BillDetail