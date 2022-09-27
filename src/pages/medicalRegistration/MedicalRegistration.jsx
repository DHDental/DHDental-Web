import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup';
import { format, parse } from 'date-fns';

import { axiosPublic } from '../../api/axiosInstance';
import SearchPatient from './SearchPatient'
import { DANGKIKHAMVANLAI } from '../../common/constants/apiConstants'
import { formatYearMonthDate } from '../../common/utils/formatDate'
import dayjs from 'dayjs';
import CustomSnackbar from '../../components/CustomSnackbar';
import { useState } from 'react';



const validationSchema = yup.object({
    lastName: yup.string().required('Bạn cần nhập tên họ'),
    middleName: yup.string().required('Bạn cần nhập tên đệm'),
    firstName: yup.string().required('Bạn cần nhập tên'),
    dob: yup.date().required('Bạn cần nhập ngày sinh')
        .transform((value, originalValue) => parse(originalValue, 'dd/MM/yyyy', new Date()))
        .typeError("Cần nhập ngày đúng và theo định dạng dd/MM/yyyy")
        .min('01/01/1880', 'Ngày sinh quá xa so với hiện tại')
        .max(String(format(new Date(), 'dd/MM/yyyy')), "Vui lòng nhập ngày sinh, bạn đang nhập ngày trong tương lai")
    ,
    address: yup.string().required('Bạn cần nhập địa chỉ')
})
const MedicalRegistration = () => {
    const [openSnackbar, setOpenSnackbar] = useState();
    const [textSnackbar, setTextSnackbar] = useState('');
    const [severity, setSeverity] = useState('success');

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }
    const formik = useFormik({
        initialValues: {
            lastName: "",
            middleName: "",
            firstName: "",
            phoneNumber: "",
            dob: "",
            address: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axiosPublic.post(DANGKIKHAMVANLAI, {
                    "lastName": values.lastName,
                    "middleName": values.middleName,
                    "firstName": values.firstName,
                    "phoneNumber": values.phoneNumber,
                    "dob": formatYearMonthDate(dayjs(values.dob, "DD/MM/YYYY")),
                    "address": values.address
                })
                setTextSnackbar('Đăng kí thành công')
                setSeverity('success')
                setOpenSnackbar(true)
                console.log('res', response);

            } catch (error) {
                console.log("error:", error.response.data)
                if (error.response.status === 417) {
                    setTextSnackbar(error.response.data.message)
                    setSeverity('error')
                    setOpenSnackbar(true)
                }

            }
        }
    })

    return (
        <>
            <Grid container spacing={1}
                justifyContent='space-between'
            >
                <Grid item xs={7}>
                    <SearchPatient />
                </Grid>
                <Divider orientation="vertical" flexItem sx={{
                    backgroundColor: '#000'
                }} />
                <Grid item xs={4.5}>
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
                            <Stack direction='column' spacing={1}
                                component='form' onSubmit={formik.handleSubmit}>
                                <TextField
                                    name='lastName'
                                    variant='standard'
                                    label="Họ"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                                <TextField
                                    name='middleName'
                                    variant='standard'
                                    label="Tên đệm"
                                    value={formik.values.middleName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.middleName && Boolean(formik.errors.middleName)}
                                    helperText={formik.touched.middleName && formik.errors.middleName} />
                                <TextField
                                    name='firstName'
                                    variant='standard'
                                    label="Tên"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                                <TextField
                                    name='phoneNumber'
                                    variant='standard'
                                    label="Số điện thoại"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                />
                                <TextField
                                    name='dob'
                                    variant='standard' label="Ngày sinh"
                                    placeholder='dd/MM/yyyy'
                                    value={formik.values.dob}
                                    onChange={formik.handleChange}
                                    error={formik.touched.dob && Boolean(formik.errors.dob)}
                                    helperText={formik.touched.dob && formik.errors.dob}
                                />
                                <TextField
                                    name='address'
                                    variant='standard' label="Địa chỉ"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                                {/* <TextField variant='standard' label="Triệu chứng" /> */}
                                <br />
                                <Button type='submit' variant="contained"
                                    disabled={formik.isSubmitting}
                                    startIcon={formik.isSubmitting ? <CircularProgress size='0.9rem' /> : null}
                                >
                                    {formik.isSubmitting ? 'Đang đăng kí' : 'Đăng kí'}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <CustomSnackbar handleClose={handleCloseSnackbar}
                open={openSnackbar}
                text={textSnackbar}
                severity={severity}
                variant='standard'
                vertical='top'
                horizontal='right' />
        </>
    )
}

export default MedicalRegistration