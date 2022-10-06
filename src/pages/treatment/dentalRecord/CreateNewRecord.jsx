import { Box, Button, CircularProgress, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from "classnames/bind"

import styles from '../../../style/SearchTippy.module.scss'
import { useDebounce } from "../../../hooks";
import { axiosPublic } from '../../../api/axiosInstance';
import { SEARCH_SERVICE } from '../../../common/constants/apiConstants';

const cx = classNames.bind(styles)

const CreateNewRecord = () => {
    const [mota, setMota] = useState('')
    const [motaList, setMotaList] = useState([])
    const [loadingService, setLoadingService] = useState(false)
    const [searchServiceTerm, setSearchServiceTerm] = useState('')
    const [showServiceResult, setShowServiceResult] = useState(true)
    const [searchServiceResult, setSearchServiceResult] = useState([])
    const debounced = useDebounce(searchServiceTerm, 400)
    const handleMotaList = () => {
        if (mota === '')
            return
        setMotaList([...motaList, mota])
        setMota('')

    }
    const removeInMotaList = (i) => {
        // console.log(i)
        const newList = [...motaList]
        console.log(newList);
        if (i !== -1) {
            newList.splice(i, 1);
            setMotaList(newList);
        }

    }
    const handleHideServiceResult = () => {
        setShowServiceResult(false)
    }

    useEffect(() => {
        let isMounted = true;
        const getPatientInfo = async () => {
            if (!debounced.trim()) {
                setSearchServiceResult([])
                return
            }
            try {
                setLoadingService(true)
                const response = await axiosPublic.post(SEARCH_SERVICE, {
                    "key": debounced
                })
                isMounted && setSearchServiceResult(response.data);

                setLoadingService(false)
            } catch (error) {
                setSearchServiceResult([{ 'serviceDesc': 'Không tìm thấy dịch vụ' }])
                setLoadingService(false)
                console.log(error);
            }
        }
        getPatientInfo()
        return () => {
            isMounted = false;
        }
    }, [debounced])
    // console.log(searchServiceResult);
    return (
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
                                            setShowServiceResult(!showServiceResult)
                                            console.log(item);
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
                        onChange={(e) => {
                            setSearchServiceTerm(e.target.value)
                        }}
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
        </Grid >

    )
}

export default CreateNewRecord