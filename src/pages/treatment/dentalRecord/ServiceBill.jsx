import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, TextField, Typography } from '@mui/material'
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
    const [billId, setBillId] = useState({
        'billId': '',
        'startDay': '',
    })

    const handleClick = (item) => {
        setBillId({
            'billId': item?.billId,
            'startDay': item?.startDay,
        })
    }
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
                                            onClick={() => (handleClick(item))}
                                        >
                                            + Tạo dental care record</Button>
                                    </Grid>

                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <br />
            {/* tạo record */}
            <CreateRecord billId={billId} />
        </Grid >
    )
}

export default ServiceBill