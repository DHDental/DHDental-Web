import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import AirplayIcon from '@mui/icons-material/Airplay';
import AppsOutageIcon from '@mui/icons-material/AppsOutage';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PortraitIcon from '@mui/icons-material/Portrait';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';

import {
    DENTIST_DS_KHAM, KHAM_BENH, STAFF_BENHNHAN, STAFF_DANG_KI_KHAM, STAFF_DSDATKHAM,
    STAFF_MAN_HINH_CHO_KHAM, STAFF_HOADON
} from './pathConstants';

export const sideBarStaffConfig = [
    { name: 'Danh sách đặt khám', icon: <EventNoteIcon />, path: STAFF_DSDATKHAM },
    { name: 'Đăng kí khám bệnh', icon: <PostAddIcon />, path: STAFF_DANG_KI_KHAM },
    // { name: 'Bệnh nhân', icon: <PortraitIcon />, path: STAFF_BENHNHAN },
    { name: 'Thanh toán', icon: <ReceiptIcon />, path: STAFF_HOADON },
    { name: "Màn hình chờ khám", icon: <AirplayIcon />, path: STAFF_MAN_HINH_CHO_KHAM },
]

export const sideBarDentistConfig = [
    { name: "Danh sách khám", icon: <AppsOutageIcon />, path: DENTIST_DS_KHAM },
    { name: 'Khám bệnh', icon: <AddToQueueIcon />, path: KHAM_BENH },
]