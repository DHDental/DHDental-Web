import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, TextField, Typography } from '@mui/material'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useState } from 'react';

const ServiceBill = () => {
    const [open, setOpen] = useState()
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
                <Grid item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} direction='column'>
                                <Grid item>
                                    <Typography
                                        sx={{
                                            color: '#673ab7',
                                            fontWeight: '500'
                                        }}>
                                        Ngày bắt đầu điều trị 20/9/2022
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Box sx={{ borderBottom: '1px #000 solid', padding: '8px 0px' }}>
                                        <Typography>
                                            Dịch vụ  1
                                        </Typography>
                                        Status: not done
                                    </Box>
                                    <Box sx={{ borderBottom: '1px #000 solid', padding: '8px 0px' }}>
                                        <Typography>
                                            Dịch vụ  2
                                        </Typography>
                                        Status: not done

                                    </Box>
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
                                    <Button variant='contained' onClick={() => {

                                    }}>
                                        + Tạo dental care record</Button>
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} direction='column'>
                                <Grid item>
                                    <Typography
                                        sx={{
                                            color: '#673ab7',
                                            fontWeight: '500'
                                        }}>
                                        Ngày bắt đầu điều trị 20/9/2022
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Box sx={{ borderBottom: '1px #000 solid', padding: '8px 0px' }}>
                                        <Typography>
                                            Dịch vụ  1
                                        </Typography>
                                        Status: not done
                                    </Box>
                                    <Box sx={{ borderBottom: '1px #000 solid', padding: '8px 0px' }}>
                                        <Typography>
                                            Dịch vụ  2
                                        </Typography>
                                        Status: not done

                                    </Box>
                                </Grid>
                                <Grid container item spacing={1} sx={{
                                    color: '#f38116', alignItems: 'center',
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
                                    <Button variant='contained' onClick={() => {

                                    }}>
                                        + Tạo dental care record</Button>
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Grid >
    )
}

export default ServiceBill