const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});

api.interceptors.response.use(
    res => res,
    err => {
        console.log(err.response.status);
        if (err.response.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(err);
    },
);

export default api;
