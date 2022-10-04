import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';
// import { Select, TextField } from 'formik-mui'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useState } from 'react';

const CreateNewRecord = () => {
    const [mota, setMota] = useState('')
    const [motaList, setMotaList] = useState([])
    const handleMotaList = () => {
        if (mota === '')
            return
        setMotaList([...motaList, mota])
        // console.log(mota);

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

    return (
        <Grid container spacing={1} direction='column'>
            <Grid item> <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>I. Tạo dental care record</Typography></Grid>
            <Grid item>
                <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>1.Mô tả</Typography>
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
                    <Button onClick={handleMotaList} variant='outlined'><PlaylistAddIcon /> Thêm mô tả</Button>
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

        </Grid >

    )
}

export default CreateNewRecord