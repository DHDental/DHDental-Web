import { Button, Card, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { ref, update } from 'firebase/database'
import StartFirebase from '../../components/firebaseConfig'

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
const bill = {
    tongtien: '150000',
    datra: '0',
    conlai: '150000',
    thongtinthanhtoan: 'Chưa thanh toán xong'
}
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
                {/* <Grid item>
                    <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>Hóa Đơn</Typography>
                </Grid> */}
                <Grid item>
                    <Table
                        size="small"
                    >
                        <TableHead>
                            <TableRow hover>
                                <TableCell align='center'>Tên</TableCell>
                                <TableCell align='center'>Số lần thực hiện (dự kiến)</TableCell>
                                <TableCell align='center'>Số lượng</TableCell>
                                <TableCell align='center'>Đơn giá</TableCell>
                                <TableCell align='center'>Thành tiền</TableCell>
                                <TableCell align='center'></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dichvu.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell align='center'>{item?.tên}</TableCell>
                                    <TableCell align='center'>{item?.sốlầnthựchiện}</TableCell>
                                    <TableCell align='center'>{item?.sốlượng}</TableCell>
                                    <TableCell align='center'>
                                        {new Intl.NumberFormat('vi-VN'
                                            , { style: 'currency', currency: 'VND' }
                                        ).format(item?.đơngiá)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {new Intl.NumberFormat('vi-VN'
                                            , { style: 'currency', currency: 'VND' }
                                        ).format(item?.thànhtiền)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {item?.trạngtháidịchvụ !== 'done' ?
                                            <Button
                                                size='medium'
                                                sx={{ color: 'red' }}
                                                onClick={handleHuyBo}
                                            >Hủy bỏ</Button>
                                            : null}
                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                </Grid>
                <br />
                <Grid item>
                    <Typography variant='subtitle1' sx={{ fontWeight: '500' }}>Thanh toán</Typography>
                </Grid>
                <Grid item>
                    <Table
                        sx={{ width: '50%' }}
                    >
                        <TableBody >
                            <TableRow>
                                <TableCell align='left'>Thông tin thanh toán</TableCell>
                                <TableCell align='right'>{bill?.thongtinthanhtoan}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='left'>Tổng tiền</TableCell>
                                <TableCell align='right'>
                                    {new Intl.NumberFormat('vi-VN'
                                        , { style: 'currency', currency: 'VND' }
                                    ).format(bill?.tongtien)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='left'>Số tiền đã trả</TableCell>
                                <TableCell align='right'>
                                    {new Intl.NumberFormat('vi-VN'
                                        , { style: 'currency', currency: 'VND' }
                                    ).format(bill?.datra)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='left'>Số tiền chưa trả</TableCell>
                                <TableCell align='right'>
                                    {new Intl.NumberFormat('vi-VN'
                                        , { style: 'currency', currency: 'VND' }
                                    ).format(bill?.conlai)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='left'>Số tiền bệnh nhân đóng</TableCell>
                                <TableCell align='right'>
                                    <TextField
                                        variant='standard'
                                        label='Số tiền bệnh nhân đóng'
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align='right'>
                                    <Button onClick={handleThanhToan}>
                                        Thanh toán
                                    </Button>
                                </TableCell>

                            </TableRow>
                        </TableBody>
                    </Table>


                </Grid>

            </Grid>
        </>
    )
}

export default HoaDon