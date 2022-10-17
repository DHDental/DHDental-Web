import { Navigate, useRoutes } from 'react-router-dom';

import { RequireAuth } from '../components';
import {
    Appointment, WaitingList, Treatment, Patients, NotFound,
    MedicalRegistration,
    DentistWaitingList, Login,
    DentalCareRecord, Bill
} from '../pages';
import { StaffLayout, DentistLayout } from '../components/layouts';



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
                        { path: 'hoa-don', element: <Bill /> },
                        { path: 'hoa-don/:id', element: <Bill /> },
                        { path: 'dang-ki-kham-benh', element: <MedicalRegistration /> },

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
                    ]
                }
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