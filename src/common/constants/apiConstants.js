// api 
export const BOOKING_GETALLBOOKINGSCHEDULE = '/booking/getAllBookingSchedule'
export const BOOKING_CHECKIN = '/booking/checkInOrCancel'
export const BOOKING_SEARCH_BOOKING_SCHEDULE = '/booking/searchBookingSchedule'
export const LOGIN = '/auth/login'
export const DANGKIKHAMVANLAI = '/user/createUser'
export const GET_USER_INFO = '/user/getUserInfo'
export const SEARCH_SERVICE = '/service/searchServices'
export const LIST_SERVICE = '/service/getAllServices'
export const LIST_THUOC = '/medicine/getAllMedicines'
export const GETINFOEXAMINATE = '/user/getInfoExaminate'
export const TAO_HOADON = '/bill/createBillWithRecord'

export const UPDATE_STATUS_BILL = '/bill/changeStatusDetail'
export const CANCEL_SERVICE = '/bill/cancelService'

export const CREATE_RECORD = '/dentalCareRecord/createOrUpdateRecord'
export const GET_RECORDS = '/dentalCareRecord/getListDentalCareRecordByPhoneNumber'
export const GET_RECORDS_BY_BILL_DETAIL = '/dentalCareRecord/getListDentalCareRecordRelatedByBillDetailID'

export const CHECK_PAYMENT_OR_NOT = '/booking/checkPaymentOrNot'

export const LOGOUT = '/user/logoutAccount'

export const GET_PATIENT_PAYMENT = '/bill/getListPatientNotPayment'
export const TEST_BOOKING = 'script/bookingListPatient'
//admin
export const GET_ALL_USER_ADMIN = '/admin/getAllUser'
export const CRUD_ACCOUNT_ADMIN = '/admin/crudAccountForStaffOrDentist'
export const BAN_OR_ACTIVE_ACCOUNT_ADMIN = '/admin/banOrActiveAccount'


