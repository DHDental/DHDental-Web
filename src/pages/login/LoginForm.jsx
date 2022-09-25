import { Box, Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { axiosPublic } from '../../api/axiosInstance';
import { LOGIN } from '../../common/constants/apiConstants'
import { STAFF_DSDATKHAM, DENTIST_DS_KHAM } from '../../common/constants/pathConstants'
import LoginSnackbar from './LoginSnackbar';
import { useState } from 'react';

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
    const [open, setOpen] = useState(false)
    const [text, setText] = useState()
    const handleClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            phone: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axiosPublic.post(LOGIN, {
                    "username": values.phone,
                    "password": values.password
                })
                const user = jwtDecode(response.data.token)
                localStorage.setItem("loginInfo", JSON.stringify(response.data))
                if (user?.roleID[0].authority === '2')
                    navigate(STAFF_DSDATKHAM, { replace: true });
                if (user?.roleID[0].authority === '3')
                    navigate(DENTIST_DS_KHAM, { replace: true });

            } catch (error) {
                console.log("error:", error.response.data)
                if (error.response.status === 401 || error.response.status === 500) {
                    setText('Login không thành công. Sai mật khẩu hoặc số điện thoại')
                    setOpen(true)
                }

            }


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
            <LoginSnackbar open={open} handleClose={handleClose} text={text} />
        </>
    )
}

export default LoginForm
