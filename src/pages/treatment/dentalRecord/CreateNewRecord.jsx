import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from "classnames/bind"
import DoneIcon from '@mui/icons-material/Done';

import styles from '../../../style/SearchTippy.module.scss'
// import { useDebounce } from "../../../hooks";
import { axiosPublic } from '../../../api/axiosInstance';
import { LIST_SERVICE, TAO_HOADON } from '../../../common/constants/apiConstants';
import { TaoHoaDonPopUp } from './TaoHoaDonPopUp';
import { useLocation, useParams } from 'react-router-dom';
import { CustomBackdrop } from '../../../components';
import StartFirebase from '../../../components/firebaseConfig'
import { onValue, ref, update } from 'firebase/database';

const db = StartFirebase()
const cx = classNames.bind(styles)

// những thứ cần lưu trong 1 session khám bệnh :
// motaList ?
// serviceList -- sau khi tao hoa don, serviceHoaDon
// taoHoaDon
// thuocList ?

const serviceHoaDonTest = [
    {
        "serviceName": "Trám răng",
        "billDetailId": "1653db35-5061-4f23-bca0-fcc350f60a17",
        "serviceStatus": '',
    },
    {
        "serviceName": "Trồng răng",
        "billDetailId": "2bb959ba-677d-41a8-b128-3133a8ec280c",
        "serviceStatus": '',
    }
]

