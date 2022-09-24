import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
    // role này sau khi login sẽ lưu role user vào local storage
    // giờ chưa có login nên tạo dữ liệu giả vậy
    // if (!localStorage.getItem("role"))
    //     localStorage.setItem('role', 'staff')
    const role = localStorage.getItem('role')
    // console.log(role);
    const location = useLocation();

    return (
        allowedRoles?.includes(role)
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />

    );
}

export default RequireAuth;