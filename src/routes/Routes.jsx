import { Navigate, useRoutes } from 'react-router-dom';

import { RequireAuth } from '../components';
import {
    Appointment, WaitingList, Treatment, Patients, NotFound,
    MedicalRegistration,
    DentistWaitingList, Login,
    DentalCareRecord, Bill, TestAdmin, OwnerTest, HistoryRecord, AllBill, TestDemo, Medicine, EndUserTable
} from '../pages';
import { StaffLayout, DentistLayout, AdminLayout, OwnerLayout, DemoLayout } from '../components/layouts';
import FindPatient from '../pages/bill/FindPatient';
import OwnerUserService from '../pages/owner/OwnerUserService';
import jwtDecode from 'jwt-decode';
import { ADMIN_TEST, DENTIST_DS_KHAM, OWNER_TEST, STAFF_DSDATKHAM } from '../common/constants/pathConstants';
import dayjs from 'dayjs';
import { axiosPublic } from '../api/axiosInstance';
import UserCancelServiceTable from '../pages/owner/UserCancelServiceTable';
import CheckUpTable from '../pages/owner/CheckUpTable';
import RevenueTable from '../pages/owner/RevenueTable';




export default function Router() {

    let startPath = '/login';
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    if (loginInfo != undefined) {
        let user = jwtDecode(loginInfo?.token)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
        if (isExpired) {
            const refresh = async () => {
                const response = await axiosPublic.post(`/auth/refreshToken`, {
                    "refreshToken": loginInfo.refreshToken
                })
                localStorage.setItem('loginInfo', JSON.stringify(response.data))
                user = jwtDecode(response.data.token)
            }
            refresh()
        }
        const roleID = user?.roleID[0]?.authority
        switch (roleID) {
            case '3':
                startPath = DENTIST_DS_KHAM;
                break;
            case '2':
                startPath = STAFF_DSDATKHAM;
                break;
            case '1':
                startPath = ADMIN_TEST;
                break;
            case '5':
                startPath = OWNER_TEST;
                break;
            default:
                break;
        }
    }

    return useRoutes([
        {
            path: '/staff',
            element: <RequireAuth allowedRoles={['2']} />,
            children: [

                { path: 'man-hinh-cho-kham', element: <WaitingList /> },
                {
                    element: <StaffLayout />,
                    children: [

                        { path: 'ds-dat-kham', element: <Appointment /> },
                        { path: 'benh-nhan', element: <Patients /> },
                        { path: 'benh-nhan/hoa-don/:id', element: <AllBill /> },
                        { path: 'hoa-don', element: <FindPatient /> },
                        { path: 'hoa-don/:id', element: <Bill /> },
                        { path: 'dang-ki-kham-benh', element: <MedicalRegistration /> },
                        { path: 'danh-sach-thuoc', element: <Medicine /> },
                        {
                            path: 'lich-su-kham/:id', element: <HistoryRecord />,
                        },
                    ]
                }
            ]
        },
        {
            path: '/dentist',
            element: <RequireAuth allowedRoles={['3']} />,
            children: [
                {
                    element: <DentistLayout />,
                    children: [
                        { path: 'ds-bn-kham', element: <DentistWaitingList /> },
                        { path: 'kham-benh', element: <Treatment /> },
                        {
                            path: 'kham-benh/:id', element: <DentalCareRecord />,
                        },
                        {
                            path: 'kham-benh/lich-su-kham/:id', element: <HistoryRecord />,
                        },
                    ]
                }
            ]
        },
        {
            path: '/admin',
            element: <RequireAuth allowedRoles={['1']} />,
            children: [
                {
                    element: <AdminLayout />,
                    children: [
                        { path: 'test', element: <TestAdmin /> },
                        { path: 'end-user', element: <EndUserTable /> },
                    ]
                }
            ]
        },
        {
            path: '/owner',
            element: <RequireAuth allowedRoles={['5']} />,
            children: [
                {
                    element: <OwnerLayout />,
                    children: [
                        { path: 'test', element: <OwnerTest /> },
                        { path: 'user-service', element: <OwnerUserService /> },
                        { path: 'user-cancel-service', element: <UserCancelServiceTable /> },
                        { path: 'check-up', element: <CheckUpTable /> },
                        { path: 'revenue', element: <RevenueTable /> },
                    ]
                }
            ]
        },
        {
            path: '/test',
            element: <DemoLayout />,
            children: [
                { path: 'demo', element: <TestDemo /> }
            ]
        },
        {
            path: '/',
            children: [
                { path: 'login', element: <Login /> },
                { path: '404', element: <NotFound /> },
                { path: '/', element: <Navigate to={startPath} /> },
                { path: '*', element: <Navigate to="/404" replace /> }
            ]
        },
        { path: '*', element: <Navigate to="/404" replace /> }

    ])
}