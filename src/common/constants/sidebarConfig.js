import EventNoteIcon from '@mui/icons-material/EventNote';
import PortraitIcon from '@mui/icons-material/Portrait';
import ArticleIcon from '@mui/icons-material/Article';
import AppsOutageIcon from '@mui/icons-material/AppsOutage';

import { STAFF_DSDATKHAM, STAFF_BENHNHAN, STAFF_DS_CHO_KHAM } from './pathConstants'

export const sideBarStaffConfig = [
    { name: 'Danh sách đặt khám', icon: <EventNoteIcon />, path: STAFF_DSDATKHAM },
    { name: 'Bệnh nhân', icon: <PortraitIcon />, path: STAFF_BENHNHAN },
    { name: "Danh sách chờ khám", icon: <AppsOutageIcon />, path: STAFF_DS_CHO_KHAM },

]