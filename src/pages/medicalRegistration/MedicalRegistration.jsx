import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid, Stack, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { push, ref, set } from "firebase/database";
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';

import { DatePicker } from '@mui/x-date-pickers';
import { axiosPrivate } from '../../api/axiosInstance';
import { CHECK_DANG_KY, DANGKIKHAMVANLAI } from '../../common/constants/apiConstants';
import { formatYearMonthDate } from '../../common/utils/formatDate';
import CustomSnackbar from '../../components/CustomSnackbar';
import StartFirebase from '../../components/firebaseConfig';
import SearchPatient from './SearchPatient';
import { CustomBackdrop } from '../../components';

const db = StartFirebase()
const validationSchema = yup.object({
    lastName: yup.string().required('Bạn cần nhập tên họ'),
    middleName: yup.string().required('Bạn cần nhập tên đệm'),
    firstName: yup.string().required('Bạn cần nhập tên'),
    dob: yup.date().required('Bạn cần nhập ngày sinh')
        .typeError("Cần nhập ngày đúng và theo định dạng dd/MM/yyyy")
        .min('1900/01/01', 'Ngày sinh quá xa so với hiện tại')
        .max(dayjs().subtract(1, 'year').format('YYYY/MM/DD'), "Bệnh nhân phải một tuổi trở lên"),
    address: yup.string().required('Bạn cần nhập địa chỉ'),
    dentalCareExamReason: yup.string().required('Bạn cần nhập lí do khám bệnh')
})
const MedicalRegistration = () => {
    const [openSnackbar, setOpenSnackbar] = useState();
    const [textSnackbar, setTextSnackbar] = useState('');
    const [severity, setSeverity] = useState('success');
    const [title, setTitle] = useState('');

    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [dangKi, setDangKi] = useState('Y')


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }
    const formik = useFormik({
        initialValues: {
            lastName: "",
            middleName: "",
            firstName: "",
            phoneNumber: "",
            dob: null,
            address: "",
            dentalCareExamReason: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axiosPrivate.post(DANGKIKHAMVANLAI, {
                    "lastName": values.lastName,
                    "middleName": values.middleName,
                    "firstName": values.firstName,
                    "phoneNumber": values.phoneNumber,
                    "dob": formatYearMonthDate(dayjs(values.dob, "DD/MM/YYYY")),
                    "address": values.address
                })
                const dbRef = ref(db)
                const newUser = push(dbRef)
                set(newUser, {
                    fullName: values.lastName + ' ' + values.middleName + ' ' + values.firstName,
                    sdt: response.data.phoneNumber,
                    status: 0,
                    statusSpecial: 0,
                    timeBooking: '',
                    dentistName: '',
                    dentistPhone: '',
                    room: '',
                    dentalCareExamReason: values.dentalCareExamReason,
                })
                setTextSnackbar('Đăng kí thành công')
                setSeverity('success')
                setOpenSnackbar(true)
                // console.log('res', response);
                formik.resetForm();
            } catch (error) {
                console.log("error:", error)
                if (error.response.status === 417) {
                    setTextSnackbar(error.response.data.message)
                    setSeverity('error')
                    setOpenSnackbar(true)
                } else {
                    setTextSnackbar('Có gì đó không ổn, không đăng kí được, vui lòng thực hiện lại')
                    setSeverity('error')
                    setTitle(error.message)
                    setOpenSnackbar(true)
                }
            }
        }
    })
    useEffect(() => {
        let isMounted = true;
        const check = async () => {
            try {
                setOpenBackdrop(true)
                const response = await axiosPrivate.post(CHECK_DANG_KY)
                isMounted && setDangKi(response.data.message)
                // isMounted && setDangKi('N')
                setOpenBackdrop(false)
            } catch (error) {
                setOpenBackdrop(false)
                console.log(error);
            }
        }
        check()
        return () => {
            isMounted = false;
        }
    }, [])
    console.log(dangKi);
    return (
        <>
            {
                dangKi == 'N' ?
                    <Box display={'flex'} sx={{ marginBottom: '20px' }}>
                        <Grid sx={{ color: 'red', margin: 'auto' }}>Số lượng người đăng kí khám nha khoa đã đầy, không thể đăng kí khám thêm</Grid>
                    </Box> : null
            }
            <Grid container spacing={0.5}
                justifyContent='space-between'
            >

                <Grid item xs={5.75} sx={{
                    opacity: dangKi == 'N' ? '0.25' : '1',
                    pointerEvents: dangKi == 'N' ? 'none' : ''
                }}>
                    <SearchPatient />
                </Grid>
                {/* <Divider orientation="vertical" flexItem sx={{
                    backgroundColor: '#000'
                }} /> */}
                <Grid item xs={6} sx={{
                    opacity: dangKi == 'N' ? '0.25' : '1',
                    pointerEvents: dangKi == 'N' ? 'none' : ''
                }}>
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
                            <Stack direction='column' spacing={2}
                                component='form' onSubmit={formik.handleSubmit}>
                                <Stack direction='row' spacing={2} >
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
                                </Stack>
                                <Stack direction='row' spacing={2} >
                                    <TextField
                                        name='phoneNumber'
                                        variant='standard'
                                        label="Số điện thoại"
                                        value={formik.values.phoneNumber}
                                        onChange={formik.handleChange}
                                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                    />
                                    <DatePicker
                                        label='Ngày sinh'
                                        value={formik.values.dob}
                                        onChange={value => formik.setFieldValue("dob", value)}
                                        inputFormat="DD/MM/YYYY"
                                        placeholder="DD/MM/YYYY"
                                        maxDate={dayjs().subtract(1, 'year').format('YYYY-MM-DD')}
                                        renderInput={(params) =>
                                            <TextField {...params}
                                                variant='standard'
                                                name='dob'
                                                id='dob'
                                                error={formik.touched.dob && Boolean(formik.errors.dob)}
                                                helperText={formik.touched.dob && formik.errors.dob}
                                            />

                                        }
                                    />
                                </Stack>

                                <TextField
                                    multiline
                                    name='address'
                                    variant='standard'
                                    label="Địa chỉ"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                                <TextField
                                    multiline
                                    variant='standard'
                                    label="Lí do khám bệnh"
                                    name='dentalCareExamReason'
                                    value={formik.values.dentalCareExamReason}
                                    onChange={formik.handleChange}
                                    error={formik.touched.dentalCareExamReason && Boolean(formik.errors.dentalCareExamReason)}
                                    helperText={formik.touched.dentalCareExamReason && formik.errors.dentalCareExamReason}
                                />
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
                horizontal='right'
                title={title}
            />
            <CustomBackdrop open={openBackdrop} />
        </>
    )
}

export default MedicalRegistration