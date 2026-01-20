import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// 1. AUTO-ATTACH TOKEN (Para makilala kung sino ang naka-login)
const token = localStorage.getItem("token");
if (token) {
    window.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// 2. GLOBAL ERROR INTERCEPTOR
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // CASE A: 401 UNAUTHORIZED (Expired Session / Invalid Token)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            // Iwasan ang infinite loop kung nasa login page na
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        // CASE B: 503 SERVICE UNAVAILABLE (Maintenance Mode)
        if (error.response && error.response.status === 503) {
            // Iwasan ang infinite loop kung nasa maintenance page na
            if (window.location.pathname !== "/maintenance") {
                window.location.href = "/maintenance";
            }
        }

        return Promise.reject(error);
    },
);
