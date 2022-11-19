import { Card, CardContent, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";
import { axiosPrivate } from "../../../api/axiosInstance";
import { GET_RECORDS } from "../../../common/constants/apiConstants";
import { formatDateMonthYear2 } from "../../../common/utils/formatDate";
import { CustomBackdrop } from "../../../components";


const HistoryRecord = () => {
    const [records, setRecords] = useState()
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [message, setMessage] = useState('')
    const location = useLocation();
    console.log(location?.state?.patient);

    useEffect(() => {
        let isMounted = true;
        const getRecord = async () => {
            try {

                setOpenBackdrop(true)
                const response = await axiosPrivate.post(GET_RECORDS, {
                    "phoneNumber": location?.state?.patient?.phoneNumber
                })
                setMessage('')
                isMounted && setRecords(response.data)
                setOpenBackdrop(false)
            } catch (error) {
                console.log(error);
                if (error?.response?.status == '417') {
                    setMessage('Không có lịch sử khám')
                } else {
                    setMessage(error?.message)
                }
                setOpenBackdrop(false)
            }
        }
        getRecord()
        return () => {
            isMounted = false;
        }
    }, [])
    console.log(records);
    return (
        <>
            <div>
                <Grid container direction={'column'}>
                    <Grid container item direction='row' spacing={2}>
                        <Grid item xs={1.5}>
                            <Typography>Bệnh nhân</Typography>
                        </Grid>
                        <Grid item >
                            <Typography>
                                {
                                    location?.state?.patient?.fullName
                                }
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction='row' spacing={2}>
                        <Grid item xs={1.5}>
                            <Typography>Số điện thoại</Typography>
                        </Grid>
                        <Grid item >
                            <Typography>
                                {location?.state?.patient?.phoneNumber}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item direction='row' spacing={2}>
                        <Grid item xs={1.5}>
                            <Typography>Địa chỉ</Typography>
                        </Grid>
                        <Grid item >
                            <Typography>
                                {
                                    location?.state?.patient?.address
                                }
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <br />
                {/* <div style={{
                    // display: 'flex',
                    // justifyContent: 'center',
                    color: 'blue'
                }}>
                    <Typography variant="h6">Lịch sử khám bệnh</Typography>
                </div> */}
                <br />

                {message != '' && 'Không có lịch sử khám'}
                {records?.length != '0' &&
                    records?.map((item, i) => {
                        return (

                            <Card
                                square={true}
                                sx={{
                                    marginBottom: '20px',
                                    width: '65%'
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
                                                                <TableCell></TableCell>
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
                                                                            null
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

            </div>
            <CustomBackdrop open={openBackdrop} />
        </>
    )
}

export default HistoryRecord