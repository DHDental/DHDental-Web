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
import dayjs from 'dayjs';
import jwtDecode from 'jwt-decode';

const db = StartFirebase()
const NewRecord = () => {
    const location = useLocation()
    const param = useParams()
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    let userDentist
    if (loginInfo != undefined) {
        try {
            userDentist = jwtDecode(loginInfo?.token)
        } catch (error) {
            userDentist = ''
        }

    }
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
    const [errorNgayTaiKham, setErrorNgayTaiKham] = useState('')

    const [recordID, setRecordID] = useState('')
    const [openPopUpRecord, setOpenPopUpRecord] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [textSnackbar, setTextSnackbar] = useState('');
    const [severity, setSeverity] = useState('success');
    // console.log(motaList);
    const [hideThuocAndTaiKham, setHideThuocAndTaiKham] = useState(false)
    const [hideService, setHideService] = useState(false)

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
                    setTextSnackbar('Kh??ng l??u ???????c dental care record. Vui l??ng ki???m tra l???i')
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
                        billDetailList: billDetailList,
                        dentistName: userDentist != '' ? userDentist?.fullName : userDentist
                    }
                    console.log(request);
                    const response = await axiosPrivate.post(CREATE_RECORD, {
                        userPhoneNumber: param?.id,
                        recordID: recordID,
                        reExamination: ngayTaiKham == null ? '' : formatYearMonthDate(ngayTaiKham),
                        recordDesc: motaList,
                        prescription: newThuocList,
                        billDetailList: billDetailList,
                        dentistName: userDentist != '' ? userDentist?.fullName : userDentist
                    })
                    // update(ref(db, location?.state?.patient?.key), {
                    //     status: 11,
                    // })
                    remove(ref(db, location?.state?.patient?.key))
                    setOpenBackdrop(false);
                    setTextSnackbar('L??u dental care record th??nh c??ng. Chuy???n qua trang danh s??ch kh??m sau v??i gi??y')
                    setSeverity('success')
                    setOpenSnackbar(true)
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
                    prescription: thuocList,
                    billDetailList: billDetailList,
                    dentistName: userDentist != '' ? userDentist?.fullName : userDentist
                }
                console.log(request);
                const response = await axiosPrivate.post(CREATE_RECORD, {
                    userPhoneNumber: param?.id,
                    recordID: recordID,
                    reExamination: ngayTaiKham == null ? '' : formatYearMonthDate(ngayTaiKham),
                    recordDesc: motaList,
                    prescription: newThuocList,
                    billDetailList: billDetailList,
                    dentistName: userDentist != '' ? userDentist?.fullName : userDentist
                })
                // update(ref(db, location?.state?.patient?.key), {
                //     status: 11,
                // })
                remove(ref(db, location?.state?.patient?.key))
                setOpenBackdrop(false);
                setTextSnackbar('L??u dental care record th??nh c??ng. Chuy???n qua trang danh s??ch kh??m sau v??i gi??y')
                setSeverity('success')
                setOpenSnackbar(true)
                const handler = setTimeout(() =>
                    navigate(DENTIST_DS_KHAM, { replace: true }), 1400)
            }
        } catch (error) {
            console.log(error);
            setOpenBackdrop(false);
            setTextSnackbar('L??u dental care record th???t b???i')
            setSeverity('error')
            setOpenSnackbar(true)
        }
    }
    const handleCreateRecord = () => {
        if (motaList.length == 0) {
            setTextSnackbar('C???n c?? m?? t??? b???nh l??, c??ng t??c ??i???u tr??? tr?????c khi l??u record')
            setSeverity('error')
            setOpenSnackbar(true)
            return
        }
        if (dataFirebasePatient[0]?.data?.record?.paymentConfirmation == '0') {
            setTextSnackbar('Ch??a x??? l?? x??c nh???n thanh to??n xong')
            setSeverity('error')
            setOpenSnackbar(true)
            return
        }
        if (errorNgayTaiKham != '') {
            setTextSnackbar('Ng??y t??i kh??m hi???n kh??ng h???p l???. Ch???n l???i ng??y t??i kh??m cho ph?? h???p')
            setSeverity('error')
            setOpenSnackbar(true)
            return
        }
        if (dataFirebasePatient[0]?.data?.record?.serviceHoaDon != undefined) {
            let flagTaiKham = 0
            dataFirebasePatient[0]?.data?.record?.serviceHoaDon?.forEach((item) => {
                if (item?.serviceStatus == 'Not Yet' || item?.serviceStatus == 'In Progress') {
                    flagTaiKham = 1
                }
            })
            if (flagTaiKham == 1 && ngayTaiKham == null) {
                setTextSnackbar('C???n ch???n ng??y t??i kh??m')
                setSeverity('error')
                setOpenSnackbar(true)
                return
            }
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
            setErrorNgayTaiKham('Ng??y t??i kh??m kh??ng h???p l???')
        }
        else {
            if (dayjs(ngayTaiKham).diff(dayjs()) < 1) {
                setErrorNgayTaiKham('Ng??y t??i kh??m kh??ng h???p l???')
            }
            else { setErrorNgayTaiKham('') }
        }


    }, [ngayTaiKham])
    // console.log(dataFirebasePatient[0]?.data?.record?.motaList?.length);
    return (
        <>
            <Grid container spacing={1} direction='column'>
                <section>
                    <Grid item> <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>I. T???o dental care record</Typography></Grid>
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
                    >L??u dental care record v?? K???t th??c kh??m b???nh</Button>
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