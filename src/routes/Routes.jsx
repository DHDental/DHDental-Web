import { Navigate, useRoutes } from 'react-router-dom';

import { RequireAuth, Login, SidebarDentist } from '../components';
import {
    Appointment, WaitingList, Treatment, Patients, NotFound,
    MedicalRegistration,
    StaffWaitingList
} from '../pages';
import { StaffLayout } from '../components/layouts';


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
                        { path: 'ds-bn-kham', element: <StaffWaitingList /> },
                    ]
                }
            ]
        },
        {
            path: '/dentist',
            element: <RequireAuth allowedRoles={["dentist"]} />,
            children: [
                {
                    element: <SidebarDentist />,
                    children: [
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