// api 
export const BOOKING_GETALLBOOKINGSCHEDULE = '/booking/getAllBookingSchedule'
export const BOOKING_CHECKIN = '/booking/checkInOrCancel'
export const BOOKING_SEARCH_BOOKING_SCHEDULE = '/booking/searchBookingSchedule'
export const LOGIN = '/auth/login'
export const DANGKIKHAMVANLAI = '/booking/createUser'
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

export const TEST_BOOKING = '/script/testBookingOnlineAndOffline'
export const ENABLE_BOOKING = '/script/enableCheckInEveryTime'
export const DISABLE_BOOKING = '/script/disableCheckInEveryTime'
export const ENABLE_NOTIFY = 'script/remindExaminationTest'
export const CHECK_IN_CANCEL_SCRIPT = 'script/testCheckInAndCancel'

export const CHECK_DANG_KY = '/booking/checkCreateBookingByStaffForPatient'

//Staff Medicine
export const GET_ALL_MEDICINES = '/medicine/getAllMedicines'
export const SET_MEDICINE_MASTER = '/medicine/setMedicineMaster'

//admin
export const GET_ALL_USER_ADMIN = '/admin/getAllUser'
export const CRUD_ACCOUNT_ADMIN = '/admin/crudAccountForStaffOrDentist'
export const BAN_OR_ACTIVE_ACCOUNT_ADMIN = '/admin/banOrActiveAccount'

//Owner
export const GET_ALL_SERVICES = '/service/getAllServices'
export const CREATE_SERVICE = '/service/createService'
export const UPDATE_SERVICE = '/service/updatePriceService'
export const DELETE_SERVICE = '/service/deleteService'
export const COUNT_NUMBER_VISITED_BY_RANGE_TIME = '/dentalCareRecord/countNumberVisitedByRangeTime'
export const GET_ALL_TURN_OVER_RANGE_TIME = '/turnover/getAllTurnoverRangeTime'
export const GET_USER_WITH_SERVICE = '/bill/getUserWithService'
export const GET_USER_CANCEL_SERVICE = '/bill/getUserWithCancelService'



