import { Box, Button, Card, CardContent, CardHeader, Grid, Stack, TextField, Typography } from '@mui/material'

const MedicalRegistration = () => {
    const handleSubmit = (e) => {
        e.preventDefault()
    }
    return (
        <Stack direction='column' spacing={2}>
            {/* <Box>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                    Đăng kí khám bệnh
                </Typography>
            </Box> */}
            <Box
                component='form'
                sx={{ display: 'flex' }}
                onSubmit={handleSubmit}
            >
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}
                >
                    <Card square sx={{ boxShadow: 'none', width: '50%', justifyContent: 'center' }}>
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
            </Box>
        </Stack >
    )
}

export default MedicalRegistration