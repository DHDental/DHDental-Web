import jwtDecode from "jwt-decode";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    const user = jwtDecode(loginInfo?.token)
    const roleID = user?.roleID[0].authority
    const location = useLocation();

    return (
        allowedRoles?.includes(roleID)
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />

    );
}

export default RequireAuth;