import { Button, Grid, IconButton, TextField, Typography } from '@mui/material'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useState } from 'react';
import { onValue, ref, update } from 'firebase/database';

import StartFirebase from '../../../../components/firebaseConfig'
import { useLocation } from 'react-router-dom';

const db = StartFirebase()
const Mota = ({ motaList, setMotaList }) => {
    const [mota, setMota] = useState('')

    const location = useLocation()
    const patientFirebase = location?.state?.patient

    const handleMotaList = () => {
        if (mota.trim() === '')
            return
        update(ref(db, `${patientFirebase?.key}/record`), {
            motaList: [...motaList, mota.trim()]
        })
        setMotaList([...motaList, mota.trim()])
        setMota('')
    }
    const removeInMotaList = (i) => {
        // console.log(i)
        const newList = [...motaList]
        // console.log(newList);
        if (i !== -1) {
            newList.splice(i, 1);
            update(ref(db, `${patientFirebase?.key}/record`), {
                motaList: newList
            })
            setMotaList(newList);
        }

    }
    return (
        <>
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

        </>
    )
}

export default Mota