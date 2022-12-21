import { Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { axiosPrivate } from '../../../../api/axiosInstance'
import { GET_RECORDS_BY_BILL_DETAIL } from '../../../../common/constants/apiConstants'
import { formatDateMonthYear2 } from '../../../../common/utils/formatDate'

const RelatedHistory = ({ open, handleClose, billDetailHistory }) => {
    const [records, setRecords] = useState()
    useEffect(() => {
        let isMounted = true;
        const getRecord = async () => {
            try {
                setRecords()
                const response = await axiosPrivate.post(GET_RECORDS_BY_BILL_DETAIL, {
                    "billDetailId": billDetailHistory
                })
                isMounted && setRecords(response.data)
            } catch (error) {
                setRecords([])
                console.log(error);
            }
        }
        if (billDetailHistory != undefined) {
            getRecord()
        }

        return () => {
            isMounted = false;
        }
    }, [billDetailHistory])
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogContent>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Typography
                            variant='h6'

                        >Các dental care record liên quan</Typography>
                    </Box>
                    {records == undefined &&
                        <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '15px' }}>
                            <CircularProgress />
                        </Box>
                    }
                    {records?.length == '0' && 'Không có lịch sử khám'}
                    {
                        records?.length != '0' &&

                        records?.map((item, i) => {
                            return (
                                <Card
                                    square={true}
                                    sx={{
                                        marginBottom: '10px'
                                        // boxShadow: 'none',
                                        // border: 'blue 1px solid'
                                    }}
                                    key={i}
                                >
                                    <CardContent>
                                        <Grid container direction='column' spacing={2}>
                                            <Grid container item direction='row' spacing={2}>
                                                <Grid item sx={{ fontWeight: '500' }}>Ngày khám:</Grid>
                                                <Grid item>{item?.examinationDate != '' ?
                                                    formatDateMonthYear2(item?.examinationDate)
                                                    : null
                                                }</Grid>
                                            </Grid>

                                            <Grid container item direction='row' spacing={2}>
                                                <Grid item sx={{ fontWeight: '500' }}>Ngày tái khám:</Grid>
                                                <Grid item>{item?.reExaminationDate != '' ?
                                                    formatDateMonthYear2(item?.reExaminationDate) : null
                                                }
                                                </Grid>
                                            </Grid>

                                            <Grid container item direction='column' spacing={1}>
                                                <Grid item sx={{ fontWeight: '500' }}>Mô tả bệnh lí, công tác điều trị:</Grid>
                                                {item?.recordDescList?.length != 0 ?
                                                    item?.recordDescList?.map((mota, motaIndex) => (
                                                        <Grid item key={motaIndex}>{mota}</Grid>
                                                    ))
                                                    : null
                                                }
                                            </Grid>

                                            <Grid container item direction='column' spacing={1}>
                                                <Grid item sx={{ fontWeight: '500' }}>Công tác điều trị:</Grid>
                                                {item?.serviceList?.length != 0 ?
                                                    <Grid item>
                                                        <Table
                                                            size="small"
                                                            sx={{ border: '#ddd 1px solid' }}
                                                        >
                                                            <TableHead>
                                                                <TableRow sx={{ backgroundColor: '#f2f2f2' }}>
                                                                    <TableCell align='center'>STT</TableCell>
                                                                    <TableCell align='center'>Dịch vụ</TableCell>
                                                                    <TableCell align='center'>Đặc tả</TableCell>
                                                                    <TableCell align='center'>Số lượng</TableCell>
                                                                    <TableCell align='center'>Số lần thực hiện dự kiến</TableCell>
                                                                    <TableCell align='center'>Trạng thái</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {item?.serviceList?.length != 0 ?
                                                                    item?.serviceList?.map((service, serviceIndex) => (
                                                                        <TableRow key={serviceIndex}>
                                                                            <TableCell align='center'>
                                                                                {serviceIndex + 1}
                                                                            </TableCell>
                                                                            <TableCell align='center'>
                                                                                {service?.serviceName}
                                                                            </TableCell>
                                                                            <TableCell align='center'>
                                                                                {service?.serviceDesc}
                                                                            </TableCell>
                                                                            <TableCell align='center'>
                                                                                {service?.serviceQuantity}
                                                                            </TableCell>
                                                                            <TableCell align='center'>
                                                                                {service?.serviceExpectedTimes}
                                                                            </TableCell>
                                                                            {service?.serviceStatus == 'Cancel' ?
                                                                                <TableCell align='center' sx={{ color: 'red', borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                                    Đã hủy bỏ
                                                                                </TableCell> :
                                                                                <TableCell align='center' sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
                                                                                    {service?.serviceStatus == 'In Progress' ? 'Chưa hoàn tất' :
                                                                                        service?.serviceStatus == 'Done' ? 'Hoàn tất' :
                                                                                            'Chưa làm'}
                                                                                </TableCell>
                                                                            }
                                                                        </TableRow>
                                                                    ))
                                                                    : null
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </Grid>
                                                    : null}
                                            </Grid>

                                            <Grid container item direction='column' spacing={1}>
                                                <Grid item sx={{ fontWeight: '500' }}>Đơn thuốc:</Grid>
                                                {item?.prescription?.length != 0 ?
                                                    <Grid item>
                                                        <Table
                                                            size="small"
                                                            sx={{ border: '#ddd 1px solid' }}
                                                        >
                                                            <TableHead>
                                                                <TableRow sx={{ backgroundColor: '#f2f2f2' }}>
                                                                    <TableCell align='center'>STT</TableCell>
                                                                    <TableCell align='center'>Thuốc</TableCell>
                                                                    <TableCell align='center'>Số lượng</TableCell>
                                                                    <TableCell align='center'>Liều dùng</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {item?.prescription?.length != 0 ?
                                                                    item?.prescription?.map((thuoc, thuocIndex) => (
                                                                        <TableRow key={thuocIndex}>
                                                                            <TableCell align='center'>
                                                                                {thuocIndex + 1}
                                                                            </TableCell>
                                                                            <TableCell align='center'>
                                                                                {thuoc?.drugName}
                                                                            </TableCell>
                                                                            <TableCell align='center'>
                                                                                {thuoc?.quantity}
                                                                            </TableCell>
                                                                            <TableCell align='center'>
                                                                                {thuoc?.dosage}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                    : null
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </Grid>
                                                    : null}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )
                        })

                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Đóng</Button>
                </DialogActions>
            </Dialog>
            {/* <CustomBackdrop open={openBackdrop} /> */}
        </>
    )
}

export default RelatedHistory