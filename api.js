const api = axios.create({
    baseURL: 'http://localhost:3000/api/',
    withCredentials: true,
});

api.interceptors.response.use(
    res => res,
    err => {
        console.log(err.response.status);
        if (err.response.status === 401) {
            alert('세션만료입니다. 다시 로그인해주세요');
            window.location.href = 'login.html';
        }
        return Promise.reject(err);
    },
);

export default api;
