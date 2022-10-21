import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { ref, update } from 'firebase/database'
import { useState } from 'react'

import StartFirebase from '../../../components/firebaseConfig'
import BillDetail from './BillDetail'

// get các dịch vụ có trong bill của bệnh nhân có trạng thái khác hủy, get rồi setStateDich vụ, mỗi lần
// state dịch vụ thay đổi thì gọi lại
const dichvu = [
    {
        'tên': 'Nhổ răng 1',
        'sốlầnthựchiện': '1',
        'sốlượng': '1',
        'đơngiá': '150000',
        'thànhtiền': '150000',
        'trạngtháidịchvụ': 'not yet' // mới khởi tạo, hoàn tất, chưa hoàn tất,
        // hủy thì ko có trong ds này
    },
    // {
    //     'tên': 'Trám răng',
    //     'sốlầnthựchiện': '1',
    //     'sốlượng': '1',
    //     'đơngiá': '300000',
    //     'thànhtiền': '300000',
    //     'trạngtháidịchvụ': 'done' // mới khởi tạo, hoàn tất, chưa hoàn tất,
    //     // hủy thì ko có trong ds này
    // }
]
const bill = [
    // {
    //     tongtien: '150000',
    //     datra: '0',
    //     conlai: '150000',
    //     thongtinthanhtoan: 'Chưa thanh toán xong'
    // },
    {
        billID: '1',
        ngayTaoBill: '21/10/2022',
        status: 'Unpaid',
        tongTien: '200000',
        soTienTraTruoc: null,
        billDetails: [
            {
                tenDichVu: 'dv1',
                soLuong: '1',
                donGia: '200000',
                thanhTien: '200000',
                soLanDuKien: '1',
                trangThaiDichVu: 'Not Yet'
            }
        ],
        trangThaiCoTheCapNhat: [
            'Paid'
        ]
    },
    {
        billID: '2',
        ngayTaoBill: '20/10/2022',
        status: 'In Process',
        tongTien: '500000',
        soTienTraTruoc: '250000',
        billDetails: [
            {
                tenDichVu: 'dv1',
                soLuong: '1',
                donGia: '200000',
                thanhTien: '200000',
                soLanDuKien: '2',
                trangThaiDichVu: 'In Progress'
            }
        ],
        trangThaiCoTheCapNhat: [
            'Paid'
        ]
    },
    {
        billID: '3',
        ngayTaoBill: '20/10/2022',
        status: 'Unpaid',
        tongTien: '500000',
        soTienTraTruoc: '250000',
        billDetails: [
            {
                tenDichVu: 'dv1',
                soLuong: '1',
                donGia: '200000',
                thanhTien: '200000',
                soLanDuKien: '3',
                trangThaiDichVu: 'In Progress'
            },
            {
                tenDichVu: 'dv2',
                soLuong: '1',
                donGia: '150000',
                thanhTien: '150000',
                soLanDuKien: '1',
                trangThaiDichVu: 'done'
            }
        ],
        trangThaiCoTheCapNhat: [
            'In Process', 'Paid'
        ]
    }
]
const db = StartFirebase()

const HoaDon = ({ dataFirebasePatient }) => {


    console.log(dataFirebasePatient);
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
    const handleHuyBo = () => {
        // nhấn hủy bỏ, thì gọi api, cập nhật trạng thái hủy bỏ, xóa khỏi state dịch vụ để load lại table dịch vụ
        // cập nhật trạng thái dịch vụ hóa đơn trong firebase, có thể bỏ luôn, à phải check
        // check xem có dataFirebasePatient hay ko, có payment Confirmation hay ko thì mới cập nhật
    }
    return (
        <>
            <Grid container spacing={1} direction='column'>
                {
                    bill?.map((item, i) => (
                        <BillDetail
                            key={i}
                            item={item}
                            handleHuyBo={handleHuyBo}
                            dataFirebasePatient={dataFirebasePatient}
                        />
                    ))
                }
            </Grid>
        </>
    )
}

export default HoaDon