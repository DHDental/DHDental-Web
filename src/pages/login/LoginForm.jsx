import { Box, Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'

const LoginForm = () => {
    return (
        <>
            <Grid container justifyContent='center'>
                <Card sx={{ width: '40%' }}>
                    <CardHeader
                        title='Nha Khoa Đức Hạnh'
                        titleTypographyProps={{
                            align: "center", color: 'blue', marginBottom: '10px'
                        }}
                        subheader='Đăng nhập vào hệ thống'
                        subheaderTypographyProps={{
                            align: "center"
                        }}
                    />
                    <CardContent sx={{ marginBottom: '2%' }}>
                        <Box
                            component='form'
                            sx={{
                                display: 'flex',
                            }}
                        >
                            <Grid container direction="column" spacing={2}>
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Số điện thoại" />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Mật khẩu"
                                        type="password"
                                    />
                                </Grid>
                                <br />
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                    >
                                        Đăng nhập
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </>
    )
}

export default LoginForm
