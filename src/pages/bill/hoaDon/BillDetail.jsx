import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { ref, remove, update } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../../../api/axiosInstance';
import { CANCEL_SERVICE, UPDATE_STATUS_BILL } from '../../../common/constants/apiConstants';
import { formatDateMonthYear, formatDateMonthYear2 } from '../../../common/utils/formatDate';
import { CustomBackdrop, CustomSnackbar } from '../../../components';
import CustomDialog from '../../../components/CustomDialog';
import StartFirebase from '../../../components/firebaseConfig';
import { STAFF_HOADON } from '../../../common/constants/pathConstants';

const db = StartFirebase()
const BillDetail = ({ item, dataFirebasePatient, setReload, reload,
    setTextSnackbar, setSeverity, setOpenSnackbar, setOpenBackdrop
}) => {
    // console.log(dataFirebasePatient);

    // console.log(item);
    // console.log(formatDateMonthYear(item?.billDateCreate));
    const navigate = useNavigate();
    const [trangThaiCapNhat, setTrangThaiCapNhat] = useState('')
    const [openPopupCancel, setOpenPopupCancel] = useState(false)

    const [currentService, setCurrentService] = useState()

    const [thanhToan, setThanhToan] = useState('no')

    const handleClosePopupCancel = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopupCancel(false);
    };
    const handleYesPopupCancel = async () => {
        try {
            setOpenPopupCancel(false);
            setOpenBackdrop(true)


            const response = await axiosPrivate.post(CANCEL_SERVICE, {
                "billDetailId": currentService?.billDetailId
            })
            if (dataFirebasePatient.length !== 0) {
                const lisSe = dataFirebasePatient[0]?.data?.record?.serviceHoaDon
                // console.log(lisSe);
                lisSe?.forEach((service, i) => {
                    if (service?.billDetailID == currentService?.billDetailId) {
                        lisSe.splice(i, 1);
                        update(ref(db, `${dataFirebasePatient[0]?.key}/record`), {
                            serviceHoaDon: lisSe
                        })
                    }
                })
                // dataFirebasePatient[0]?.data?.record?.serviceHoaDon?.forEach((service, i) => {
                //     if (service?.billDetailID == currentService?.billDetailId) {
                //         console.log(i);
                //         // update(ref(db, `${dataFirebasePatient[0]?.key}/record/serviceHoaDon/${i}`), {
                //         //     statusThanhToan: 'cancel'
                //         // })
                //         remove(ref(db, `${dataFirebasePatient[0]?.key}/record/serviceHoaDon/${i}`))
                //     }
                // });
            }

            setTextSnackbar('H???y b??? th??nh c??ng')
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
        // nh???n h???y b???, th?? g???i api, c???p nh???t tr???ng th??i h???y b???, x??a kh???i state d???ch v??? ????? load l???i table d???ch v???
        // c???p nh???t tr???ng th??i d???ch v??? h??a ????n trong firebase, c?? th??? b??? lu??n, ?? ph???i check
        // check xem c?? dataFirebasePatient hay ko, c?? payment Confirmation hay ko th?? m???i c???p nh???t
        setCurrentService(service)
        setOpenPopupCancel(true)

    }
    const handleCapNhat = async () => {
        if (trangThaiCapNhat == '') {
            setTextSnackbar('B???n ch??a ch???n tr???ng th??i c???p nh???t')
            setSeverity('warning')
            setOpenSnackbar(true)
            return
        }
        try {
            setOpenBackdrop(true)
            const response = await axiosPrivate.post(UPDATE_STATUS_BILL, {
                "billId": item?.billId,
                "status": trangThaiCapNhat
            })
            if (dataFirebasePatient.length !== 0) {
                // console.log('1');
                dataFirebasePatient[0]?.data?.record?.serviceHoaDon?.forEach((service, i) => {
                    if (service?.billID == item?.billId) {
                        // console.log(i);
                        update(ref(db, `${dataFirebasePatient[0]?.key}/record/serviceHoaDon/${i}`), {
                            statusThanhToan: 'roi'
                        })
                    }
                });
                if (dataFirebasePatient[0]?.data?.color == 'yd') {
                    update(ref(db, `${dataFirebasePatient[0]?.key}`), {
                        color: 'ye'
                    })
                }
            }
            if (trangThaiCapNhat == 'Cancel' || trangThaiCapNhat == 'Cancel 2') {
                remove(ref(db, `${dataFirebasePatient[0]?.key}`))
            }

            setTextSnackbar('C???p nh???t th??nh c??ng')
            setSeverity('success')
            setOpenSnackbar(true)

            setOpenBackdrop(false)

            setReload(!reload)
            const handler = setTimeout(() =>
                navigate(STAFF_HOADON, { replace: true }), 1000)
        } catch (error) {
            setOpenBackdrop(false)
            console.log(error);
        }
    }
    useEffect(() => {
        dataFirebasePatient[0]?.data?.record?.serviceHoaDon?.forEach((service, i) => {
            if (service?.billID == item?.billId) {
                setThanhToan('yes')
            }
        })
    }, [])
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
                            >
                                {thanhToan == 'yes' ?
                                    '* C???n thanh to??n cho l?????t kh??m n??y'
                                    // : null}
                                    : '* C???n thanh to??n cho l?????t kh??m n??y'}
                            </Grid>
                            <Grid container item direction='row' spacing={1}>
                                <Grid item sx={{ fontWeight: '500' }}>M?? h??a ????n:</Grid>
                                <Grid item>{item?.billId}</Grid>
                            </Grid>
                            <Grid container item direction='row' spacing={2}>
                                <Grid item sx={{ fontWeight: '500' }}>Ng??y t???o h??a ????n:</Grid>
                                <Grid item>{formatDateMonthYear2(item?.billDateCreate)}</Grid>
                            </Grid>
                            <Grid container item direction='row' spacing={2}>
                                <Grid item sx={{ fontWeight: '500' }}>Tr???ng th??i:</Grid>
                                <Grid item
                                    sx={{
                                        color: 'red'
                                    }}
                                >
                                    {item?.status == 'Unpaid' ? 'Ch??a thanh to??n'
                                        : '???? tr??? ti???n c???c'
                                    }
                                </Grid>
                            </Grid>
                            <Grid container item direction='row' spacing={2}>
                                <Grid item sx={{ fontWeight: '500' }}>T???ng ti???n:</Grid>
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
                                        <Grid item sx={{ fontWeight: '500' }}>S??? ti???n c???c:</Grid>
                                        <Grid item>
                                            {/* {new Intl.NumberFormat('vi-VN'
                                                , { style: 'currency', currency: 'VND' }
                                            ).format(item?.prepaid)} */}
                                            {item?.prepaid}
                                        </Grid>
                                    </Grid> : null
                            }
                            <Grid container item direction='row' spacing={2} sx={{ alignItems: 'center' }}>
                                <Grid item sx={{ fontWeight: '500' }}>C???p nh???t tr???ng th??i:</Grid>
                                <Grid item xs={3}>
                                    <FormControl fullWidth size='small'>
                                        <InputLabel id="capNhatStatus">Tr???ng th??i</InputLabel>
                                        <Select
                                            // size='small'
                                            labelId="capNhatStatus"
                                            id="demo-simple-select"
                                            value={trangThaiCapNhat}
                                            label="Tr???ng th??i"
                                            onChange={
                                                (event) => {
                                                    setTrangThaiCapNhat(event.target.value);
                                                }
                                            }
                                        >
                                            {
                                                item?.statusUpdates?.map((statusChange, iStatus) => (
                                                    <MenuItem key={iStatus} value={statusChange}>
                                                        {statusChange == 'Paid' ? '???? thanh to??n' :
                                                            (statusChange == 'Cancel' || statusChange == 'Cancel 2') ? 'H???y' :
                                                                '???? tr??? ti???n c???c'}
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
                                        C???p nh???t
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
                                            <TableCell align='center'>D???ch v???</TableCell>
                                            <TableCell align='center'>S??? l???n th???c hi???n (d??? ki???n)</TableCell>
                                            <TableCell align='center'>S??? l?????ng</TableCell>
                                            <TableCell align='center'>????n gi??</TableCell>
                                            <TableCell align='center'>Th??nh ti???n</TableCell>
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
                                                                >H???y b???</Button>
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
                text={`B???n ch???c ch???n mu???n h???y b??? d???ch v??? n??y`} />

        </>
    )
}

export default BillDetail