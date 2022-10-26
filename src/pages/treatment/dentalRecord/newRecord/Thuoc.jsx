import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Grid, IconButton, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import Tippy from '@tippyjs/react/headless'
import classNames from "classnames/bind"
import { useEffect, useState } from 'react'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

import { axiosPublic } from '../../../../api/axiosInstance'
import { LIST_THUOC } from '../../../../common/constants/apiConstants'
import styles from '../../../../style/SearchTippy.module.scss'
import { ref, update } from 'firebase/database';
import StartFirebase from '../../../../components/firebaseConfig';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles)
const db = StartFirebase()
const Thuoc = ({ thuocList, setThuocList }) => {
    const location = useLocation()

    const [searchThuocTerm, setSearchThuocTerm] = useState('')
    const [showThuocResult, setShowThuocResult] = useState(true)
    const [searchThuocResult, setSearchThuocResult] = useState([])
    const [loadingThuoc, setLoadingThuoc] = useState(false)
    const [allThuoc, setAllThuoc] = useState([])

    const [openPopupChooseThuoc, setOpenPopupChooseThuoc] = useState(false)
    const [currentThuoc, setCurrentThuoc] = useState({})
    const [openPopupUpdateThuoc, setOpenPopupUpdateThuoc] = useState(false)

    const handleHideThuocResult = () => {
        setShowThuocResult(false)
    }
    const handleThuocChange = (e) => {
        setSearchThuocTerm(e.target.value)
        if (!e.target.value.trim()) {
            setSearchThuocResult([])
            return
        }
        const resultsArray = allThuoc.filter(item =>
            item?.medicineName?.toLowerCase().includes(e.target.value.trim().toLowerCase())
            || item?.medicineType?.toLowerCase().includes(e.target.value.trim().toLowerCase())
        )
        if (resultsArray.length === 0) {
            setSearchThuocResult([{ 'medicineName': 'Không tìm thấy' }])
        } else { setSearchThuocResult(resultsArray) }
    }
    const handleChooseThuoc = (item) => {
        setShowThuocResult(!showThuocResult)

        let newItem = { ...item, lieuDung: '', soLuong: 1 }
        var count = 0
        thuocList.forEach(element => {
            if (newItem?.id === element?.id) count = 1;
            if (newItem?.medicineName === 'Không tìm thấy') count = 1
        });
        // console.log(newItem);
        if (count === 0) {
            setCurrentThuoc(newItem)
            setOpenPopupChooseThuoc(true)
            // setThuocList([...thuocList, newItem])

        }
        else {
            return
        }
    }
    const removeInThuocList = (i) => {
        const newList = [...thuocList]
        // console.log(newList);
        if (i !== -1) {
            newList.splice(i, 1);
            update(ref(db, `${location?.state?.patient?.key}/record`), {
                thuocList: newList
            })
            setThuocList(newList);
        }
    }
    const handleClosePopupChooseThuoc = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopupChooseThuoc(false);
    }
    const handleYesPopupChooseThuoc = () => {
        const newItem = { ...currentThuoc, lieuDung: currentThuoc?.lieuDung?.trim() }
        update(ref(db, `${location?.state?.patient?.key}/record`), {
            thuocList: [...thuocList, newItem]
        })
        setThuocList([...thuocList, newItem])
        setOpenPopupChooseThuoc(false)

    }
    const handleUpdateThuoc = (item, i) => {
        setCurrentThuoc({ ...item, index: i })
        setOpenPopupUpdateThuoc(true)
    }
    const handleClosePopupUpdateThuoc = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopupUpdateThuoc(false);
    };
    const handleYesPopupUpdateThuoc = () => {
        // console.log(currentService);
        const newItem = { ...currentThuoc, lieuDung: currentThuoc?.lieuDung?.trim() }
        const newList = [...thuocList]
        newList[currentThuoc.index] = newItem
        // console.log(newList);
        update(ref(db, `${location?.state?.patient?.key}/record`), {
            thuocList: newList
        })
        setThuocList(newList)
        setOpenPopupUpdateThuoc(false);
    }
    useEffect(() => {
        let isMounted = true;
        const getThuoc = async () => {
            try {
                setLoadingThuoc(true)
                const response = await axiosPublic.post(LIST_THUOC)
                // console.log(response.data);
                isMounted && setAllThuoc(response.data)
                setLoadingThuoc(false)
            } catch (error) {
                setLoadingThuoc(false)
                console.log(error);
            }
        }
        getThuoc()
        return () => {
            isMounted = false;
        }
    }, [])
    // console.log(thuocList);
    return (
        <>
            <Grid item>
                <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>3. Đơn thuốc</Typography>
            </Grid>
            <Grid item>

                <Tippy
                    render={attrs => (
                        <div className={cx('resultSearchBox')} tabIndex="-1" {...attrs}>
                            {

                                searchThuocResult.map((item, i) => (
                                    <div className={cx('resultSearchItem')} key={i}
                                        onClick={() => {
                                            handleChooseThuoc(item)
                                        }}>
                                        <Typography>{item?.medicineName}</Typography>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                    placement='bottom-start'
                    interactive={true}
                    visible={showThuocResult && searchThuocResult.length > 0}
                    onClickOutside={handleHideThuocResult}
                >
                    <TextField
                        variant='standard'
                        sx={{ width: '41.25%' }}
                        value={searchThuocTerm}
                        placeholder='Tìm kiếm thuốc...'
                        onFocus={() => setShowThuocResult(true)}
                        onChange={handleThuocChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {loadingThuoc && <CircularProgress size='18px' />}
                                </InputAdornment>
                            ),
                        }}
                    />
                </Tippy>

            </Grid>
            {thuocList.length !== 0 ?
                <>
                    <br />
                    <Grid item><Typography variant='subtitle1' sx={{ fontWeight: '500' }}>Đơn thuốc</Typography></Grid>
                    <Grid item>
                        <Table size="small" >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell align="center">Tên thuốc</TableCell>
                                    <TableCell align="center">Số lượng</TableCell>
                                    <TableCell align="center">Liều dùng</TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {thuocList.map((item, i) => {

                                    return (
                                        <TableRow key={i}>
                                            <TableCell align='center' >{i + 1}</TableCell>
                                            <TableCell align='center'>{item?.medicineName}</TableCell>
                                            <TableCell align='center'>{item?.soLuong}</TableCell>
                                            <TableCell align='center'>{item?.lieuDung}</TableCell>
                                            <TableCell align='center'>
                                                <Button
                                                    onClick={() => {
                                                        handleUpdateThuoc(item, i)
                                                    }}
                                                >Cập nhật</Button>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => { removeInThuocList(i) }}
                                                ><PlaylistRemoveIcon sx={{ color: 'red' }} /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Grid>
                </>
                : null}

            < Dialog open={openPopupChooseThuoc} onClose={handleClosePopupChooseThuoc}
                PaperProps={{ sx: { position: 'fixed', top: '25px' } }}
                fullWidth>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                        <Typography variant="h6" sx={{

                            color: '#0f3eb4'
                        }}>Thuốc</Typography>
                    </Box>
                    <Grid container spacing={2} direction='column'>
                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>Tên thuốc</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography>{currentThuoc?.medicineName}</Typography>
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
                                    value={currentThuoc?.soLuong}
                                    onChange={(e) => {
                                        var soLuongNhap = e.target.value
                                        if (e.target.value < 1 && e.target.value !== '') soLuongNhap = 1
                                        setCurrentThuoc({ ...currentThuoc, soLuong: soLuongNhap })
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
                                <Typography>Liều dùng</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    variant='standard'
                                    value={currentThuoc?.lieuDung}
                                    onChange={(e) => {
                                        setCurrentThuoc({ ...currentThuoc, lieuDung: e.target.value })
                                    }}
                                />
                            </Grid>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopupChooseThuoc}>Hủy</Button>
                    <Button onClick={handleYesPopupChooseThuoc}>Lưu</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openPopupUpdateThuoc} onClose={handleClosePopupUpdateThuoc}
                PaperProps={{ sx: { position: 'fixed', top: '25px' } }}
                fullWidth>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                        <Typography variant="h6" sx={{
                            color: '#0f3eb4'
                        }}>Thuốc</Typography>
                    </Box>
                    <Grid container spacing={2} direction='column'>
                        <Grid container item>
                            <Grid item xs={3}>
                                <Typography>Tên thuốc</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <Typography>{currentThuoc?.medicineName}</Typography>
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
                                    value={currentThuoc?.soLuong}
                                    onChange={(e) => {
                                        var soLuongNhap = e.target.value
                                        if (e.target.value < 1 && e.target.value !== '') soLuongNhap = 1
                                        setCurrentThuoc({ ...currentThuoc, soLuong: soLuongNhap })
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
                                <Typography>Liều dùng</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    variant='standard'
                                    value={currentThuoc?.lieuDung}
                                    onChange={(e) => {
                                        setCurrentThuoc({ ...currentThuoc, lieuDung: e.target.value })
                                    }}
                                />
                            </Grid>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopupUpdateThuoc}>Hủy</Button>
                    <Button onClick={handleYesPopupUpdateThuoc}>Cập nhật</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Thuoc