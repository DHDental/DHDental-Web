import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import AirplayIcon from '@mui/icons-material/Airplay';
import AppsOutageIcon from '@mui/icons-material/AppsOutage';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PortraitIcon from '@mui/icons-material/Portrait';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';

import {
    DENTIST_DS_KHAM, KHAM_BENH, STAFF_BENHNHAN, STAFF_DANG_KI_KHAM, STAFF_DSDATKHAM,
    STAFF_MAN_HINH_CHO_KHAM, STAFF_HOADON, ADMIN_TEST, OWNER_TEST, DEMO_TEST, STAFF_DANH_SACH_THUOC, OWNER_USER_SERVICE, ADMIN_USER, OWNER_CHECK_UP, OWNER_REVENUE, OWNER_USER_CANCEL_SERVICE
} from './pathConstants';

export const sideBarStaffConfig = [
    { name: 'Danh sách đặt khám', icon: <EventNoteIcon />, path: STAFF_DSDATKHAM },
    { name: 'Đăng kí khám bệnh', icon: <PostAddIcon />, path: STAFF_DANG_KI_KHAM },
    // { name: 'Bệnh nhân', icon: <PortraitIcon />, path: STAFF_BENHNHAN },
    { name: 'Thanh toán', icon: <ReceiptIcon />, path: STAFF_HOADON },
    { name: "Bệnh nhân", icon: <PortraitIcon />, path: STAFF_BENHNHAN },
    { name: "Màn hình chờ khám", icon: <AirplayIcon />, path: STAFF_MAN_HINH_CHO_KHAM },
    { name: "Danh sách thuốc", icon: <MedicationLiquidIcon />, path: STAFF_DANH_SACH_THUOC},
]

export const sideBarDentistConfig = [
    { name: "Danh sách khám", icon: <AppsOutageIcon />, path: DENTIST_DS_KHAM },
    { name: 'Khám bệnh', icon: <AddToQueueIcon />, path: KHAM_BENH },
]

export const sideBarAdminConfig = [
    { name: "Quản Lý Nhân Sự", icon: <ManageAccountsIcon />, path: ADMIN_TEST },
    { name: "Quản Lý Người Dùng", icon: <ManageAccountsIcon />, path:  ADMIN_USER},
]

export const sideBarOwnerConfig = [
    { name: "Quản Lý Dịch Vụ", icon: <SupportAgentIcon />, path: OWNER_TEST },
    { name: "Quản Lý Doanh Thu", icon: <PointOfSaleIcon />, path: OWNER_REVENUE },
    { name: "Quản Lý Lượng Người Tới Khám", icon: <GroupIcon />, path: OWNER_CHECK_UP },
    { name: "Quản Lý Lượng Người Dùng Dịch Vụ", icon: <GroupAddIcon />, path: OWNER_USER_SERVICE },
    { name: "Quản Lý Lượng Người Hủy Dịch Vụ", icon: <GroupRemoveIcon />, path: OWNER_USER_CANCEL_SERVICE },
]

export const sideBarDemoConfig = [
    { name: "Test Demo", icon: <BlurOnIcon />, path: DEMO_TEST },
]