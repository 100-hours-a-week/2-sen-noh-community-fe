import { SERVER_URL } from './config.js';

const api = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response) {
            console.log(err.response.status);
            if (err.response.status === 401) {
                alert('세션만료입니다. 다시 로그인해주세요');
                window.location.replace('/login');
            } else if (err.response.status === 429) {
                alert(err.response.data);
            } else if (err.response.status === 500) {
                alert(err.response.data);
            }
        } else {
            alert('서버 통신 오류');
        }
        return Promise.reject(err);
    },
);

export default api;
