import { Box, Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    phone: yup
        .string()
        .required('Bắt buộc nhập số điện thoại')
        .matches(/^[0-9]+$/, "Bạn cần nhập số")
        .min(10, 'Bạn cần nhập số điện thoại có 10 số')
        .max(10, 'Bạn cần nhập số điện thoại có 10 số'),
    password: yup
        .string()
        .required('Bắt buộc nhập mật khẩu'),
});
const LoginForm = () => {
    const formik = useFormik({
        initialValues: {
            phone: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });
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
                            onSubmit={formik.handleSubmit}
                        >
                            <Grid container direction="column" spacing={2}>
                                <Grid item>
                                    <TextField
                                        id='phone'
                                        name='phone'
                                        fullWidth
                                        variant="outlined"
                                        label="Số điện thoại"
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                                        helperText={formik.touched.phone && formik.errors.phone}
                                    />

                                </Grid>
                                <Grid item>
                                    <TextField
                                        id='password'
                                        name='password'
                                        fullWidth
                                        variant="outlined"
                                        label="Mật khẩu"
                                        type="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                    />
                                </Grid>
                                <br />
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        type='submit'
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
