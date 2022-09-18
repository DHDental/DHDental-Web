import EventNoteIcon from '@mui/icons-material/EventNote';
import PortraitIcon from '@mui/icons-material/Portrait';
import ArticleIcon from '@mui/icons-material/Article';
import AppsOutageIcon from '@mui/icons-material/AppsOutage';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AirplayIcon from '@mui/icons-material/Airplay';

import { STAFF_DSDATKHAM, STAFF_BENHNHAN, STAFF_DS_KHAM, STAFF_DANG_KI_KHAM, STAFF_MAN_HINH_CHO_KHAM } from './pathConstants'

export const sideBarStaffConfig = [
    { name: 'Danh sách đặt khám', icon: <EventNoteIcon />, path: STAFF_DSDATKHAM },
    { name: 'Bệnh nhân', icon: <PortraitIcon />, path: STAFF_BENHNHAN },
    { name: 'Đăng kí khám bệnh', icon: <PostAddIcon />, path: STAFF_DANG_KI_KHAM },
    { name: "Danh sách khám", icon: <AppsOutageIcon />, path: STAFF_DS_KHAM },
    { name: "Màn hình chờ khám", icon: <AirplayIcon />, path: STAFF_MAN_HINH_CHO_KHAM },


]