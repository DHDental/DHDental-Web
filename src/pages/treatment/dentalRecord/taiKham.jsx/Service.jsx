import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputAdornment, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import Tippy from '@tippyjs/react/headless'
import React, { useEffect, useState } from 'react'
import classNames from "classnames/bind"
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { onValue, ref, update } from 'firebase/database';
import { useLocation, useParams } from 'react-router-dom';
import DoneIcon from '@mui/icons-material/Done';

import styles from '../../../../style/SearchTippy.module.scss'
import { axiosPublic } from '../../../../api/axiosInstance'
import { LIST_SERVICE, TAO_HOADON } from '../../../../common/constants/apiConstants'
import { TaoHoaDonPopUp } from '../TaoHoaDonPopUp';
import { CustomBackdrop } from '../../../../components';
import StartFirebase from "../../../../components/firebaseConfig"

const db = StartFirebase()
const cx = classNames.bind(styles)

const Service = ({ serviceList, setServiceList, serviceHoaDon, setServiceHoaDon, taoHoaDon, setTaoHoaDon,
    dataFirebasePatient
}) => {
    const location = useLocation()
    const param = useParams()

    const [loadingService, setLoadingService] = useState(false)
    const [allService, setAllService] = useState([])
    const [showServiceResult, setShowServiceResult] = useState(true)
    const [searchServiceResult, setSearchServiceResult] = useState([])
    const [searchServiceTerm, setSearchServiceTerm] = useState('')
    const [currentService, setCurrentService] = useState({})
    const [openPopupChooseService, setOpenPopupChooseService] = useState(false)

    const [openPopupUpdateService, setOpenPopupUpdateService] = useState(false)

    const [openPopUpHoaDon, setOpenPopUpHoaDon] = useState(false)
    const [openBackdrop, setOpenBackdrop] = useState(false)



    const handleHideServiceResult = () => {
        setShowServiceResult(false)
    }
    const handleSearchChange = (e) => {
        setSearchServiceTerm(e.target.value)
        if (!e.target.value.trim()) {
            setSearchServiceResult([])
            return
        }
        const resultsArray = allService.filter(item =>
            item.serviceDesc.toLowerCase().includes(e.target.value.trim().toLowerCase()))
        if (resultsArray.length === 0) {
            setSearchServiceResult([{ 'serviceDesc': 'Không tìm thấy dịch vụ' }])
        } else { setSearchServiceResult(resultsArray) }
    }

    const handleChooseService = (item) => {
        setShowServiceResult(!showServiceResult)

        let newItem = { ...item }
        newItem = { ...newItem, 'soLuong': 1, 'soLanDuKienThucHien': 1, dacTa: '' }

        var count = 0
        serviceList.forEach(element => {
            if (element?.idContinue != 1)
                if (newItem?.id === element?.id) count = 1;
        });

        if (count === 0) {
            setCurrentService(newItem)
            setOpenPopupChooseService(true)
            // setServiceList([...serviceList, newItem])
        }
        else return
    }
    const handleClosePopupChooseService = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopupChooseService(false);
    }
    const handleYesPopupChooseService = () => {
        const newItem = { ...currentService, dacTa: currentService?.dacTa?.trim() }
        update(ref(db, `${location?.state?.patient?.key}/record`), {
            serviceList: [...serviceList, newItem]
        })
        setServiceList([...serviceList, newItem])
        // setCurrentService({})
        setOpenPopupChooseService(false)
        // console.log(currentService);
        // const newList = [...serviceList]
        // newList[currentService.index] = currentService
        // // console.log(newList);
        // setServiceList(newList)
        // setOpenPopupChooseService(false);
    }

    const handleClosePopupUpdateService = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopupUpdateService(false);
    };

    const handleUpdateService = (item, i) => {
        setCurrentService({ ...item, index: i })
        setOpenPopupUpdateService(true)
    }

    const handleYesPopupUpdateService = () => {
        // console.log(currentService);
        const newItem = { ...currentService, dacTa: currentService?.dacTa?.trim() }
        const newList = [...serviceList]
        newList[currentService.index] = newItem
        // console.log(newList);
        update(ref(db, `${location?.state?.patient?.key}/record`), {
            serviceList: newList
        })
        setServiceList(newList)
        setOpenPopupUpdateService(false);
    }

    const removeInServiceList = (i) => {
        const newList = [...serviceList]
        // console.log(newList);
        if (i !== -1) {
            newList.splice(i, 1);
            update(ref(db, `${location?.state?.patient?.key}/record`), {
                serviceList: newList
            })
            setServiceList(newList);
        }
    }

    const handleTaoHoaDon = () => {
        setOpenPopUpHoaDon(true);
    }
    const handleClosePopUpHoaDon = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopUpHoaDon(false);
    }
    const handleYesPopUpHoaDon = async () => {
        console.log(serviceList);
        // console.log(param?.id);
        setOpenPopUpHoaDon(false);
        try {
            var serviceDaCoHoaDon = []
            serviceList.forEach((item) => {
                if (item?.idContinue == 1) {
                    serviceDaCoHoaDon = [...serviceDaCoHoaDon, { ...item }]
                }
            })
            // console.log(serviceDaCoHoaDon);
            var serviceRequest = []
            serviceList.forEach((item) => {
                if (item?.idContinue != 1) {
                    serviceRequest = [...serviceRequest, {
                        'serviceID': `${item?.id}`,
                        'quantity': `${item?.soLuong}`,
                        'price': `${item?.expectedPrice}`,
                        'serviceSpecification': `${item?.dacTa}`,
                        'expectedTimes': `${item?.soLanDuKienThucHien}`
                    }]
                }
            })

            // open backdrop
            setOpenBackdrop(true)
            setTaoHoaDon('dangTao')
            // gọi api cho service chưa tạo hóa đơn nếu có
            var serviceReted = []
            if (serviceRequest.length !== 0) {

                serviceReted = serviceRequest.map((item) => {
                    return { ...item, statusThanhToan: 'chua' }
                })

            }
            console.log(serviceReted);
            // setServiceHoaDon(serviceList)  
            const hoadonList = serviceDaCoHoaDon.concat(serviceReted)
            console.log(hoadonList);
            let xacNhanThanhToan = 1
            hoadonList.forEach((item) => {
                if (item?.statusThanhToan == 'chua') {
                    xacNhanThanhToan = 0
                }
            })

            setServiceHoaDon(hoadonList)
            update(ref(db, `${location?.state?.patient?.key}/record`), {
                paymentConfirmation: xacNhanThanhToan,
                serviceHoaDon: hoadonList
            })
            setOpenBackdrop(false)
            setTaoHoaDon('daTao')
            setSearchServiceTerm('')
        } catch (error) {

        }
        // try {
        //     var serviceRequest = []
        //     serviceList.forEach((item) => {
        //         serviceRequest = [...serviceRequest, {
        //             'serviceID': item?.id,
        //             'quantity': `${item?.soLuong}`,
        //             'price': '100',
        //             'expectedNumberTimes': `${item?.soLanDuKienThucHien}`
        //         }]
        //     })
        //     // console.log('serviceRequest', serviceRequest);
        //     // open backdrop
        //     setOpenBackdrop(true)
        //     setTaoHoaDon('dangTao')
        //     // console.log({
        //     //     "serviceRequest": serviceRequest,
        //     //     "userId": param?.id
        //     // });


        //     const response = await axiosPublic.post(TAO_HOADON, {
        //         "serviceRequest": serviceRequest,
        //         "userId": param?.id
        //     })

        //     setServiceHoaDon(serviceList)

        //     update(ref(db, `${location?.state?.patient?.key}/record`), {
        //         paymentConfirmation: 0,
        //         serviceHoaDon: serviceList
        //     })
        //     setOpenBackdrop(false)
        //     setTaoHoaDon('daTao')
        //     setSearchServiceTerm('')
        //     // console.log(response.data);
        // } catch (error) {
        //     setOpenBackdrop(false)
        //     setTaoHoaDon('')
        //     console.log(error);
        // }
    }

    useEffect(() => {
        let isMounted = true;
        const getService = async () => {
            try {
                setLoadingService(true)
                const response = await axiosPublic.post(LIST_SERVICE)
                // console.log(response.data);
                isMounted && setAllService(response.data)
                setLoadingService(false)
            } catch (error) {
                setLoadingService(false)
                console.log(error);
            }
        }
        getService()
        return () => {
            isMounted = false;
        }
    }, [])
    // console.log(currentService);
    return (
        <>
            <Grid item>
                <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>2. Phiếu chỉ định</Typography>
            </Grid>

            <Grid item>

                <Tippy
                    render={attrs => (
                        <div className={cx('resultSearchBox')} tabIndex="-1" {...attrs}>
                            {

                                searchServiceResult.map((item, i) => (
                                    <div className={cx('resultSearchItem')} key={i}
                                        onClick={() => {
                                            handleChooseService(item)
                                        }}>
                                        <Typography>{item?.serviceDesc}</Typography>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                    placement='bottom-start'
                    interactive={true}
                    visible={showServiceResult && searchServiceResult.length > 0}
                    onClickOutside={handleHideServiceResult}
                >
                    <TextField
                        variant='standard'
                        sx={{ width: '41.25%' }}
                        value={searchServiceTerm}
                        placeholder='Tìm kiếm dịch vụ...'
                        disabled={taoHoaDon === 'daTao' ? true : false}
                        onFocus={() => setShowServiceResult(true)}
                        onChange={handleSearchChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {loadingService && <CircularProgress size='18px' />}
                                </InputAdornment>
                            ),
                        }}
                    />
                </Tippy>

            </Grid>
            {serviceList.length !== 0 ?
                <>
                    <br />
                    <Grid item><Typography variant='subtitle1' sx={{ fontWeight: '500' }}>Danh sách chỉ định</Typography></Grid>
                    <Grid item>
                        <Table size="small" >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell align="center">Tên dịch vụ</TableCell>
                                    <TableCell align="center">Đặc tả</TableCell>
                                    <TableCell align="center">Số lượng</TableCell>
                                    <TableCell align="center">Số lần thực hiện (dự kiến)</TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {serviceList.map((item, i) => {

                                    return (
                                        <TableRow key={i}>
                                            <TableCell align='center' >{i + 1}</TableCell>
                                            <TableCell align='center'>{item?.serviceDesc}</TableCell>
                                            <TableCell align='center'>
                                                {/* {new Intl.NumberFormat('vi-VN'
                                                    , { style: 'currency', currency: 'VND' }
                                                ).format(item?.gia)} */}
                                                {item?.dacTa}
                                            </TableCell>
                                            <TableCell align='center'>{item?.soLuong}</TableCell>
                                            <TableCell align='center'>{item?.soLanDuKienThucHien}</TableCell>
                                            {item?.idContinue == 1 ? <TableCell align='center'>Điều trị tiếp tục</TableCell> :
                                                <TableCell align='center'>
                                                    <Button
                                                        disabled={taoHoaDon === 'daTao' ? true : false}
                                                        onClick={() => {
                                                            handleUpdateService(item, i)
                                                        }}>Cập nhật</Button>
                                                </TableCell>
                                            }
                                            <TableCell align='center'>
                                                <IconButton
                                                    disabled={taoHoaDon === 'daTao' ? true : false}
                                                    onClick={() => { removeInServiceList(i) }}
                                                >
                                                    <PlaylistRemoveIcon sx={{
                                                        color: `${taoHoaDon === 'daTao' ? 'grey' : 'red'}`
                                                    }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid container item spacing={2}>
                        <Grid item>
                            <Button
                                variant='contained'
                                disableElevation
                                onClick={handleTaoHoaDon}
                                disabled={(taoHoaDon === 'daTao' || taoHoaDon === 'dangTao') ? true : false}
                                startIcon={(taoHoaDon === 'dangTao') ? <CircularProgress size='0.9rem' /> : null}
                            >
                                {taoHoaDon === '' && 'Tạo chỉ định công tác điều trị'}
                                {taoHoaDon === 'dangTao' && 'Đang tạo chỉ định công tác điều trị'}
                                {taoHoaDon === 'daTao' && 'Đã tạo chỉ định công tác điều trị'}

                            </Button>
                        </Grid>
                        {dataFirebasePatient[0]?.data?.record?.paymentConfirmation !== undefined ?
                            <Grid item>
                                <Button
                                    variant='outlined'
                                    disableElevation

                                    // disabled={(taoHoaDon === 'daTao' || taoHoaDon === 'dangTao') ? true : false}
                                    startIcon={(dataFirebasePatient[0]?.data?.record?.paymentConfirmation === 0) ?
                                        null
                                        // <CircularProgress size='0.9rem' />
                                        : (dataFirebasePatient[0]?.data?.record?.paymentConfirmation === 1) ? <DoneIcon

                                        />
                                            : null}
                                >
                                    {dataFirebasePatient[0]?.data?.record?.paymentConfirmation === 0 && 'Chờ xử lí xác nhận thanh toán'}
                                    {dataFirebasePatient[0]?.data?.record?.paymentConfirmation === 1 && 'Đã xác nhận thanh toán xong'}

                                </Button>
                            </Grid> : null
                        }
                    </Grid>
                    {dataFirebasePatient[0]?.data?.record?.paymentConfirmation == '1' ?
                        <>
                            <br />
                            <Grid item>
                                <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>
                                    Cập nhật trạng thái công tác điều trị
                                </Typography>
                            </Grid>
                            {serviceHoaDon?.map((item, i) => {
                                return (

                                    <Grid container item spacing={2} direction='row' sx={{ alignItems: 'center' }}
                                        key={i}
                                    >
                                        <Grid item >{item?.serviceDesc}</Grid>
                                        <Grid item >
                                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>

                                                <Select
                                                    value={item?.serviceStatus}

                                                    onChange={(event) => {
                                                        var newList = [...serviceHoaDon]
                                                        newList[i].serviceStatus = event.target.value
                                                        setServiceHoaDon(newList)
                                                        update(ref(db, `${location?.state?.patient?.key}/record`), {

                                                            serviceHoaDon: serviceHoaDon
                                                        })
                                                    }}
                                                >
                                                    <MenuItem value={'In Progress'}>Chưa hoàn tất</MenuItem>
                                                    <MenuItem value={'Done'}>Hoàn tất</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>



                                    </Grid>)
                            })}

                        </>
                        : null}

                </>
                : null}
            < Dialog open={openPopupChooseService} onClose={handleClosePopupChooseService}
                PaperProps={{ sx: { position: 'fixed', top: '25px' } }}
                fullWidth>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                        <Typography variant="h6" sx={{

                            color: '#0f3eb4'
                        }}>Công tác điều trị</Typography>
                    </Box>
                    <Grid container spacing={2} direction='column'>
                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>Tên dịch vụ</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography>{currentService?.serviceDesc}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>Đặc tả</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    variant='standard'
                                    helperText='Đặc tả công tác điều trị'
                                    value={currentService?.dacTa}
                                    onChange={(e) => {
                                        setCurrentService({ ...currentService, dacTa: e.target.value })
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>Số lượng</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    type='number'
                                    min={1}
                                    variant='standard'
                                    required
                                    value={currentService?.soLuong}
                                    onChange={(e) => {
                                        var soLuongNhap = e.target.value
                                        if (e.target.value < 1 && e.target.value !== '') soLuongNhap = 1
                                        setCurrentService({ ...currentService, soLuong: soLuongNhap })
                                    }}
                                    InputProps={{
                                        inputProps: {
                                            min: 1
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>Số lần thực hiện (dự kiến)</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    type='number'
                                    min={1}
                                    variant='standard'
                                    required
                                    value={currentService?.soLanDuKienThucHien}
                                    onChange={(e) => {
                                        var soLanDuKienThucHien = e.target.value
                                        if (e.target.value < 1 && e.target.value !== '') soLanDuKienThucHien = 1

                                        setCurrentService({ ...currentService, soLanDuKienThucHien: soLanDuKienThucHien })
                                    }}
                                    InputProps={{
                                        inputProps: {
                                            // type: 'number',
                                            min: 1
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopupChooseService}>Hủy</Button>
                    <Button onClick={handleYesPopupChooseService}>Lưu</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openPopupUpdateService} onClose={handleClosePopupUpdateService}
                PaperProps={{ sx: { position: 'fixed', top: '25px' } }}
                fullWidth>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                        <Typography variant="h6" sx={{

                            color: '#0f3eb4'
                        }}>Công tác điều trị</Typography>
                    </Box>
                    <Grid container spacing={2} direction='column'>
                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>Tên dịch vụ</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography>{currentService?.serviceDesc}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>Đặc tả</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    variant='standard'
                                    helperText='Đặc tả công tác điều trị'
                                    value={currentService?.dacTa}
                                    onChange={(e) => {
                                        setCurrentService({ ...currentService, dacTa: e.target.value })
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>Số lượng</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    type='number'
                                    min={1}
                                    variant='standard'
                                    required
                                    value={currentService?.soLuong}
                                    onChange={(e) => {
                                        var soLuongNhap = e.target.value
                                        if (e.target.value < 1 && e.target.value !== '') soLuongNhap = 1
                                        setCurrentService({ ...currentService, soLuong: soLuongNhap })
                                    }}
                                    InputProps={{
                                        inputProps: {
                                            min: 1
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>Số lần thực hiện (dự kiến)</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    type='number'
                                    min={1}
                                    variant='standard'
                                    required
                                    value={currentService?.soLanDuKienThucHien}
                                    onChange={(e) => {
                                        var soLanDuKienThucHien = e.target.value
                                        if (e.target.value < 1 && e.target.value !== '') soLanDuKienThucHien = 1

                                        setCurrentService({ ...currentService, soLanDuKienThucHien: soLanDuKienThucHien })
                                    }}
                                    InputProps={{
                                        inputProps: {
                                            // type: 'number',
                                            min: 1
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopupUpdateService}>Hủy</Button>
                    <Button onClick={handleYesPopupUpdateService}>Cập nhật</Button>
                </DialogActions>
            </Dialog>
            <TaoHoaDonPopUp open={openPopUpHoaDon} handleClose={handleClosePopUpHoaDon} handleYes={handleYesPopUpHoaDon} />
            <CustomBackdrop open={openBackdrop} />
        </>
    )
}

export default Service