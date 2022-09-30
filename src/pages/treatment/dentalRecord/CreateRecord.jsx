import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useEffect, useState } from 'react';

const CreateRecord = ({ billId }) => {

    const [bill, setBill] = useState('');
    const handleChange = (event) => {
        setBill(event.target.value);
    };
    useEffect(() => {
        console.log('change');
        setBill(billId.billId)
    }, [billId])
    return (
        <>
            <Typography variant='subtitle1' sx={{
                fontWeight: '500'
            }}>
                II. Tạo Dental Care Record
            </Typography>
            <Grid container spacing={2}
                sx={{ alignItems: 'center' }}
            >
                <Grid item>
                    <Typography>1. Dental care record liên quan đến lần điều trị có ngày bắt đầu</Typography>
                </Grid>
                <Grid item >
                    <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120, }}>
                        {/* <InputLabel id="demo-simple-select-standard-label">Ngày bắt đầu điều trị</InputLabel> */}
                        <Select
                            // labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={bill}
                            onChange={handleChange}
                            label="Ngày"
                            defaultValue={'00'}
                        >
                            <MenuItem value={'00'}>
                                Không có (Tạo mới)
                            </MenuItem>
                            {billId?.billId !== '' ?
                                <MenuItem value={billId?.billId}>{billId?.startDay}</MenuItem> : null
                            }

                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    )
}

export default CreateRecord