import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputAdornment, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import Tippy from '@tippyjs/react/headless'
import React, { useEffect, useState } from 'react'
import classNames from "classnames/bind"
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { onValue, ref, update } from 'firebase/database';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DoneIcon from '@mui/icons-material/Done';

import styles from '../../../../style/SearchTippy.module.scss'
import { axiosPrivate } from '../../../../api/axiosInstance'
import { LIST_SERVICE, TAO_HOADON } from '../../../../common/constants/apiConstants'
import { TaoHoaDonPopUp } from '../TaoHoaDonPopUp';
import { CustomBackdrop, CustomSnackbar } from '../../../../components';
import StartFirebase from "../../../../components/firebaseConfig"
import { DENTIST_DS_KHAM } from '../../../../common/constants/pathConstants';
import jwtDecode from 'jwt-decode';

const db = StartFirebase()
const cx = classNames.bind(styles)

const Service = ({ serviceList, setServiceList, serviceHoaDon, setServiceHoaDon, taoHoaDon, setTaoHoaDon,
    dataFirebasePatient, setRecordID
}) => {
    const location = useLocation()
    const param = useParams()
    const navigate = useNavigate();

    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    let userDentist
    if (loginInfo != undefined) {
        try {
            userDentist = jwtDecode(loginInfo?.token)
        } catch (error) {
            userDentist = ''
        }

    }

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

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [textSnackbar, setTextSnackbar] = useState('');
    const [severity, setSeverity] = useState('success');

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
            setSearchServiceResult([{ 'serviceDesc': 'Kh??ng t??m th???y d???ch v???' }])
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
        if (item?.serviceDesc == 'Kh??ng t??m th???y d???ch v???') {
            count = 1
        }
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
            // console.log('rong');
            setMessageErrorDacTa('C???n nh???p ?????c t???')
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
            // console.log('rong');
            setMessageErrorDacTa('C???n nh???p ?????c t???')
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
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }
    const handleTaoHoaDon = () => {
        if (dataFirebasePatient[0]?.data?.record?.motaList == undefined) {
            setTextSnackbar('C???n nh???p m?? t??? b???nh l??, c??ng t??c ??i???u tr??? tr?????c khi t???o ch??? ?????nh c??ng t??c ??i???u tr???')
            setSeverity('error')
            setOpenSnackbar(true)
            return
        }
        setOpenPopUpHoaDon(true);
    }
    const handleClosePopUpHoaDon = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopUpHoaDon(false);
        // console.log(dataFirebasePatient[0]?.data?.record?.motaList);
    }
    const handleYesPopUpHoaDon = async () => {
        // console.log(serviceList);
        // console.log(param?.id);
        setOpenPopUpHoaDon(false);
        try {
            // var serviceDaCoHoaDon = []
            // serviceList.forEach((item) => {
            //     if (item?.idContinue == 1) {
            //         let newItem = {
            //             serviceSpecification: item?.dacTa,
            //             expectedPrice: item?.expectedPrice,
            //             id: item?.id,
            //             serviceName: item?.serviceDesc,
            //             expectedTimes: item?.soLanDuKienThucHien,
            //             quantity: item?.soLuong,
            //             idContinue: 1,
            //             billID: item?.billID,
            //             billDetailID: item?.billDetailID,
            //             serviceStatus: item?.serviceStatus,
            //             statusThanhToan: item?.statusThanhToan,
            //             statusUpdate: item?.statusUpdate
            //         }
            //         serviceDaCoHoaDon = [...serviceDaCoHoaDon, { ...newItem }]
            //     }
            // })
            // console.log(serviceDaCoHoaDon);
            var serviceRequest = []
            serviceList.forEach((item) => {
                // console.log(item?.billDetailID);
                // if (item?.idContinue != 1) {
                serviceRequest = [...serviceRequest, {
                    'billDetailID': item?.billDetailID != undefined ? `${item?.billDetailID}` : "",
                    'serviceID': `${item?.id}`,
                    'quantity': `${item?.soLuong}`,
                    'price': `${item?.expectedPrice}`,
                    'serviceSpecification': `${item?.dacTa}`,
                    'expectedTimes': `${item?.soLanDuKienThucHien}`
                }]
                // }
            })
            // open backdrop
            setOpenBackdrop(true)
            setTaoHoaDon('dangTao')
            var serviceReted = []
            // g???i api cho service ch??a t???o h??a ????n n???u c??
            if (serviceRequest.length != 0) {
                const response = await axiosPrivate.post(TAO_HOADON, {
                    "phoneNumber": param?.id,
                    "recordDesc": dataFirebasePatient[0]?.data?.record?.motaList,
                    "billDetailIds": serviceRequest,
                    "dentistName": userDentist != '' ? userDentist?.fullName : userDentist
                })

                setRecordID(response.data.recordID)
                update(ref(db, `${location?.state?.patient?.key}/record`), {
                    recordID: response.data.recordID
                })
                serviceReted = response.data.billDetailResponse.map((item) => {
                    return { ...item, statusThanhToan: item?.billStatus == 'Paid' ? 'roi' : 'chua' }
                })
            }
            // console.log(serviceReted);
            // setServiceHoaDon(serviceList)  
            // const hoadonList = serviceDaCoHoaDon.concat(serviceReted)
            const hoadonList = serviceReted
            // console.log(hoadonList);
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
            if (xacNhanThanhToan == 0) {
                update(ref(db, `${location?.state?.patient?.key}`), {
                    color: 'yd',
                    status: 0
                })
                const handler = setTimeout(() =>
                    navigate(DENTIST_DS_KHAM, { replace: true }), 1000)
            }
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
                const response = await axiosPrivate.post(LIST_SERVICE)
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
        // console.log(currentService);
        if (currentService?.id == 'NRD' || currentService?.id == 'NRK') {
            if (currentService?.soLanDuKienThucHien < 20) {
                setMessageErrorSoLanDuKien('S??? l???n th???c hi???n d??? ki???n c???a ni???ng r??ng kh??ng nh??? h??n 20 l???n')
            } else {
                if (currentService?.soLanDuKienThucHien > 99) {
                    setMessageErrorSoLanDuKien('S??? l???n th???c hi???n d??? ki???n c???a ni???ng r??ng kh??ng l???n h??n 99 l???n')
                } else {
                    setMessageErrorSoLanDuKien('')
                }
            }
        }
        else {
            if (currentService?.soLanDuKienThucHien > 30) {
                setMessageErrorSoLanDuKien('S??? l???n th???c hi???n d??? ki???n c???a d???ch v??? n??y kh??ng nhi???u h??n 30 l???n')
            } else {
                setMessageErrorSoLanDuKien('')
            }
        }

        if (currentService?.dacTa?.trim() != '') {
            setMessageErrorDacTa('')
        }
        if (currentService?.soLanDuKienThucHien == '') {
            setMessageErrorSoLanDuKien('C???n nh???p s??? l???n th???c hi???n d??? ki???n')
        }
        if (currentService?.soLuong == '') {
            setMessageErrorSoLuong('C???n nh???p s??? l?????ng')
        } else {
            setMessageErrorSoLuong('')
        }

    }, [currentService])
    // console.log(currentService);
    return (
        <>
            <Grid item>
                <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>2. Phi???u ch??? ?????nh</Typography>
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
                        placeholder='T??m ki???m d???ch v???...'
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
                    <Grid item><Typography variant='subtitle1' sx={{ fontWeight: '500' }}>Danh s??ch ch??? ?????nh</Typography></Grid>
                    <Grid item>
                        <Table size="small" >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell align="center">T??n d???ch v???</TableCell>
                                    <TableCell align="center">?????c t???</TableCell>
                                    <TableCell align="center">S??? l?????ng</TableCell>
                                    <TableCell align="center">S??? l???n th???c hi???n (d??? ki???n)</TableCell>
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
                                            {item?.idContinue == 1 ? <TableCell align='center'>??i???u tr??? ti???p t???c</TableCell> :
                                                <TableCell align='center'>
                                                    <Button
                                                        disabled={taoHoaDon === 'daTao' ? true : false}
                                                        onClick={() => {
                                                            handleUpdateService(item, i)
                                                        }}>C???p nh???t</Button>
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
                                sx={{ marginTop: '15px' }}
                                variant='contained'
                                disableElevation
                                onClick={handleTaoHoaDon}
                                disabled={(taoHoaDon === 'daTao' || taoHoaDon === 'dangTao') ? true : false}
                                startIcon={(taoHoaDon === 'dangTao') ? <CircularProgress size='0.9rem' /> : null}
                            >
                                {taoHoaDon === '' && 'T???o ch??? ?????nh c??ng t??c ??i???u tr???'}
                                {taoHoaDon === 'dangTao' && '??ang t???o ch??? ?????nh c??ng t??c ??i???u tr???'}
                                {taoHoaDon === 'daTao' && '???? t???o ch??? ?????nh c??ng t??c ??i???u tr???'}

                            </Button>
                        </Grid>
                        {dataFirebasePatient[0]?.data?.record?.paymentConfirmation !== undefined ?
                            <Grid item>
                                <Button
                                    sx={{ marginTop: '15px' }}
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
                                    {dataFirebasePatient[0]?.data?.record?.paymentConfirmation === 0 && 'Ch??? x??? l?? x??c nh???n thanh to??n'}
                                    {dataFirebasePatient[0]?.data?.record?.paymentConfirmation === 1 && '???? x??c nh???n thanh to??n xong'}

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
                                        C???p nh???t tr???ng th??i c??ng t??c ??i???u tr???
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
                                                <TableCell align="center">T??n d???ch v???</TableCell>
                                                <TableCell align="center">?????c t???</TableCell>
                                                <TableCell align="center">S??? l?????ng</TableCell>
                                                <TableCell align="center">S??? l???n th???c hi???n (d??? ki???n)</TableCell>
                                                <TableCell align="left">Tr???ng th??i</TableCell>
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
                                                                    {/* <MenuItem value={'In Progress'}>Ch??a ho??n t???t</MenuItem>
                                                                    <MenuItem value={'Done'}>Ho??n t???t</MenuItem> */}
                                                                    {
                                                                        serviceHoaDonItem?.statusUpdate?.map((statusChange, iStatus) => (
                                                                            <MenuItem key={iStatus} value={statusChange}>
                                                                                {statusChange == 'In Progress' ? 'Ch??a ho??n t???t' : 'Ho??n t???t'}
                                                                            </MenuItem>
                                                                        ))
                                                                    }
                                                                </Select>
                                                            </FormControl>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </>
                            : <p>Kh??ng c?? d???ch v??? c???n l??m</p>
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
                        }}>C??ng t??c ??i???u tr???</Typography>
                    </Box>
                    <Grid container spacing={2} direction='column'>
                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>T??n d???ch v???</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography>{currentService?.serviceDesc}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>?????c t??? *</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    variant='standard'
                                    helperText='?????c t??? c??ng t??c ??i???u tr???'
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
                                <Typography>S??? l?????ng *</Typography>
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
                                <Typography>S??? l???n th???c hi???n (d??? ki???n) *</Typography>
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
                    <Button onClick={handleClosePopupChooseService}>H???y</Button>
                    <Button onClick={handleYesPopupChooseService}>L??u</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openPopupUpdateService} onClose={handleClosePopupUpdateService}
                PaperProps={{ sx: { position: 'fixed', top: '25px' } }}
                fullWidth>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                        <Typography variant="h6" sx={{

                            color: '#0f3eb4'
                        }}>C??ng t??c ??i???u tr???</Typography>
                    </Box>
                    <Grid container spacing={2} direction='column'>
                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>T??n d???ch v???</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography>{currentService?.serviceDesc}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>?????c t??? *</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    variant='standard'
                                    helperText='?????c t??? c??ng t??c ??i???u tr???'
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
                                <Typography>S??? l?????ng *</Typography>
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
                                <Typography>S??? l???n th???c hi???n (d??? ki???n) *</Typography>
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
                    <Button onClick={handleClosePopupUpdateService}>H???y</Button>
                    <Button onClick={handleYesPopupUpdateService}>C???p nh???t</Button>
                </DialogActions>
            </Dialog>
            <TaoHoaDonPopUp open={openPopUpHoaDon} handleClose={handleClosePopUpHoaDon} handleYes={handleYesPopUpHoaDon} />
            <CustomBackdrop open={openBackdrop} />
            <CustomSnackbar handleClose={handleCloseSnackbar}
                open={openSnackbar}
                text={textSnackbar}
                severity={severity}
                variant='standard'
                vertical='top'
                horizontal='right' />
        </>
    )
}

export default Service