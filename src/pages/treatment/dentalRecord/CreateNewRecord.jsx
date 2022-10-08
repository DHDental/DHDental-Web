import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Grid, IconButton, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from "classnames/bind"

import styles from '../../../style/SearchTippy.module.scss'
// import { useDebounce } from "../../../hooks";
import { axiosPublic } from '../../../api/axiosInstance';
import { LIST_SERVICE } from '../../../common/constants/apiConstants';

const cx = classNames.bind(styles)

const CreateNewRecord = () => {
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
        // console.log(item);
        let newItem = { ...item }
        newItem = { ...newItem, 'soLuong': 1, 'soLanDuKienThucHien': 1, 'gia': item?.expectedPrice }
        // console.log(newItem);
        setServiceList([...serviceList, newItem])
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
        console.log(currentService);
        const newList = [...serviceList]
        newList[currentService.index] = currentService
        console.log(newList);
        setServiceList(newList)
        setOpenPopupUpdateService(false);
    }
    // console.log(serviceList);
    // useEffect(() => {
    //     let isMounted = true;
    //     const getPatientInfo = async () => {
    //         if (!debounced.trim()) {
    //             setSearchServiceResult([])
    //             return
    //         }
    //         try {
    //             setLoadingService(true)
    //             const response = await axiosPublic.post(SEARCH_SERVICE, {
    //                 "key": debounced
    //             })
    //             isMounted && setSearchServiceResult(response.data);

    //             setLoadingService(false)
    //         } catch (error) {
    //             setSearchServiceResult([{ 'serviceDesc': 'Không tìm thấy dịch vụ' }])
    //             setLoadingService(false)
    //             console.log(error);
    //         }
    //     }
    //     getPatientInfo()
    //     return () => {
    //         isMounted = false;
    //     }
    // }, [debounced])
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
                                                    <Button onClick={() => {
                                                        handleUpdateService(item, i)
                                                    }}>Cập nhật</Button>
                                                </TableCell>
                                                <TableCell align='left'>
                                                    <IconButton onClick={() => { removeInServiceList(i) }}>
                                                        <PlaylistRemoveIcon sx={{ color: 'red' }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            // <Grid container item spacing={1} direction='row' key={i}>
                                            //     <Grid item >
                                            //         <TextField
                                            //             disabled

                                            //             variant='standard'
                                            //             helperText='Dịch vụ'
                                            //             value={item?.serviceDesc}
                                            //         />
                                            //     </Grid>
                                            //     <Grid item >
                                            //         <TextField
                                            //             disabled
                                            //             required
                                            //             variant='standard'
                                            //             helperText='Giá'
                                            //             value={item?.expectedPrice}
                                            //         />
                                            //     </Grid>
                                            //     <Grid item >
                                            //         <TextField
                                            //             disabled
                                            //             required
                                            //             variant='standard'
                                            //             helperText='Số lượng'
                                            //             value={item?.soLuong}
                                            //         />
                                            //     </Grid>
                                            //     <Grid item >
                                            //         <TextField
                                            //             disabled

                                            //             required
                                            //             variant='standard'
                                            //             helperText='Số lần dự kiến thực hiện'
                                            //             value={item?.soLanDuKienThucHien}
                                            //         />
                                            //     </Grid>
                                            //     <Grid item>
                                            //         <IconButton
                                            //             onClick={() => { removeInMotaList(i) }}
                                            //         ><PlaylistRemoveIcon sx={{ color: 'red' }} /></IconButton>
                                            //     </Grid>
                                            // </Grid>

                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </Grid>
                    </> : null}
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
        </>
    )
}

export default CreateNewRecord