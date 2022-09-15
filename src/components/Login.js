import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // chỉ là handle login giả
    // login xong thì lưu thông tin user vào localStorage, trong
    // đó có 1 field là role để phân luồng user, xem RequireAuth.jsx, routes.js
    //
    // api Login =
    // formik/ react hook form, yup,
    const navigate = useNavigate();
    const handleLogin = () => {
        if (localStorage.getItem('role') === 'staff')
            navigate('/staff/ds-dat-kham', { replace: true });
        if (localStorage.getItem('role') === 'dentist')
            navigate('/dentist/kham-benh', { replace: true });
        if (localStorage.getItem('role') === undefined)
            localStorage.setItem("role", "staff");
        navigate('/staff/ds-dat-kham', { replace: true });
    }
    return (
        <>
            <div>Login</div>
            <Button onClick={handleLogin}>Login</Button>
        </>
    )
}

export default Login