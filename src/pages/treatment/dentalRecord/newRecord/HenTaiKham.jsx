import { Grid, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

const HenTaiKham = ({ ngayTaiKham, setNgayTaiKham }) => {
    return (
        <>
            <Grid item>
                <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>4. Tái khám</Typography>
            </Grid>
            <Grid item>
                <DatePicker
                    label='Ngày tái khám'
                    value={ngayTaiKham}
                    onChange={
                        (newValue) => { setNgayTaiKham(newValue) }
                    }
                    inputFormat="DD/MM/YYYY"
                    placeholder="DD/MM/YYYY"
                    minDate={dayjs().add(1, 'day').format('YYYY-MM-DD')}
                    renderInput={(params) =>
                        <TextField {...params}
                            variant='standard'
                            name='ngayTaiKham'
                            id='ngayTaiKham'
                        />

                    }
                />
            </Grid>
        </>
    )
}

export default HenTaiKham