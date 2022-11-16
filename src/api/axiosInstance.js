import axios from "axios";
import dayjs from "dayjs";
import jwtDecode from "jwt-decode";

// const BASE_URL = 'https://javaclusters-88685-0.cloudclusters.net';
const BASE_URL = 'http://localhost:8080';

const axiosPublic = axios.create({
    baseURL: BASE_URL
});

// lấy token từ localStorage (sau khi login lưu token vào localStorage)
let loginInfo = localStorage.getItem('loginInfo') ? JSON.parse(localStorage.getItem('loginInfo')) : null

const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {

        Authorization: `Bearer ${loginInfo?.token}`,
    }
});

// xử lí refresh token ở đây
axiosPrivate.interceptors.request.use(async req => {
    if (!loginInfo) {
        loginInfo = localStorage.getItem('loginInfo') ? JSON.parse(localStorage.getItem('loginInfo')) : null
        req.headers.Authorization = `Bearer ${loginInfo?.token}`
    }
    const user = jwtDecode(loginInfo.token)
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
    console.log('isExpired:', isExpired);
    console.log('jwtToken:', req.headers.Authorization);
    if (!isExpired) return req
    return req
})
//////
export { axiosPrivate, axiosPublic }