const CreateNewRecord = () => {


    const param = useParams()
    const location = useLocation()
    const patientFirebase = location?.state?.patient
    const [dataFirebasePatient, setDataFirebasePatient] = useState([])
    const [mota, setMota] = useState('')
    const [motaList, setMotaList] = useState([])

    const [allService, setAllService] = useState([])
    const [loadingService, setLoadingService] = useState(false)
    const [searchServiceTerm, setSearchServiceTerm] = useState('')
    const [showServiceResult, setShowServiceResult] = useState(true)
    const [searchServiceResult, setSearchServiceResult] = useState([])
    // const debounced = useDebounce(searchServiceTerm, 500)

    const [serviceList, setServiceList] = useState([])
    const [openPopupUpdateService, setOpenPopupUpdateService] = useState(false)
    const [currentService, setCurrentService] = useState({})

    const [openPopUpHoaDon, setOpenPopUpHoaDon] = useState(false)
    const [openBackdropTaoHoaDon, setOpenBackdropTaoHoaDon] = useState(false)
    const [taoHoaDon, setTaoHoaDon] = useState('') // rỗng-chưa tạo, dangTao, daTao 

    const [serviceHoaDon, setServiceHoaDon] = useState([])
    // console.log(serviceHoaDon);
    const handleMotaList = () => {
        if (mota === '')
            return
        setMotaList([...motaList, mota])
        setMota('')

    }
    const removeInMotaList = (i) => {
        // console.log(i)
        const newList = [...motaList]
        // console.log(newList);
        if (i !== -1) {
            newList.splice(i, 1);
            setMotaList(newList);
        }

    }
    const handleHideServiceResult = () => {
        setShowServiceResult(false)
    }

    const handleChooseService = (item) => {
        setShowServiceResult(!showServiceResult)
        let newItem = { ...item }
        newItem = { ...newItem, 'soLuong': 1, 'soLanDuKienThucHien': 1, 'gia': item?.expectedPrice }
        var count = 0
        serviceList.forEach(element => {
            if (newItem?.id === element?.id) count = 1;
        });
        if (count === 0)
            setServiceList([...serviceList, newItem])
        else return
    }

    const removeInServiceList = (i) => {
        const newList = [...serviceList]
        // console.log(newList);
        if (i !== -1) {
            newList.splice(i, 1);
            setServiceList(newList);
        }
    }
    const handleUpdateService = (item, i) => {
        setOpenPopupUpdateService(true)
        setCurrentService({ ...item, index: i })
    }
    const handleClosePopupUpdateService = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopupUpdateService(false);
    };
    const handleClosePopupService = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopupUpdateService(false);
    }
    const handleYesPopupService = () => {
        // console.log(currentService);
        const newList = [...serviceList]
        newList[currentService.index] = currentService
        // console.log(newList);
        setServiceList(newList)
        setOpenPopupUpdateService(false);
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
    const handleTaoHoaDon = () => {
        setOpenPopUpHoaDon(true);
    }
    const handleClosePopUpHoaDon = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopUpHoaDon(false);
    }
    const handleYesPopUpHoaDon = async () => {
        // console.log(serviceList);
        // console.log(param?.id);
        setOpenPopUpHoaDon(false);
        try {
            var serviceRequest = []
            serviceList.forEach((item) => {
                serviceRequest = [...serviceRequest, {
                    'serviceID': item?.id,
                    'quantity': `${item?.soLuong}`,
                    'price': `${item?.gia}`,
                    'expectedNumberTimes': `${item?.soLanDuKienThucHien}`
                }]
            })
            // console.log('serviceRequest', serviceRequest);
            // open backdrop
            setOpenBackdropTaoHoaDon(true)
            setTaoHoaDon('dangTao')
            // console.log({
            //     "serviceRequest": serviceRequest,
            //     "userId": param?.id
            // });
            const response = await axiosPublic.post(TAO_HOADON, {
                "serviceRequest": serviceRequest,
                "userId": param?.id
            })
            // dò trong cái list dịch vụ thêm bill detail id vào  
            setServiceHoaDon(serviceHoaDonTest)

            update(ref(db, patientFirebase?.key), {
                paymentConfirmation: 0,
                treatment: serviceList,
                serviceHoaDon: serviceHoaDonTest
            })
            setOpenBackdropTaoHoaDon(false)
            setTaoHoaDon('daTao')
            setSearchServiceTerm('')
            // console.log(response.data);
        } catch (error) {
            setOpenBackdropTaoHoaDon(false)
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
        const dbRef = ref(db)
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                if (childSnapshot.key === patientFirebase?.key) {
                    let keyName = childSnapshot.key;
                    let data = childSnapshot.val();
                    records.push({ "key": keyName, "data": data })
                }

            })
            isMounted && setDataFirebasePatient(records)

        })
        return () => {
            isMounted = false;
        }
    }, [])

    useEffect(() => {
        if (dataFirebasePatient[0]?.data.treatment) {
            // console.log('yes');
            setServiceList(dataFirebasePatient[0]?.data.treatment)
            setTaoHoaDon('daTao')
            if (dataFirebasePatient[0]?.data.serviceHoaDon)
                setServiceHoaDon(dataFirebasePatient[0]?.data.serviceHoaDon)
        }
    }, [dataFirebasePatient])

    // if (dataFirebasePatient[0]?.data?.paymentConfirmation === 0)
    // console.log(dataFirebasePatient[0]?.data?.paymentConfirmation);
    // console.log(serviceList);
    // console.log(searchServiceResult);
    // validate 
    // useEffect(() => {
    //     setGiaErrorMsg('')
    //     // if ()
    //     if (currentService.gia === '') {
    //         setGiaErrorMsg('Giá không null')
    //     }
    //     else if (currentService.gia < currentService.expectedPrice) {
    //         setGiaErrorMsg('Giá ko nhỏ hơn expectedPrice')
    //     }
    // }, [currentService])
    return (
        <>
            <Grid container spacing={1} direction='column'>
                <Grid item> <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>I. Tạo dental care record</Typography></Grid>
                <Grid item>
                    <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>1. Mô tả</Typography>
                </Grid>
                <Grid item container spacing={2} direction='row' sx={{ alignItems: 'flex-end' }}>
                    <Grid item xs={5}>
                        <TextField id="mota"
                            label="Nhập mô tả bệnh lí, công tác điều trị"
                            variant="standard" fullWidth
                            value={mota}
                            onChange={(e) => {
                                setMota(e.target.value)
                            }}
                        // helperText='Nhập mô tả bệnh lí, công tác điều trị'
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={handleMotaList} variant='outlined'><PlaylistAddIcon />Thêm mô tả</Button>
                    </Grid>

                </Grid>

                {motaList.length !== 0 ?
                    <>
                        <br />
                        <Grid item>
                            <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>Danh sách mô tả bệnh lí, công tác điều trị</Typography>
                        </Grid>
                        {motaList.map((item, i) => (

                            <Grid key={i} container item spacing={1} direction='row' sx={{ alignItems: 'center' }}>
                                <Grid item xs={5.15}>
                                    <Typography >{item}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <IconButton
                                        onClick={() => { removeInMotaList(i) }}
                                    ><PlaylistRemoveIcon sx={{ color: 'red' }} /></IconButton>
                                </Grid>
                            </Grid>

                        ))
                        }
                    </>

                    : <p style={{ color: 'red' }}>Mời bạn nhập mô tả và bấm thêm mô tả</p>}

                <Grid item>
                    <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>2. Dịch vụ</Typography>
                </Grid>

                <Grid item>
                    <br />
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
                        <Grid item><Typography variant='subtitle1' sx={{ fontWeight: '500' }}>Danh sách dịch vụ</Typography></Grid>
                        <Grid item>
                            <Table size="small" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">STT</TableCell>
                                        <TableCell align="left">Dịch vụ</TableCell>
                                        <TableCell align="left">Giá/dịch vụ</TableCell>
                                        <TableCell align="center">Số lượng</TableCell>
                                        <TableCell align="center">Số lần thực hiện (dự kiến)</TableCell>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {serviceList.map((item, i) => {

                                        return (
                                            <TableRow key={i}>
                                                <TableCell align='left' >{i + 1}</TableCell>
                                                <TableCell align='left'>{item?.serviceDesc}</TableCell>
                                                <TableCell align='left'>
                                                    {new Intl.NumberFormat('vi-VN'
                                                        , { style: 'currency', currency: 'VND' }
                                                    ).format(item?.gia)}
                                                </TableCell>
                                                <TableCell align='center'>{item?.soLuong}</TableCell>
                                                <TableCell align='center'>{item?.soLanDuKienThucHien}</TableCell>
                                                <TableCell align='left'>
                                                    <Button
                                                        disabled={taoHoaDon === 'daTao' ? true : false}
                                                        onClick={() => {
                                                            handleUpdateService(item, i)
                                                        }}>Cập nhật</Button>
                                                </TableCell>
                                                <TableCell align='left'>
                                                    <IconButton
                                                        disabled={taoHoaDon === 'daTao' ? true : false}
                                                        onClick={() => { removeInServiceList(i) }}>
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
                                    {taoHoaDon === '' && 'Tạo hóa đơn'}
                                    {taoHoaDon === 'dangTao' && 'Đang tạo hóa đơn'}
                                    {taoHoaDon === 'daTao' && 'Đã tạo hóa đơn'}

                                </Button>
                            </Grid>
                            {dataFirebasePatient[0]?.data?.paymentConfirmation !== undefined ?
                                <Grid item>
                                    <Button
                                        variant='outlined'
                                        disableElevation

                                        // disabled={(taoHoaDon === 'daTao' || taoHoaDon === 'dangTao') ? true : false}
                                        startIcon={(dataFirebasePatient[0]?.data.paymentConfirmation === 0) ? <CircularProgress size='0.9rem' />
                                            : (dataFirebasePatient[0]?.data.paymentConfirmation === 1) ? <DoneIcon

                                            />
                                                : null}
                                    >
                                        {dataFirebasePatient[0]?.data.paymentConfirmation === 0 && 'Đang trong quá trình thanh toán'}
                                        {dataFirebasePatient[0]?.data.paymentConfirmation === 1 && 'Đã thanh toán cho đợt điều trị này'}

                                    </Button>
                                </Grid> : null
                            }
                        </Grid>
                        {taoHoaDon === 'daTao' &&
                            <>
                                <br />
                                <Grid item><Typography variant='subtitle1' sx={{ fontWeight: '500' }}>Cập nhật trạng thái điều trị dịch vụ</Typography></Grid>
                                {serviceHoaDon?.map((item, i) => {
                                    // console.log(serviceHoaDon[i]);
                                    return (

                                        <Grid container item spacing={2} direction='row' sx={{ alignItems: 'center' }}
                                            key={i}
                                        >
                                            <Grid item >{item?.serviceName}</Grid>
                                            <Grid item >
                                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>

                                                    <Select
                                                        value={item?.serviceStatus}

                                                        onChange={(event) => {
                                                            var newList = [...serviceHoaDon]
                                                            newList[i].serviceStatus = event.target.value
                                                            setServiceHoaDon(newList)
                                                            update(ref(db, patientFirebase?.key), {

                                                                serviceHoaDon: serviceHoaDon
                                                            })
                                                        }}
                                                    >
                                                        <MenuItem value={'In Progress'}>Chưa hoàn tất</MenuItem>
                                                        <MenuItem value={'Done'}>Hoàn tất</MenuItem>
                                                        <MenuItem value={'Cancel'}>Không làm (Bệnh nhân hủy dịch vụ)</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>



                                        </Grid>)
                                })}
                            </>
                        }


                    </> : null}

                <Grid item>
                    <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>3. Thuốc</Typography>
                </Grid>
            </Grid >

            <Dialog open={openPopupUpdateService} onClose={handleClosePopupUpdateService}
                PaperProps={{ sx: { position: 'fixed', top: '25px' } }}
                fullWidth>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                        <Typography variant="h6" sx={{

                            color: '#0f3eb4'
                        }}>Cập nhật dịch vụ</Typography>
                    </Box>
                    <Grid container spacing={2} direction='column'>
                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>Dịch vụ</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography>{currentService?.serviceDesc}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container item sx={{ alignItems: 'flex-end' }}>
                            <Grid item xs={3}>
                                <Typography>Giá/dịch vụ</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    variant='standard'
                                    // helperText='Giá'
                                    value={currentService?.gia}
                                    onChange={(e) => {
                                        setCurrentService({ ...currentService, gia: e.target.value })
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
                                            // type: 'number',
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
                    <Button onClick={handleClosePopupService}>Hủy</Button>
                    <Button onClick={handleYesPopupService}>Cập nhật dịch vụ</Button>
                </DialogActions>
            </Dialog>

            <TaoHoaDonPopUp open={openPopUpHoaDon} handleClose={handleClosePopUpHoaDon} handleYes={handleYesPopUpHoaDon} />
            <CustomBackdrop open={openBackdropTaoHoaDon} />
        </>
    )
}

export default CreateNewRecord