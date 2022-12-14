import axios from "axios";
import dayjs from "dayjs";
import jwtDecode from "jwt-decode";

const BASE_URL = 'https://javaclusters-97819-0.cloudclusters.net';
// const BASE_URL = 'http://localhost:8080';

const axiosPublic = axios.create({
    baseURL: BASE_URL
});

let loginInfo = localStorage.getItem('loginInfo') ? JSON.parse(localStorage.getItem('loginInfo')) : null

const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${loginInfo?.token}`,
    }
});

axiosPrivate.interceptors.request.use(async req => {
    if (!loginInfo) {
        loginInfo = localStorage.getItem('loginInfo') ? JSON.parse(localStorage.getItem('loginInfo')) : null
        // console.log(loginInfo?.token);
        req.headers.Authorization = `Bearer ${loginInfo?.token}`
    } else { req.headers.Authorization = `Bearer ${loginInfo?.token}` }
    const user = jwtDecode(loginInfo.token)
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
    // console.log('isExpired:', isExpired);
    // console.log('jwtToken:', req.headers.Authorization);
    if (!isExpired) return req

    const response = await axios.post(`${BASE_URL}/auth/refreshToken`, {
        "refreshToken": loginInfo.refreshToken
    })
    localStorage.setItem('loginInfo', JSON.stringify(response.data))
    req.headers.Authorization = `Bearer ${response.data.token}`

    return req
})

export { axiosPrivate, axiosPublic }
