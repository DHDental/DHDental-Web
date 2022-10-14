import { Grid, Typography } from '@mui/material'

const PatientInfomation = () => {
    return (
        <>
            <Grid container spacing={1} direction='column'>
                <Grid container item direction='row' spacing={2}>
                    <Grid item xs={1.5}>
                        <Typography>Bệnh nhân</Typography>
                    </Grid>
                    <Grid item >
                        <Typography>Nguyễn Xuân Khánh Hòa</Typography>
                    </Grid>
                </Grid>
                <Grid container item direction='row' spacing={2}>
                    <Grid item xs={1.5}>
                        <Typography>Số điện thoại</Typography>
                    </Grid>
                    <Grid item >
                        <Typography>0334942928</Typography>
                    </Grid>
                </Grid>
                <Grid container item direction='row' spacing={2}>
                    <Grid item xs={1.5}>
                        <Typography>Địa chỉ</Typography>
                    </Grid>
                    <Grid item >
                        <Typography>Bình Dương</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default PatientInfomation