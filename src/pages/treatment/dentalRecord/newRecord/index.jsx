import { Box, Button, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { onValue, ref, remove, update } from 'firebase/database';

import Mota from './Mota'
import StartFirebase from '../../../../components/firebaseConfig'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CustomBackdrop, CustomSnackbar } from '../../../../components';
import Service from './Service';
import Thuoc from './Thuoc';
import HenTaiKham from './HenTaiKham';
import { axiosPrivate } from '../../../../api/axiosInstance';
import { CREATE_RECORD } from '../../../../common/constants/apiConstants';
import { formatYearMonthDate } from '../../../../common/utils/formatDate';
import { TaoRecordPopUp } from './TaoRecordPopUp';
import { async } from '@firebase/util';
import { DENTIST_DS_KHAM } from '../../../../common/constants/pathConstants';
import SnackbarRecord from './SnackbarRecord';

const db = StartFirebase()
const NewRecord = () => {
    const location = useLocation()
    const param = useParams()
    const navigate = useNavigate();
    // console.log(param);
    const [motaList, setMotaList] = useState([])
    const [dataFirebasePatient, setDataFirebasePatient] = useState([])
    const [openBackdrop, setOpenBackdrop] = useState(false)

    const [serviceList, setServiceList] = useState([])
    const [serviceHoaDon, setServiceHoaDon] = useState([])
    const [taoHoaDon, setTaoHoaDon] = useState('')

    const [thuocList, setThuocList] = useState([])

    const [ngayTaiKham, setNgayTaiKham] = useState(null)

    const [recordID, setRecordID] = useState('')
    const [openPopUpRecord, setOpenPopUpRecord] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [textSnackbar, setTextSnackbar] = useState('');
    const [severity, setSeverity] = useState('success');
    // console.log(motaList);

    const handleClosePopUpRecord = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenPopUpRecord(false);
    }
    const handleYesPopUpRecord = async () => {
        try {
            // const response = await axiosPrivate.post(CREATE_RECORD, {

            // })
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
                        prescription: thuocList,
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
                    setTextSnackbar('Lưu dental care record thành công. Chuyển qua trang danh sách khám sau vài giây')
                    setSeverity('success')
                    setOpenSnackbar(true)
                    const handler = setTimeout(() =>
                        navigate(DENTIST_DS_KHAM, { replace: true }), 1500)
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
                    prescription: thuocList,
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
                setTextSnackbar('Lưu dental care record thành công. Chuyển qua trang danh sách khám sau vài giây')
                setSeverity('success')
                setOpenSnackbar(true)
                const handler = setTimeout(() =>
                    navigate(DENTIST_DS_KHAM, { replace: true }), 1500)
            }
        } catch (error) {
            console.log(error);
            setOpenBackdrop(false);
            setTextSnackbar('Lưu dental care record thất bại')
            setSeverity('error')
            setOpenSnackbar(true)
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
        setOpenPopUpRecord(true)
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
        // if (dataFirebasePatient[0]?.data.treatment) {
        //     // console.log('yes');
        //     setServiceList(dataFirebasePatient[0]?.data.treatment)
        //     setTaoHoaDon('daTao')
        //     if (dataFirebasePatient[0]?.data.serviceHoaDon)
        //         setServiceHoaDon(dataFirebasePatient[0]?.data.serviceHoaDon)
        // }

        if (dataFirebasePatient[0]?.data?.record?.motaList) {
            setMotaList(dataFirebasePatient[0]?.data?.record?.motaList)
        }
        if (dataFirebasePatient[0]?.data?.record?.recordID) {
            setRecordID(dataFirebasePatient[0]?.data?.record?.recordID)
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
        // if (dataFirebasePatient[0]?.data?.record?.ngayTaiKham) {
        //     setNgayTaiKham(dataFirebasePatient[0]?.data?.record?.ngayTaiKham)
        // }

    }, [dataFirebasePatient])
    // console.log(serviceList);
    return (
        <>
            <Grid container spacing={1} direction='column'>
                <Grid item> <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>I. Tạo dental care record</Typography></Grid>
                <Mota motaList={motaList} setMotaList={setMotaList} />
                <br />

                <Service serviceList={serviceList} setServiceList={setServiceList}
                    serviceHoaDon={serviceHoaDon} setServiceHoaDon={setServiceHoaDon}
                    taoHoaDon={taoHoaDon} setTaoHoaDon={setTaoHoaDon}
                    dataFirebasePatient={dataFirebasePatient}
                    setRecordID={setRecordID}
                />
                <br />
                <Thuoc thuocList={thuocList} setThuocList={setThuocList} />
                <br />
                <HenTaiKham ngayTaiKham={ngayTaiKham} setNgayTaiKham={setNgayTaiKham} />
                <br />

                <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='contained'
                        disableElevation
                        onClick={handleCreateRecord}
                    >Lưu dental care record và Kết thúc khám bệnh</Button>
                </Grid>

            </Grid>
            <CustomBackdrop open={openBackdrop} />
            {/* <CustomSnackbar handleClose={() => {
                setOpenSnackbar(false)
            }}
                open={openSnackbar}
                text={textSnackbar}
                severity={severity}
                variant='standard'
                vertical='top'
                horizontal='right'
            /> */}
            <SnackbarRecord handleClose={() => {
                setOpenSnackbar(false)
            }}
                open={openSnackbar}
                text={textSnackbar}
                severity={severity}
                variant='standard'
                vertical='top'
                horizontal='center'
            />
            <TaoRecordPopUp open={openPopUpRecord} handleClose={handleClosePopUpRecord} handleYes={handleYesPopUpRecord} />
        </>
    )
}

export default NewRecord