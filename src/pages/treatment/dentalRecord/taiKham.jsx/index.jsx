import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import Mota from './Mota';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { onValue, ref, update } from 'firebase/database';

import StartFirebase from '../../../../components/firebaseConfig';
import { CustomBackdrop, CustomSnackbar } from '../../../../components';
import Service from './Service';

const db = StartFirebase()

const Record = ({ bill }) => {
    const location = useLocation()
    const [motaList, setMotaList] = useState([])
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [dataFirebasePatient, setDataFirebasePatient] = useState([])

    const [serviceList, setServiceList] = useState([])
    const [serviceHoaDon, setServiceHoaDon] = useState([])
    const [taoHoaDon, setTaoHoaDon] = useState('')

    const [openSnackbar, setOpenSnackbar] = useState();
    const [textSnackbar, setTextSnackbar] = useState('');
    const [severity, setSeverity] = useState('success');


    const handleContinueService = (item) => {
        let statusThanhToan
        if (item?.services[0]?.billStatus == 'In Process') {
            statusThanhToan = 'chua'
            console.log(1);
        }
        else {
            statusThanhToan = 'roi'
        }
        const newItem = {
            dacTa: item?.services[0].dacTa,
            expectedPrice: 100000,
            id: item?.services[0].id,
            serviceDesc: item?.services[0].serviceName,
            soLanDuKienThucHien: 2,
            soLuong: item?.services[0].soLuong,
            idContinue: 1,
            billDetailId: item?.services[0].billDetailId,
            statusThanhToan: statusThanhToan
        }
        console.log(newItem);
        var count = 0
        serviceList.forEach(element => {
            if (newItem?.billDetailId === element?.billDetailId) count = 1;
        });
        if (count === 0) {
            update(ref(db, `${location?.state?.patient?.key}/record`), {
                serviceList: [...serviceList, newItem]
            })
            setServiceList([...serviceList, newItem])
            setTextSnackbar('Thêm vào danh sách chỉ định thành công')
            setSeverity('success')
            setOpenSnackbar(true)
            // setServiceList([...serviceList, newItem])
        }
        else {
            setTextSnackbar('Đã thêm vào danh sách chỉ định')
            setSeverity('info')
            setOpenSnackbar(true)
            return
        }

    }
    useEffect(() => {
        let isMounted = true;
        const dbRef = ref(db)
        setOpenBackdrop(true)
        onValue(dbRef, (snapshot) => {
            let records = [];
            snapshot.forEach(childSnapshot => {
                if (childSnapshot.key === location?.state?.patient?.key) {
                    let keyName = childSnapshot.key;
                    let data = childSnapshot.val();
                    records.push({ "key": keyName, "data": data })
                }
            })
            isMounted && setDataFirebasePatient(records)
        })
        setOpenBackdrop(false)
        return () => {
            isMounted = false;
        }
    }, [])
    useEffect(() => {
        if (dataFirebasePatient[0]?.data?.record?.motaList) {
            setMotaList(dataFirebasePatient[0]?.data?.record?.motaList)
        }
        if (dataFirebasePatient[0]?.data?.record?.serviceList) {
            setServiceList(dataFirebasePatient[0]?.data?.record?.serviceList)
        }
        // if (dataFirebasePatient[0]?.data?.record?.thuocList) {
        //     setThuocList(dataFirebasePatient[0]?.data?.record?.thuocList)
        // }
        if (dataFirebasePatient[0]?.data?.record?.serviceHoaDon) {
            setServiceHoaDon(dataFirebasePatient[0]?.data?.record?.serviceHoaDon)
            setTaoHoaDon('daTao')
        }
    }, [dataFirebasePatient])
    return (
        <>
            <Grid container spacing={1} direction='column'>
                <Grid item>
                    <Typography variant='subtitle1' sx={{
                        // color: 'blue',
                        fontWeight: '500'
                    }}>I. Công tác điều trị chưa hoàn tất</Typography>
                </Grid>

                <Grid container item spacing={2} direction='row'>
                    {/* có bao nhiêu dịch vụ giang giở thì bấy nhiêu card */}
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

                                            {item?.services.map((service, indexS) => (

                                                <Box key={indexS} sx={{ borderBottom: '1px #000 solid', padding: '8px 0px' }}>
                                                    <Typography>
                                                        {service?.serviceName}
                                                    </Typography>
                                                    {`Trạng thái: ${service?.status}`}
                                                    <Typography>{`Đặc tả: ${service?.dacTa}`}</Typography>
                                                    <Typography>{`Số lượng: ${service?.soLuong}`}</Typography>
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
                                                disableElevation
                                                disabled={taoHoaDon === 'daTao' ? true : false}
                                                onClick={() => {
                                                    handleContinueService(item)
                                                }}
                                            >

                                                Thêm vào danh sách chỉ định
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Grid item>
                    <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>II. Tạo dental care record</Typography>
                </Grid>
                <Mota motaList={motaList} setMotaList={setMotaList} />
                <br />
                <Service serviceList={serviceList} setServiceList={setServiceList}
                    serviceHoaDon={serviceHoaDon} setServiceHoaDon={setServiceHoaDon}
                    taoHoaDon={taoHoaDon} setTaoHoaDon={setTaoHoaDon}
                    dataFirebasePatient={dataFirebasePatient}
                />
            </Grid>
            <CustomBackdrop open={openBackdrop} />
            <CustomSnackbar handleClose={() => {
                setOpenSnackbar(false)
            }}
                open={openSnackbar}
                text={textSnackbar}
                severity={severity}
                variant='standard'
                vertical='top'
                horizontal='right'
            />
        </>
    )
}

export default Record