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
    dataFirebasePatient, setRecordID
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
    const [messageErrorDacTa, setMessageErrorDacTa] = useState('')
    const [messageErrorSoLanDuKien, setMessageErrorSoLanDuKien] = useState('')
    const [messageErrorSoLuong, setMessageErrorSoLuong] = useState('')


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
        if (newItem?.id == 'NRD' || newItem?.id == 'NRK') {
            newItem = { ...newItem, 'soLuong': 1, 'soLanDuKienThucHien': 20, dacTa: '' }
        } else {
            newItem = { ...newItem, 'soLuong': 1, 'soLanDuKienThucHien': 1, dacTa: '' }
        }

        var count = 0
        serviceList.forEach(element => {
            if (element?.idContinue != 1)
                if (newItem?.id === element?.id) count = 1;
        });

        if (count === 0) {
            setCurrentService(newItem)
            setMessageErrorSoLanDuKien('')
            setMessageErrorSoLuong('')
            setOpenPopupChooseService(true)
        }
        else return
    }
    const handleClosePopupChooseService = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setMessageErrorDacTa('')
        setOpenPopupChooseService(false);
    }
    const handleYesPopupChooseService = () => {
        if (currentService?.dacTa.trim() == '') {
            console.log('rong');
            setMessageErrorDacTa('Cần nhập đặc tả')
            return
        }
        if (messageErrorSoLanDuKien != '') {
            return
        }
        if (messageErrorSoLuong != '') {
            return
        }
        const newItem = { ...currentService, dacTa: currentService?.dacTa?.trim() }
        update(ref(db, `${location?.state?.patient?.key}/record`), {
            serviceList: [...serviceList, newItem]
        })
        setServiceList([...serviceList, newItem])
        setMessageErrorDacTa('')
        setOpenPopupChooseService(false)
    }

    const handleClosePopupUpdateService = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setMessageErrorDacTa('')
        setOpenPopupUpdateService(false);
    };

    const handleUpdateService = (item, i) => {
        setCurrentService({ ...item, index: i })
        setMessageErrorSoLanDuKien('')
        setMessageErrorSoLuong('')
        setOpenPopupUpdateService(true)
    }

    const handleYesPopupUpdateService = () => {
        if (currentService?.dacTa.trim() == '') {
            console.log('rong');
            setMessageErrorDacTa('Cần nhập đặc tả')
            return
        }
        if (messageErrorSoLanDuKien != '') {
            return
        }
        if (messageErrorSoLuong != '') {
            return
        }
        // console.log(currentService);
        const newItem = { ...currentService, dacTa: currentService?.dacTa?.trim() }
        const newList = [...serviceList]
        newList[currentService.index] = newItem
        // console.log(newList);
        update(ref(db, `${location?.state?.patient?.key}/record`), {
            serviceList: newList
        })
        setServiceList(newList)
        setMessageErrorDacTa('')
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
                    let newItem = {
                        serviceSpecification: item?.dacTa,
                        expectedPrice: item?.expectedPrice,
                        id: item?.id,
                        serviceName: item?.serviceDesc,
                        expectedTimes: item?.soLanDuKienThucHien,
                        quantity: item?.soLuong,
                        idContinue: 1,
                        billID: item?.billID,
                        billDetailID: item?.billDetailID,
                        serviceStatus: item?.serviceStatus,
                        statusThanhToan: item?.statusThanhToan
                    }
                    serviceDaCoHoaDon = [...serviceDaCoHoaDon, { ...newItem }]
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
            var serviceReted = []
            // gọi api cho service chưa tạo hóa đơn nếu có
            if (serviceRequest.length != 0) {
                const response = await axiosPublic.post(TAO_HOADON, {
                    "phoneNumber": param?.id,
                    "billDetailIds": serviceRequest
                })
                setRecordID(response.data.recordID)
                update(ref(db, `${location?.state?.patient?.key}/record`), {
                    recordID: response.data.recordID
                })
                serviceReted = response.data.billDetailResponse.map((item) => {
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
            setOpenBackdrop(false)
            setTaoHoaDon('')
            console.log(error);
        }
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
    useEffect(() => {
        console.log(currentService);
        if (currentService?.id == 'NRD' || currentService?.id == 'NRK') {
            if (currentService?.soLanDuKienThucHien < 20) {
                setMessageErrorSoLanDuKien('Số lần thực hiện dự kiến của niềng răng không nhỏ hơn 20 lần')
            } else {
                if (currentService?.soLanDuKienThucHien > 99) {
                    setMessageErrorSoLanDuKien('Số lần thực hiện dự kiến của niềng răng không lớn hơn 99 lần')
                } else {
                    setMessageErrorSoLanDuKien('')
                }
            }
        }
        else {
            if (currentService?.soLanDuKienThucHien > 30) {
                setMessageErrorSoLanDuKien('Số lần thực hiện dự kiến của dịch vụ này không nhiều hơn 30 lần')
            } else {
                setMessageErrorSoLanDuKien('')
            }
        }

        if (currentService?.dacTa?.trim() != '') {
            setMessageErrorDacTa('')
        }
        if (currentService?.soLanDuKienThucHien == '') {
            setMessageErrorSoLanDuKien('Cần nhập số lần thực hiện dự kiến')
        }
        if (currentService?.soLuong == '') {
            setMessageErrorSoLuong('Cần nhập số lượng')
        } else {
            setMessageErrorSoLuong('')
        }

    }, [currentService])
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
                        dataFirebasePatient[0]?.data?.record?.serviceHoaDon ?
                            <>
                                <br />
                                <Grid item>
                                    <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>
                                        Cập nhật trạng thái công tác điều trị
                                    </Typography>
                                </Grid>
                                {/* {serviceHoaDon?.map((item, i) => {
                                return (
                                    <> */}
                                <Grid item>
                                    <Table
                                        size="small"

                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">STT</TableCell>
                                                <TableCell align="center">Tên dịch vụ</TableCell>
                                                <TableCell align="center">Đặc tả</TableCell>
                                                <TableCell align="center">Số lượng</TableCell>
                                                <TableCell align="center">Số lần thực hiện (dự kiến)</TableCell>
                                                <TableCell align="left">Trạng thái</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {dataFirebasePatient[0]?.data?.record?.serviceHoaDon?.map((serviceHoaDonItem, iServiceHoaDon) => {
                                                return (
                                                    <TableRow key={iServiceHoaDon}>
                                                        <TableCell align='center' >{iServiceHoaDon + 1}</TableCell>
                                                        <TableCell align='center'>{serviceHoaDonItem?.serviceName}</TableCell>
                                                        <TableCell align='center'>
                                                            {serviceHoaDonItem?.serviceSpecification}
                                                        </TableCell>
                                                        <TableCell align='center'>{serviceHoaDonItem?.quantity}</TableCell>
                                                        <TableCell align='center'>{serviceHoaDonItem?.expectedTimes}</TableCell>
                                                        <TableCell align="left">
                                                            <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
                                                                <Select
                                                                    value={serviceHoaDonItem?.serviceStatus == 'Not Yet' ? 'In Progress' : serviceHoaDonItem?.serviceStatus}
                                                                    onChange={(event) => {
                                                                        var newList = [...serviceHoaDon]
                                                                        newList[iServiceHoaDon].serviceStatus = event.target.value
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
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </Grid>
                                {/* <Grid container item spacing={2} direction='row' sx={{ alignItems: 'center' }}
                                            key={i}
                                        >
                                            <Grid item >{item?.serviceDesc}</Grid>
                                            <Grid item >
                                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                                    <Select
                                                        value={item?.serviceStatus == 'Not Yet' ? '' : item?.serviceStatus}
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
                                        </Grid> */}
                                {/* </> */}
                                {/* )
                            // })} */}

                            </>
                            : <p>Không có dịch vụ cần làm</p>
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
                        {messageErrorDacTa != '' ?
                            <Grid container item>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={7}>
                                    <Typography sx={{ color: 'red' }}>{messageErrorDacTa}</Typography>
                                </Grid>
                            </Grid>
                            : null
                        }
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
                        {messageErrorSoLuong != '' ?
                            <Grid container item>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={7}>
                                    <Typography sx={{ color: 'red' }}>{messageErrorSoLuong}</Typography>
                                </Grid>
                            </Grid>
                            : null
                        }
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
                        {messageErrorSoLanDuKien != '' ?
                            <Grid container item>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={7}>
                                    <Typography sx={{ color: 'red' }}>{messageErrorSoLanDuKien}</Typography>
                                </Grid>
                            </Grid>
                            : null
                        }
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
                        {messageErrorDacTa != '' ?
                            <Grid container item>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={7}>
                                    <Typography sx={{ color: 'red' }}>{messageErrorDacTa}</Typography>
                                </Grid>
                            </Grid>
                            : null
                        }
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
                        {messageErrorSoLuong != '' ?
                            <Grid container item>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={7}>
                                    <Typography sx={{ color: 'red' }}>{messageErrorSoLuong}</Typography>
                                </Grid>
                            </Grid>
                            : null
                        }
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
                        {messageErrorSoLanDuKien != '' ?
                            <Grid container item>
                                <Grid item xs={3}></Grid>
                                <Grid item xs={7}>
                                    <Typography sx={{ color: 'red' }}>{messageErrorSoLanDuKien}</Typography>
                                </Grid>
                            </Grid>
                            : null
                        }
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