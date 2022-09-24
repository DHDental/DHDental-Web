import { Navigate, useRoutes } from 'react-router-dom';

import { RequireAuth } from '../components';
import {
    Appointment, WaitingList, Treatment, Patients, NotFound,
    MedicalRegistration,
    DentistWaitingList, Login
} from '../pages';
import { StaffLayout, DentistLayout } from '../components/layouts';


export default function Router() {
    return useRoutes([
        {
            path: '/staff',
            element: <RequireAuth allowedRoles={["staff"]} />,
            children: [

                { path: 'man-hinh-cho-kham', element: <WaitingList /> },
                {
                    element: <StaffLayout />,
                    children: [

                        { path: 'ds-dat-kham', element: <Appointment /> },
                        { path: 'benh-nhan', element: <Patients /> },
                        { path: 'dang-ki-kham-benh', element: <MedicalRegistration /> },

                    ]
                }
            ]
        },
        {
            path: '/dentist',
            element: <RequireAuth allowedRoles={["dentist"]} />,
            children: [
                {
                    element: <DentistLayout />,
                    children: [
                        { path: 'ds-bn-kham', element: <DentistWaitingList /> },
                        { path: 'kham-benh', element: <Treatment /> },
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