import { Button, Grid, IconButton, Typography } from '@mui/material'
import { Formik, Form, Field, FieldArray, useFormikContext } from 'formik'
import { TextField } from 'formik-mui'
import React, { useEffect, useState } from 'react'
import { array, object, string } from 'yup'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';


const emptyDescription = { desc: '' }
const emptyMedicine = { medicine: '' }
const emptyService = { service: '' }
const CreateRecord = ({ recordbillId_serviceId, no, secondMenuItemSelect }) => {
    console.log(secondMenuItemSelect);

    const [taoHoaDon, setTaoHoaDon] = useState(false)

    useEffect(() => {
        console.log('change');
        // console.log(values);
    }, [recordbillId_serviceId])
    return (
        <>

            <Formik

                initialValues={{
                    descriptions: [emptyDescription],
                    medicines: [emptyMedicine],
                    services: [emptyService]
                }}
                validationSchema={
                    object({
                        descriptions: array(object({
                            desc: string().required('Cần nhập mô tả bệnh lí, công tác điều trị,...'),
                        })).min(1, 'Cần có ít nhất một mô tả'),
                    })
                }
                onSubmit={() => {

                }}
            >
                {({ values, errors, isSubmitting, resetForm }) => (<Form style={{ backgroundColor: 'blue' }}>
                    <Grid container spacing={0.5} direction='column'>
                        <Grid item>
                            <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>{`${no}. Mô tả`}</Typography>
                        </Grid>

                        <FieldArray name='descriptions'>
                            {
                                ({ push, remove, }) => (
                                    <>
                                        {
                                            values.descriptions.map((_, index) => (
                                                <Grid container item key={index} spacing={1} direction='row'>
                                                    <Grid item xs={5.5}>
                                                        <Field
                                                            component={TextField}
                                                            name={`descriptions.${index}.desc`}
                                                            multiline
                                                            helperText='Mô tả bệnh lí, công tác điều trị,...'
                                                            variant="standard"
                                                            fullWidth
                                                        // sx={{ width: '100%' }}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={4}>
                                                        {/* <Button onClick={() => remove(index)}>Xóa</Button> */}
                                                        <IconButton onClick={() => remove(index)}>
                                                            <DeleteForeverIcon sx={{ color: 'red' }} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            ))
                                        }
                                        <br />
                                        <Grid item>
                                            {typeof errors.descriptions === 'string' ?
                                                <>
                                                    <Typography sx={{ color: 'red' }}>
                                                        {errors.descriptions}
                                                    </Typography>
                                                    <br />
                                                </>
                                                : null}
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="outlined"
                                                onClick={() => push(emptyDescription)}>
                                                <PlaylistAddIcon />
                                                Thêm mô tả
                                            </Button>
                                        </Grid>
                                    </>
                                )
                            }
                        </FieldArray>
                        <br />




                        <Grid item>
                            <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>{`${no + 1}. Dịch vụ`}</Typography>
                        </Grid>
                        {recordbillId_serviceId === 'khong co' ? <>
                            <FieldArray name='services'>
                                {
                                    ({ push, remove, }) => (
                                        <>
                                            {
                                                values.services.map((_, index) => (
                                                    <Grid container item key={index} spacing={1} direction='row'>
                                                        <Grid item xs={5.5}>
                                                            <Field
                                                                disabled={taoHoaDon}
                                                                component={TextField}
                                                                name={`services.${index}.service`}
                                                                // multiline
                                                                helperText='Dịch vụ'
                                                                variant="standard"
                                                                fullWidth
                                                            // sx={{ width: '100%' }}
                                                            />
                                                        </Grid>

                                                        <Grid item xs={4}>
                                                            {/* <Button onClick={() => remove(index)}>Xóa</Button> */}
                                                            {taoHoaDon ? null : <IconButton onClick={() => remove(index)}>
                                                                <DeleteForeverIcon sx={{ color: 'red' }} />
                                                            </IconButton>}

                                                        </Grid>
                                                    </Grid>
                                                ))
                                            }
                                            <br />
                                            <Grid item>
                                                {typeof errors.services === 'string' ?
                                                    <>
                                                        <Typography sx={{ color: 'red' }}>
                                                            {errors.services}
                                                        </Typography>
                                                        <br />
                                                    </>
                                                    : null}
                                            </Grid>
                                            <Grid item>
                                                {taoHoaDon === false ? <Button
                                                    variant="outlined"
                                                    onClick={() => push(emptyService)}>
                                                    <PlaylistAddIcon />
                                                    Thêm dịch vụ
                                                </Button> : null}

                                            </Grid>

                                            <Grid item>
                                                {(values.services.length === 1 && values.services[0].service === "") ? null :

                                                    (<Button
                                                        disabled={taoHoaDon}
                                                        variant="outlined"
                                                        onClick={() => {
                                                            setTaoHoaDon(true)
                                                        }}>
                                                        <PlaylistAddIcon />
                                                        {taoHoaDon ? 'Đã tạo hóa đơn' : 'Tạo hóa đơn'}
                                                    </Button>)}


                                            </Grid>
                                            {taoHoaDon ? <Grid item>
                                                <Button

                                                    variant="outlined"
                                                    onClick={() => {
                                                        [{ service: 'a' }, { service: 'b' }].map((item, i) => (
                                                            push(item)
                                                        ))

                                                    }}>
                                                    <PlaylistAddIcon />
                                                    Bổ sung dịch vụ vào hóa đơn
                                                </Button>

                                            </Grid> : null}

                                        </>
                                    )
                                }
                            </FieldArray>
                            <br />
                        </> :
                            <>
                                tên dịch vụ
                                status dịch vụ
                                status hóa đơn, nếu hóa đơn done thì thôi
                                nếu hóa đơn not done thì hiện tiếp tục tạo yêu cầu thanh toán cho đợt điều trị này
                                <FieldArray name='services'>
                                    {
                                        ({ push, remove, }) => (
                                            <>
                                                <Button

                                                    variant="outlined"
                                                    onClick={() => {
                                                        [{ service: 'a' }, { service: 'b' }].map((item, i) => (
                                                            push(item)
                                                        ))

                                                    }}>
                                                    <PlaylistAddIcon />
                                                    Bổ sung dịch vụ vào hóa đơn
                                                </Button>

                                            </>)}</FieldArray>
                            </>}




                    </Grid>

                    <pre>{JSON.stringify({ values, errors }, null, 4)}</pre>
                    <Grid item>
                        <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>{`${no + 2}.Đơn thuốc`}</Typography>
                    </Grid>

                    <FieldArray name='medicines'>
                        {
                            ({ push, remove, }) => (
                                <>
                                    {
                                        values.medicines.map((_, index) => (
                                            <Grid container item key={index} spacing={1} direction='row'>
                                                <Grid item xs={5.5}>
                                                    <Field
                                                        component={TextField}
                                                        name={`medicines.${index}.medicine`}
                                                        // multiline
                                                        helperText='Thuốc'
                                                        variant="standard"
                                                        fullWidth
                                                    // sx={{ width: '100%' }}
                                                    />
                                                </Grid>

                                                <Grid item xs={4}>
                                                    {/* <Button onClick={() => remove(index)}>Xóa</Button> */}
                                                    <IconButton onClick={() => remove(index)}>
                                                        <DeleteForeverIcon sx={{ color: 'red' }} />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        ))
                                    }
                                    <br />
                                    <Grid item>
                                        {typeof errors.medicines === 'string' ?
                                            <>
                                                <Typography sx={{ color: 'red' }}>
                                                    {errors.medicines}
                                                </Typography>
                                                <br />
                                            </>
                                            : null}
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="outlined"
                                            onClick={() => push(emptyMedicine)}>
                                            <PlaylistAddIcon />
                                            Thêm Thuốc
                                        </Button>
                                    </Grid>
                                </>
                            )
                        }
                    </FieldArray>
                    <br />
                </Form>)
                }
            </Formik>
        </>
    )
}

export default CreateRecord