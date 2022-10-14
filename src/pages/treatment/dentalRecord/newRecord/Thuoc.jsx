import { Button, CircularProgress, Grid, IconButton, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import Tippy from '@tippyjs/react/headless'
import classNames from "classnames/bind"
import { useEffect, useState } from 'react'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

import { axiosPublic } from '../../../../api/axiosInstance'
import { LIST_THUOC } from '../../../../common/constants/apiConstants'
import styles from '../../../../style/SearchTippy.module.scss'

const cx = classNames.bind(styles)
const Thuoc = ({ thuocList, setThuocList }) => {
    const [searchThuocTerm, setSearchThuocTerm] = useState('')
    const [showThuocResult, setShowThuocResult] = useState(true)
    const [searchThuocResult, setSearchThuocResult] = useState([])
    const [loadingThuoc, setLoadingThuoc] = useState(false)
    const [allThuoc, setAllThuoc] = useState([])

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

        let newItem = { ...item }
        var count = 0
        thuocList.forEach(element => {
            if (newItem?.id === element?.id) count = 1;
            if (newItem?.medicineName === 'Không tìm thấy') count = 1
        });

        if (count === 0) {
            setThuocList([...thuocList, newItem])
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
            // update(ref(db, `${location?.state?.patient?.key}/record`), {
            //     serviceList: newList
            // })
            setThuocList(newList);
        }
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
    console.log(thuocList);
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
                                    <TableCell align="center">Thuốc</TableCell>
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
                                            <TableCell align='center'>1</TableCell>
                                            <TableCell align='center'>1 viên buổi sáng</TableCell>
                                            <TableCell align='center'>
                                                <Button>Cập nhật</Button>
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
        </>
    )
}

export default Thuoc