import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// 👇 AUTO-ATTACH TOKEN (Ito ang solusyon sa 401 Error)
const token = localStorage.getItem("token");
if (token) {
    window.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Optional: Auto-logout kapag expired na ang token
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login"; // Force logout
        }
        return Promise.reject(error);
    }
);
