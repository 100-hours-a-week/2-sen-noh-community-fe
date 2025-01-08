import { SERVER_URL } from './config.js';

const api = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    res => res,
    err => {
        console.log(err.response.status);
        if (err.response.status === 401) {
            alert('세션만료입니다. 다시 로그인해주세요');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    },
);

export default api;
