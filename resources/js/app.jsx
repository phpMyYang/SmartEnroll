import "./bootstrap";
import "../css/app.scss";
import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Admin Layout & Pages (Galing sa Step 3)
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Strands from "./pages/admin/Strands";

// 👇 Placeholder Component
// Ito muna ang lalabas sa mga pages na gagawin pa lang natin sa Step 4
// para hindi mag-crash ang app pag kinlick mo ang sidebar menu.
const Placeholder = ({ title }) => (
    <div className="container-fluid p-4 fade-in">
        <h2 className="fw-bold text-dark mb-3">{title}</h2>
        <div className="card shadow-sm border-0">
            <div className="card-body text-center py-5">
                <i className="bi bi-cone-striped fs-1 text-warning mb-3"></i>
                <h4 className="text-muted">Work in Progress</h4>
                <p>
                    This module will be developed in <strong>Step 4</strong>.
                </p>
            </div>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* === PUBLIC ROUTES === */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                    path="/password-reset/:token"
                    element={<ResetPassword />}
                />

                {/* === 🔒 ADMIN ROUTES === */}
                {/* Lahat ng nasa loob nito ay gagamit ng Sidebar at Navbar */}
                <Route path="/admin" element={<AdminLayout />}>
                    {/* Default Redirect: Pag /admin lang, punta sa dashboard */}
                    <Route
                        index
                        element={<Navigate to="/admin/dashboard" replace />}
                    />

                    {/* Dashboard */}
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* User Management */}
                    <Route
                        path="users"
                        element={<Users title="Users Management" />}
                    />

                    <Route
                        path="students"
                        element={<Placeholder title="Student Management" />}
                    />
                    {/* Strand Management */}
                    <Route
                        path="strands"
                        element={<Strands title="Strand Management" />}
                    />
                    <Route
                        path="sections"
                        element={<Placeholder title="Section Management" />}
                    />
                    <Route
                        path="subjects"
                        element={<Placeholder title="Subject Management" />}
                    />
                    <Route
                        path="settings"
                        element={<Placeholder title="Enrollment Settings" />}
                    />
                </Route>

                {/* 404 Fallback: Pag walang match, balik sa login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

if (document.getElementById("app")) {
    createRoot(document.getElementById("app")).render(<App />);
}
