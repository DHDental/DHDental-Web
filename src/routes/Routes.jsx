import { Navigate, useRoutes } from 'react-router-dom';

import { RequireAuth } from '../components';
import {
    Appointment, WaitingList, Treatment, Patients, NotFound,
    MedicalRegistration,
    DentistWaitingList, Login,
    DentalCareRecord, Bill, TestAdmin, OwnerTest, HistoryRecord, AllBill, TestDemo
} from '../pages';
import { StaffLayout, DentistLayout, AdminLayout, OwnerLayout, DemoLayout } from '../components/layouts';
import FindPatient from '../pages/bill/FindPatient';
import Medicine from '../pages/medicine/Medicine';




export default function Router() {
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
                { path: '/', element: <Navigate to="/login" /> },
                { path: '*', element: <Navigate to="/404" replace /> }
            ]
        },
        { path: '*', element: <Navigate to="/404" replace /> }

    ])
}