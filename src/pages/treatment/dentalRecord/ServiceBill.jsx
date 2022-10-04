import { Box, Button, Card, CardContent, CardHeader, FormControl, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useState } from 'react';

import CreateRecord from './CreateRecord';

// dữ liệu giả
const bill = [
    // {
    //     'billId_serviceId': '01',
    //     "startDay": '30/09/2022',
    //     'services': [
    //         {
    //             "serviceName": "Dịch vụ trám răng",
    //             "status": "not done"
    //         },
    //         // {
    //         //     "serviceName": "Dịch vụ 2",
    //         //     "status": "not done"
    //         // }
    //     ],
    //     'record': [
    //         {
    //             "recordName": 'record 1',
    //         }

    //     ]
    // },
    // {
    //     'billId_serviceId': '02',
    //     "startDay": '22/01/2022',
    //     'services': [
    //         {
    //             "serviceName": "Dịch vụ trồng răng",
    //             "status": "not done"
    //         },
    //         // {
    //         //     "serviceName": "Dịch vụ 2",
    //         //     "status": "not done"
    //         // }
    //     ],
    //     'record': [
    //         {
    //             "recordName": 'record 1'
    //         }
    //     ]
    // }
]

const ServiceBill = () => {
    console.log(bill.length);
    const [recordbillId_serviceId, setRecordbillId_serviceId] = useState('khong co')
    const [secondMenuItemSelect, setSecondMenuItemSelect] = useState()
    const handleChange = (event) => {
        setRecordbillId_serviceId(event.target.value)
        if (event.target.value === 'khong co')
            setSecondMenuItemSelect()
    }
    const handleClickAddRecord = (item) => {

        setSecondMenuItemSelect(item)
        setRecordbillId_serviceId(item.billId_serviceId)
    }
    // console.log("select", recordbillId_serviceId);
    return (
        <Grid container spacing={1} direction='column'>
            {bill.length !== 0 &&
                <>
                    <Grid item>
                        <Typography variant='subtitle1' sx={{
                            // color: 'blue',
                            fontWeight: '500'
                        }}>I. Các dịch vụ điều trị chưa hoàn tất</Typography>
                    </Grid>
                    {/* có bao nhiêu hóa đơn thì bấy nhiêu card */}

                    <Grid container item spacing={2} >
                        {/* có bao nhiêu hóa đơn thì bấy nhiêu card */}
                        {bill?.map((item, index) => (
                            <Grid item key={index}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={2} direction='column'>
                                            <Grid item>

                                                <Typography
                                                    sx={{
                                                        color: '#673ab7',
                                                        fontWeight: '500'
                                                    }}>
                                                    {`Ngày bắt đầu điều trị ${item?.startDay}`}
                                                </Typography>
                                            </Grid>

                                            <Grid item>
                                                {/* có bao nhiêu dịch vụ  */}
                                                {item?.services.map((service, indexS) => (

                                                    <Box key={indexS} sx={{ borderBottom: '1px #000 solid', padding: '8px 0px' }}>
                                                        <Typography>
                                                            {service?.serviceName}
                                                        </Typography>
                                                        {`Status: ${service?.status}`}
                                                    </Box>

                                                ))}

                                            </Grid>
                                            <Grid container item spacing={1} sx={{
                                                color: '#03a203', alignItems: 'center',
                                                cursor: 'pointer'
                                            }}
                                                onClick={() => (console.log('ok'))}
                                            >
                                                <Grid item><FeedOutlinedIcon /></Grid>
                                                <Grid item>
                                                    <Typography>
                                                        Các dental care record liên quan
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Button variant='contained'
                                                    disabled={item.billId_serviceId === recordbillId_serviceId}
                                                    onClick={() => (handleClickAddRecord(item))}
                                                >
                                                    {item.billId_serviceId === recordbillId_serviceId ? 'Đã chọn, xuống mục II hoàn tất record'
                                                        : '+ Tạo dental care record'
                                                    }

                                                </Button>
                                            </Grid>

                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <br />
                </>}
            {/* tạo record */}
            <Typography variant='subtitle1' sx={{
                fontWeight: '500'
            }}>
                {bill.length !== 0 && 'II. Tạo Dental Care Record'}
                {bill.length === 0 && 'I. Tạo Dental Care Record'}
            </Typography>
            {
                bill.length !== 0 &&
                <Grid container spacing={2}
                    sx={{ alignItems: 'center' }}
                >
                    <Grid item>
                        <Typography variant='subtitle1' sx={{
                            fontWeight: '500'
                        }}>1. Dental care record liên quan đến công tác điều trị dịch vụ</Typography>
                    </Grid>
                    <Grid item >
                        <FormControl
                            variant="standard"
                            sx={{ m: 1, minWidth: 120, }}>

                            <Select
                                // labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={recordbillId_serviceId}
                                onChange={handleChange}
                                label="Ngày"
                            >
                                <MenuItem value={'khong co'}>
                                    Không có (Tạo mới)
                                </MenuItem>
                                {secondMenuItemSelect === undefined ? null :
                                    <MenuItem value={secondMenuItemSelect.billId_serviceId}>
                                        {`${secondMenuItemSelect.services[0].serviceName} - Ngày bắt đầu điều trị ${secondMenuItemSelect.startDay}`}
                                    </MenuItem>
                                }
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>
            }


            <CreateRecord secondMenuItemSelect={secondMenuItemSelect} recordbillId_serviceId={recordbillId_serviceId} no={bill.length === 0 ? 1 : 2} />

        </Grid >
    )
}

export default ServiceBill