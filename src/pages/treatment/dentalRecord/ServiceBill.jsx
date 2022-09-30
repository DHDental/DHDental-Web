import { Box, Button, Card, CardContent, CardHeader, FormControl, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useState } from 'react';

import CreateRecord from './CreateRecord';

// dữ liệu giả
const bill = [
    {
        'billId': '01',
        "startDay": '30/09/2022',
        'services': [
            {
                "serviceName": "Dịch vụ 1",
                "status": "not done"
            },
            {
                "serviceName": "Dịch vụ 2",
                "status": "not done"
            }
        ],
        'record': [
            {
                "recordName": 'record 1',
            }

        ]
    },
    {
        'billId': '02',
        "startDay": '22/01/2022',
        'services': [
            {
                "serviceName": "Dịch vụ 1",
                "status": "not done"
            },
            {
                "serviceName": "Dịch vụ 2",
                "status": "not done"
            }
        ],
        'record': [
            {
                "recordName": 'record 1'
            }
        ]
    }
]

const ServiceBill = () => {
    const [recordBillId, setRecordBillId] = useState('không có')
    const [secondMenuItemSelect, setSecondMenuItemSelect] = useState()
    const handleChange = (event) => {
        setRecordBillId(event.target.value)
    }
    const handleClickAddRecord = (item) => {

        setSecondMenuItemSelect(item)
        setRecordBillId(item.billId)
    }
    console.log("select", recordBillId);
    return (
        <Grid container spacing={1} direction='column'>
            <Grid item>
                <Typography variant='subtitle1' sx={{
                    // color: 'blue',
                    fontWeight: '500'
                }}>I. Các lần điều trị có dịch vụ chưa hoàn tất</Typography>
            </Grid>

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
                                            disabled={item.billId === recordBillId}
                                            onClick={() => (handleClickAddRecord(item))}
                                        >
                                            {item.billId === recordBillId ? 'Đã chọn, xuống mục II hoàn tất record'
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
            {/* tạo record */}
            <Typography variant='subtitle1' sx={{
                fontWeight: '500'
            }}>
                II. Tạo Dental Care Record
            </Typography>
            <Grid container spacing={2}
                sx={{ alignItems: 'center' }}
            >
                <Grid item>
                    <Typography variant='subtitle1' sx={{
                        fontWeight: '500'
                    }}>1. Dental care record liên quan đến lần điều trị có ngày bắt đầu</Typography>
                </Grid>
                <Grid item >
                    <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120, }}>
                        {/* <InputLabel id="demo-simple-select-standard-label">Ngày bắt đầu điều trị</InputLabel> */}
                        <Select
                            // labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={recordBillId}
                            onChange={handleChange}
                            label="Ngày"
                        >
                            <MenuItem value={'không có'}>
                                Không có (Tạo mới)
                            </MenuItem>
                            {secondMenuItemSelect === undefined ? null :
                                <MenuItem value={secondMenuItemSelect.billId}>
                                    {secondMenuItemSelect.startDay}
                                </MenuItem>
                            }
                        </Select>
                    </FormControl>
                </Grid>

            </Grid>

            <CreateRecord />

        </Grid >
    )
}

export default ServiceBill