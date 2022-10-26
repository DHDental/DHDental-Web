import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { ref, update } from 'firebase/database'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosPublic } from '../../../api/axiosInstance'
import { STAFF_BILL } from '../../../common/constants/pathConstants'
import { CustomBackdrop, CustomSnackbar } from '../../../components'

import StartFirebase from '../../../components/firebaseConfig'
import BillDetail from './BillDetail'

// get các dịch vụ có trong bill của bệnh nhân có trạng thái khác hủy, get rồi setStateDich vụ, mỗi lần
// state dịch vụ thay đổi thì gọi lại
// const dichvu = [
//     {
//         'tên': 'Nhổ răng 1',
//         'sốlầnthựchiện': '1',
//         'sốlượng': '1',
//         'đơngiá': '150000',
//         'thànhtiền': '150000',
//         'trạngtháidịchvụ': 'not yet' // mới khởi tạo, hoàn tất, chưa hoàn tất,
//         // hủy thì ko có trong ds này
//     },
//     // {
//     //     'tên': 'Trám răng',
//     //     'sốlầnthựchiện': '1',
//     //     'sốlượng': '1',
//     //     'đơngiá': '300000',
//     //     'thànhtiền': '300000',
//     //     'trạngtháidịchvụ': 'done' // mới khởi tạo, hoàn tất, chưa hoàn tất,
//     //     // hủy thì ko có trong ds này
//     // }
// ]
// const bill = [
//     // {
//     //     tongtien: '150000',
//     //     datra: '0',
//     //     conlai: '150000',
//     //     thongtinthanhtoan: 'Chưa thanh toán xong'
//     // },
//     {
//         billID: '1',
//         ngayTaoBill: '21/10/2022',
//         status: 'Unpaid',
//         tongTien: '200000',
//         soTienTraTruoc: null,
//         billDetails: [
//             {
//                 tenDichVu: 'dv1',
//                 soLuong: '1',
//                 donGia: '200000',
//                 thanhTien: '200000',
//                 soLanDuKien: '1',
//                 trangThaiDichVu: 'Not Yet'
//             }
//         ],
//         trangThaiCoTheCapNhat: [
//             'Paid'
//         ]
//     },
//     {
//         billID: '2',
//         ngayTaoBill: '20/10/2022',
//         status: 'In Process',
//         tongTien: '500000',
//         soTienTraTruoc: '250000',
//         billDetails: [
//             {
//                 tenDichVu: 'dv1',
//                 soLuong: '1',
//                 donGia: '500000',
//                 thanhTien: '500000',
//                 soLanDuKien: '2',
//                 trangThaiDichVu: 'In Progress'
//             }
//         ],
//         trangThaiCoTheCapNhat: [
//             'Paid'
//         ]
//     },
//     {
//         billID: '3',
//         ngayTaoBill: '21/10/2022',
//         status: 'Unpaid',
//         tongTien: '350000',
//         soTienTraTruoc: '175000',
//         billDetails: [
//             {
//                 tenDichVu: 'dv1',
//                 soLuong: '1',
//                 donGia: '200000',
//                 thanhTien: '200000',
//                 soLanDuKien: '3',
//                 trangThaiDichVu: 'Not Yet'
//             },
//             {
//                 tenDichVu: 'dv2',
//                 soLuong: '1',
//                 donGia: '150000',
//                 thanhTien: '150000',
//                 soLanDuKien: '1',
//                 trangThaiDichVu: 'Not Yet'
//             }
//         ],
//         trangThaiCoTheCapNhat: [
//             'In Process', 'Paid'
//         ]
//     }
// ]
const db = StartFirebase()

const HoaDon = ({ dataFirebasePatient }) => {
    const param = useParams()

    const [bill, setBill] = useState()
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [reload, setReload] = useState(false)

    const [openSnackbar, setOpenSnackbar] = useState();
    const [textSnackbar, setTextSnackbar] = useState('');
    const [severity, setSeverity] = useState('success');

    // console.log(dataFirebasePatient);
    const handleThanhToan = () => {
        // check xem có có dataFirebasePatient hay ko, có payment Confirmation hay ko 
        // thì mới đụng tới firebase, không thì chỉ gọi api thanh toán thôi
        if (dataFirebasePatient[0]?.key && dataFirebasePatient[0]?.data?.record?.paymentConfirmation == 0) {
            update(ref(db, '-NE0UKLIS4i7uY3mlPAQ/record'), {
                paymentConfirmation: 1,
            })
            console.log('ok');
        } else {
            console.log('nok');
        }
    }

    useEffect(() => {
        // console.log('load');
        let isMounted = true;
        const getBill = async () => {
            try {
                setOpenBackdrop(true)
                const response = await axiosPublic.post(STAFF_BILL, {
                    "phoneNumber": param.id
                })
                isMounted && setBill(response.data)
                setOpenBackdrop(false)
            } catch (error) {
                setOpenBackdrop(false)
                console.log(error);
            }
        }
        getBill()
        return () => {
            isMounted = false;
        }
    }, [reload])
    return (
        <>
            <Grid container spacing={1} direction='column'>
                {
                    bill?.map((item, i) => (
                        <BillDetail
                            key={i}
                            item={item}
                            dataFirebasePatient={dataFirebasePatient}
                            setReload={setReload}
                            reload={reload}
                            setTextSnackbar={setTextSnackbar}
                            setSeverity={setSeverity}
                            setOpenSnackbar={setOpenSnackbar}
                            setOpenBackdrop={setOpenBackdrop}
                        />
                    ))
                }
                {bill?.length === 0 &&
                    <Grid item>
                        Không có hóa đơn cần thanh toán
                    </Grid>
                }
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

export default HoaDon