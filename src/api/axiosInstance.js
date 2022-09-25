import axios from "axios";
import jwtDecode from "jwt-decode";

// const BASE_URL = 'https://javaclusters-88685-0.cloudclusters.net';
const BASE_URL = 'http://localhost:8080';

const axiosPublic = axios.create({
    baseURL: BASE_URL
});

// lấy token từ localStorage (sau khi login lưu token vào localStorage)
let token = localStorage.getItem('token')

const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${token}` }
});

// xử lí refresh token ở đây
//
export { axiosPrivate, axiosPublic }
