import { AiOutlineSchedule } from 'react-icons/ai';
import { BiBook, BiReceipt } from "react-icons/bi";
import { SiAdobeacrobatreader } from "react-icons/si";

export const sideBarStaffConfig = [
    { name: 'Danh sách đặt khám', icon: <AiOutlineSchedule />, path: '/staff/ds-dat-kham' },

    { name: 'Khám bệnh', icon: <SiAdobeacrobatreader />, path: '/staff/kham-benh' },
    { name: 'Bệnh nhân', icon: <BiBook />, path: '/staff/benh-nhan' },

    { name: 'Hóa đơn', icon: <BiReceipt />, path: '/staff/hoa-don' }
]
export const sideBarDentistConfig = [
    { name: 'Khám bệnh', icon: <SiAdobeacrobatreader />, path: '/dentist/kham-benh' },
]

// path
export const STAFF_DSDATKHAM = '/staff/ds-dat-kham'

// api
// export const BOOKING_GETALLBOOKINGSCHEDULE = '/booking/getAllBookingSchedule'
// export const BOOKING_CHECKIN = '/booking/checkin'
// export const BOOKING_SEARCH_BOOKING_SCHEDULE = '/booking/searchBookingSchedule'
// sidebar
/*
    color đường nét đứt #c1ccd8
*/

// apointment
/*
color check #04b205
color not check #4036364d
#8fc9ff màu xanh sidebar cũ
*/
