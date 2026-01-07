import "./bootstrap";
import "../css/app.scss";
import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />{" "}
                {/* Initial Landing Page */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                    path="/password-reset/:token"
                    element={<ResetPassword />}
                />
            </Routes>
        </BrowserRouter>
    );
}

if (document.getElementById("app")) {
    createRoot(document.getElementById("app")).render(<App />);
}
