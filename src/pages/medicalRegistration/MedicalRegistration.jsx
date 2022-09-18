import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Stack, TextField, Typography } from '@mui/material'
import SearchPatient from './SearchPatient'

const MedicalRegistration = () => {
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    return (
        <Grid container spacing={1}
            justifyContent='space-between'
        >
            <Grid xs={7}>
                <SearchPatient />
            </Grid>
            <Divider orientation="vertical" flexItem sx={{
                backgroundColor: '#000'
            }} />
            <Grid xs={4.5}>
                <Card square>
                    <CardHeader
                        title='Đăng kí khám bệnh'
                        titleTypographyProps={{
                            align: "center", color: 'blue', marginBottom: 0,
                            paddingBottom: 0
                        }}
                    >
                    </CardHeader>
                    <CardContent>
                        <Stack direction='column' spacing={2}>
                            <TextField variant='standard' label="Họ" />
                            <TextField variant='standard' label="Tên đệm" />
                            <TextField variant='standard' label="Tên" />
                            <TextField variant='standard' label="Số điện thoại" />
                            <TextField variant='standard' label="Ngày sinh" />
                            <TextField variant='standard' label="Địa chỉ" />
                            <TextField variant='standard' label="Triệu chứng" />
                            <br />
                            <Button type='submit' variant="contained" >Đăng kí</Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default MedicalRegistration