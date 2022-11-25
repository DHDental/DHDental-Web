import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import Mota from './Mota';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { onValue, ref, remove, update } from 'firebase/database';

import StartFirebase from '../../../../components/firebaseConfig';
import { CustomBackdrop, CustomSnackbar } from '../../../../components';
import Service from './Service';
import { formatDateMonthYear2, formatYearMonthDate } from '../../../../common/utils/formatDate';
import Thuoc from './Thuoc';
import HenTaiKham from './HenTaiKham';
import SnackbarRecord from './SnackbarRecord';
import { TaoRecordPopUp } from './TaoRecordPopUp';
import { DENTIST_DS_KHAM } from '../../../../common/constants/pathConstants';
import { axiosPrivate } from '../../../../api/axiosInstance';
import { CREATE_RECORD } from '../../../../common/constants/apiConstants';
import RelatedHistory from './RelatedHistory';
import dayjs from 'dayjs';

const db = StartFirebase()

const Record = ({ bill }) => {
    const navigate = useNavigate();
    const param = useParams()
    // console.log('record', bill);
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

    const [thuocList, setThuocList] = useState([])
    const [ngayTaiKham, setNgayTaiKham] = useState(null)
    const [errorNgayTaiKham, setErrorNgayTaiKham] = useState('')

    const [openPopUpRecord, setOpenPopUpRecord] = useState(false)
    const [openSnackbar2, setOpenSnackbar2] = useState(false);
    const [textSnackbar2, setTextSnackbar2] = useState('');
    const [severity2, setSeverity2] = useState('success');
    const [recordID, setRecordID] = useState('')

    const [openRelatedHistory, setOpenRelatedHistory] = useState(false)
    const [billDetailHistory, setBillDetailHistory] = useState()

    const [hideThuocAndTaiKham, setHideThuocAndTaiKham] = useState(false)
    const [hideService, setHideService] = useState(false)

    const handleContinueService = (item) => {
        let statusThanhToan
        if (item?.billStatus == 'In Progress') {
            statusThanhToan = 'chua'
            console.log(1);
        }
        else {
            statusThanhToan = 'roi'
        }
        const newItem = {
            dacTa: item?.serviceSpecification,
            expectedPrice: item?.price,
            id: item?.serviceId,
            serviceDesc: item?.serviceName,
            soLanDuKienThucHien: item?.expectedTime,
            soLuong: item?.quantity,
            idContinue: 1,
            billID: item?.billId,
            billDetailID: item?.billDetailId,
            serviceStatus: item?.serviceStatus,
            statusThanhToan: statusThanhToan,
            statusUpdate: item?.statusUpdate
        }
        console.log('a', newItem);
        console.log(serviceList);
        var count = 0
        serviceList.forEach(element => {
            if (newItem?.billDetailID === element?.billDetailID) count = 1;
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

    const handleCreateRecord = () => {
        if (motaList.length == 0) {
            setTextSnackbar('Cần có mô tả bệnh lí, công tác điều trị trước khi lưu record')
            setSeverity('error')
            setOpenSnackbar(true)
            return
        }
        if (dataFirebasePatient[0]?.data?.record?.paymentConfirmation == '0') {
            setTextSnackbar('Chưa xử lí xác nhận thanh toán xong')
            setSeverity('error')
            setOpenSnackbar(true)
            return
        }
        if (errorNgayTaiKham != '') {
            setTextSnackbar('Ngày tái khám hiện không hợp lệ. Chọn lại ngày tái khám cho phù hợp')
            setSeverity('error')
            setOpenSnackbar(true)
            return
        }
        setOpenPopUpRecord(true)
    }
    const handleClosePopUpRecord = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopUpRecord(false);
    }
    const handleYesPopUpRecord = async () => {
        try {
            setOpenPopUpRecord(false)
            setOpenBackdrop(true);
            let billDetailList = []
            if (dataFirebasePatient[0]?.data?.record?.paymentConfirmation == '1') {
                dataFirebasePatient[0]?.data?.record?.serviceHoaDon?.forEach((item, i) => {
                    const newItem = {
                        billDetailID: item?.billDetailID,
                        serviceStatus: item?.serviceStatus == 'Not Yet' ? 'In Progress' : item?.serviceStatus
                    }
                    billDetailList = [...billDetailList, newItem]
                })
            }
            if (recordID != '') {
                if (billDetailList.length == 0 && dataFirebasePatient[0]?.data?.record?.paymentConfirmation == '0') {
                    setOpenBackdrop(false);
                    setTextSnackbar('Không lưu được dental care record. Vui lòng kiểm tra lại')
                    setSeverity('error')
                    setOpenSnackbar(true)
                    return
                } else {
                    let newThuocList = []
                    thuocList.forEach((thuoc, i) => {
                        const newItem = {
                            "drugID": thuoc?.id,
                            "quantity": thuoc?.soLuong
                        }
                        newThuocList = [...newThuocList, newItem]
                    })
                    const request = {
                        userPhoneNumber: param?.id,
                        recordID: recordID,
                        reExamination: ngayTaiKham == null ? '' : formatYearMonthDate(ngayTaiKham),
                        recordDesc: motaList,
                        prescription: newThuocList,
                        billDetailList: billDetailList
                    }
                    console.log(request);
                    const response = await axiosPrivate.post(CREATE_RECORD, {
                        userPhoneNumber: param?.id,
                        recordID: recordID,
                        reExamination: ngayTaiKham == null ? '' : formatYearMonthDate(ngayTaiKham),
                        recordDesc: motaList,
                        prescription: newThuocList,
                        billDetailList: billDetailList
                    })
                    // update(ref(db, location?.state?.patient?.key), {
                    //     status: 11,
                    // })
                    remove(ref(db, location?.state?.patient?.key))
                    setOpenBackdrop(false);
                    setTextSnackbar2('Lưu dental care record thành công. Chuyển qua trang danh sách khám sau vài giây')
                    setSeverity2('success')
                    setOpenSnackbar2(true)
                    const handler = setTimeout(() =>
                        navigate(DENTIST_DS_KHAM, { replace: true }), 1400)
                }
            } else {
                let newThuocList = []
                thuocList.forEach((thuoc, i) => {
                    const newItem = {
                        "drugID": thuoc?.id,
                        "quantity": thuoc?.soLuong
                    }
                    newThuocList = [...newThuocList, newItem]
                })
                const request = {
                    userPhoneNumber: param?.id,
                    recordID: recordID,
                    reExamination: ngayTaiKham == null ? '' : formatYearMonthDate(ngayTaiKham),
                    recordDesc: motaList,
                    prescription: newThuocList,
                    billDetailList: billDetailList
                }
                console.log(request);
                const response = await axiosPrivate.post(CREATE_RECORD, {
                    userPhoneNumber: param?.id,
                    recordID: recordID,
                    reExamination: ngayTaiKham == null ? '' : formatYearMonthDate(ngayTaiKham),
                    recordDesc: motaList,
                    prescription: newThuocList,
                    billDetailList: billDetailList
                })
                // update(ref(db, location?.state?.patient?.key), {
                //     status: 11,
                // })
                remove(ref(db, location?.state?.patient?.key))
                setOpenBackdrop(false);
                setTextSnackbar2('Lưu dental care record thành công. Chuyển qua trang danh sách khám sau vài giây')
                setSeverity2('success')
                setOpenSnackbar2(true)
                const handler = setTimeout(() =>
                    navigate(DENTIST_DS_KHAM, { replace: true }), 1400)
            }
        } catch (error) {
            console.log(error);
            setOpenBackdrop(false);
            setTextSnackbar('Lưu dental care record thất bại')
            setSeverity('error')
            setOpenSnackbar(true)
        }
    }
    const handleCloseRelatedHistory = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenRelatedHistory(false);
    };
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
        if (dataFirebasePatient[0]?.data?.record?.thuocList) {
            setThuocList(dataFirebasePatient[0]?.data?.record?.thuocList)
        }
        if (dataFirebasePatient[0]?.data?.record?.serviceHoaDon) {
            setServiceHoaDon(dataFirebasePatient[0]?.data?.record?.serviceHoaDon)
            setTaoHoaDon('daTao')
        }
        if (dataFirebasePatient[0]?.data?.record?.recordID) {
            setRecordID(dataFirebasePatient[0]?.data?.record?.recordID)
        }

        if (dataFirebasePatient[0]?.data?.record?.motaList?.length == 0 || dataFirebasePatient[0]?.data?.record?.motaList == undefined) {
            setHideThuocAndTaiKham(true)
            setHideService(true)
        } else {
            setHideThuocAndTaiKham(false)
            setHideService(false)
        }

        if (dataFirebasePatient[0]?.data?.record?.serviceList?.length != 0 && dataFirebasePatient[0]?.data?.record?.serviceList?.length != undefined) {
            if (dataFirebasePatient[0]?.data?.record?.paymentConfirmation != '1') {
                setHideThuocAndTaiKham(true)
            } else {
                setHideThuocAndTaiKham(false)
                if (dataFirebasePatient[0]?.data?.record?.motaList?.length == 0 || dataFirebasePatient[0]?.data?.record?.motaList == undefined)
                    setHideThuocAndTaiKham(true)
            }
        } else {
            setHideThuocAndTaiKham(false)
            if (dataFirebasePatient[0]?.data?.record?.motaList?.length == 0 || dataFirebasePatient[0]?.data?.record?.motaList == undefined)
                setHideThuocAndTaiKham(true)
        }

        if (dataFirebasePatient?.length == 0) {
            setHideService(false)
            setHideThuocAndTaiKham(false)
        }
    }, [dataFirebasePatient])
    useEffect(() => {
        setErrorNgayTaiKham('')
        if (ngayTaiKham == null) return
        if (formatYearMonthDate(ngayTaiKham) == 'Invalid Date') {
            setErrorNgayTaiKham('Ngày tái khám không hợp lệ')
        }
        else {
            if (dayjs(ngayTaiKham).diff(dayjs()) < 1) {
                setErrorNgayTaiKham('Ngày tái khám không hợp lệ')
            }
            else { setErrorNgayTaiKham('') }
        }


    }, [ngayTaiKham])
    return (
        <>
            <Grid container spacing={1} direction='column'>
                <section>
                    <Grid item>
                        <Typography variant='subtitle1' sx={{
                            // color: 'blue',
                            fontWeight: '500'
                        }}>I. Công tác điều trị chưa hoàn tất</Typography>
                    </Grid>
                </section>
                <br />
                <section>
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
                                                    {`Ngày bắt đầu điều trị ${formatDateMonthYear2(item?.billDateCreate)}`}
                                                </Typography>
                                            </Grid>

                                            <Grid item>

                                                {/* {item?.services.map((service, indexS) => ( */}

                                                <Box sx={{ borderBottom: '1px #000 solid', padding: '1px 0px' }}>
                                                    <Typography>
                                                        Dịch vụ: {item?.serviceName}
                                                    </Typography>
                                                    {/* {`Trạng thái: Chưa hoàn tất`} */}
                                                    <Typography>{`Đặc tả: ${item?.serviceSpecification}`}</Typography>
                                                    <Typography>{`Số lượng: ${item?.quantity}`}</Typography>
                                                </Box>

                                                {/* ))} */}

                                            </Grid>

                                            <Grid container item spacing={1} sx={{
                                                color: '#03a203', alignItems: 'center',
                                                cursor: 'pointer'
                                            }}
                                                onClick={() => {

                                                    setBillDetailHistory(item?.billDetailId)
                                                    setOpenRelatedHistory(true)
                                                }}
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
                                                        // console.log(item);
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
                </section>
                <br />
                <section>
                    <Grid item>
                        <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>II. Tạo dental care record</Typography>
                    </Grid>
                    <Mota motaList={motaList} setMotaList={setMotaList} />
                </section>
                {/* <br /> */}
                <section style={{
                    opacity: hideService ? '0.25' : '1',
                    pointerEvents: hideService ? 'none' : ''
                }}>
                    <Service serviceList={serviceList} setServiceList={setServiceList}
                        serviceHoaDon={serviceHoaDon} setServiceHoaDon={setServiceHoaDon}
                        taoHoaDon={taoHoaDon} setTaoHoaDon={setTaoHoaDon}
                        dataFirebasePatient={dataFirebasePatient}
                        setRecordID={setRecordID}
                    />
                </section>
                <br />
                <section style={{
                    opacity: hideThuocAndTaiKham ? '0.25' : '1',
                    pointerEvents: hideThuocAndTaiKham ? 'none' : ''
                }}>
                    <Thuoc thuocList={thuocList} setThuocList={setThuocList} />
                    <br />
                    <HenTaiKham ngayTaiKham={ngayTaiKham} setNgayTaiKham={setNgayTaiKham} errorNgayTaiKham={errorNgayTaiKham} />
                </section>
                <br />
                <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='contained'
                        disableElevation
                        onClick={handleCreateRecord}
                        disabled={hideThuocAndTaiKham}
                    >Lưu dental care record và Kết thúc khám bệnh</Button>
                </Grid>
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

            <SnackbarRecord handleClose={() => {
                setOpenSnackbar2(false)
            }}
                open={openSnackbar2}
                text={textSnackbar2}
                severity={severity2}
                variant='standard'
                vertical='top'
                horizontal='center'
            />
            <TaoRecordPopUp open={openPopUpRecord} handleClose={handleClosePopUpRecord} handleYes={handleYesPopUpRecord} />
            <RelatedHistory
                open={openRelatedHistory}
                handleClose={handleCloseRelatedHistory}
                billDetailHistory={billDetailHistory}
            />
        </>
    )
}

export default Record